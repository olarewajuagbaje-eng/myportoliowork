const e="StockGuard — Shopify Inventory Intelligence",t=[{parameters:{content:`## 📌 STOCKGUARD — BUILD & LLM NOTES

**PURPOSE**
Shopify inventory monitoring, risk detection, operational alerts, inventory event tracking, anomaly detection, restock monitoring and revenue-protection automation. It does NOT claim to prevent overselling. Shopify does not fire inventory webhooks for every inventory-state change (e.g. committed, reserved, damaged, safety stock, quality control).

**ARCHITECTURE**
Shopify (inventory_levels/update webhook) -> n8n -> Airtable -> Email -> (Google Sheets, added manually) -> AI Agent (explanations only)

**THREE FLOWS ON THIS CANVAS**
1. INGEST: Webhook -> Verify & Normalize -> Config -> IF valid -> duplicate check -> product lookup -> Intelligence (Code) -> write Events/Products/Stockouts/Anomalies/Alerts/Logs.
2. DAILY REPORT: Schedule 08:00 -> Airtable reads -> Build Report Facts (Code, deterministic) -> AI Summary (Agent) -> email -> Reports table.
3. ERROR HANDLER: Error Trigger -> Logs table -> email. Set this workflow as its own error workflow in Workflow Settings.

**ROLES**
- Shopify = source of truth for current available quantity per inventory item per location.
- n8n = orchestration + ALL business logic (status, days of stock, risk score, reorder, anomaly, alert decision).
- Airtable = operational DB (Products, Events, Alerts, Stockouts, Anomalies, Logs, Reports). Tables are referenced by name.
- Google Sheets = OPTIONAL reporting export. NOT included in this JSON: add a Google Sheets node after 'Build Report Facts' manually.
- Email (SMTP node) = merchant notifications.
- AI Agent = writes plain-language summary from already-calculated facts. It never computes or changes quantities.

**DETERMINISTIC (Code nodes) vs AI**
Deterministic: idempotency key, status, days remaining, risk score, reorder qty, anomaly flag, alert/cooldown decision, stockout duration. AI: wording only.

**RISK SCORE (0-100)**
SOLD_OUT = 100. Otherwise threshold part (0-40) = 40 x (1 - min(1, stock / (2 x low threshold))) + runway part (0-50) = 50 x (1 - min(1, daysRemaining / 14)) + 10 if daysRemaining < supplier lead time. Without sales data: threshold part scaled to max 80. Capped at 99 unless sold out.

**STATUS**
SOLD_OUT: stock <= 0. CRITICAL: stock <= ceil(low x 0.5) or days <= 3. LOW_STOCK: stock <= low or days < lead time. Else HEALTHY. Event types: STOCKOUT, RESTOCK, ANOMALY, STATUS_CHANGE, UPDATE, BASELINE.

**REORDER (rule-based, NOT a forecast)**
target = ceil(avgDailySales x leadTimeDays + safetyStock); qty = max(0, target - current). Needs 'Avg Daily Sales' in Products (manual in v1).

**IDEMPOTENCY**
event_key = inventory_item_id|location_id|available|updated_at, stored in Events. A retry produces the same key and is logged as duplicate. Limitation: two genuinely different updates with identical quantity AND identical timestamp collapse into one.

**CONFIG (edit 3 'Config' Set nodes: Ingest, Report, Errors)**
baseId, alertEmail, fromEmail, thresholds, cooldown. Keep the three in sync.

**CREDENTIALS TO CONNECT MANUALLY (none are stored in this file)**
1. Airtable Personal Access Token -> every 'HTTP Request' node using Airtable (choose Airtable Token API).
2. SMTP account -> 3 Email nodes (or swap for Gmail node).
3. LLM Chat Model -> drag a Chat Model sub-node into 'AI Summary' Model slot (any provider).
4. Env var SHOPIFY_WEBHOOK_SECRET (self-hosted) for HMAC check. If unavailable the check is SKIPPED and logged as skipped_no_secret: acceptable for demo only.

**TEST**
Activate workflow, use Production webhook URL in Shopify app config, edit Available in Shopify Inventory, watch Airtable. Full test plan in the guide.

**LIMITATIONS**
No order-activity correlation (anomalies are quantity-based only). Avg Daily Sales is manual. Variant thresholds are per inventory item. Airtable list calls read up to 100 records (paginate for larger catalogs). Anomaly text is always 'manual review recommended', never a fraud/sync-failure claim.

**FUTURE**
Sales velocity from Shopify orders (7/14/30d), waitlist/restock notifications, multi-location roll-ups, Slack, purchase orders/ERP, per-client Configuration table.`,height:1180,width:620,color:4},name:"📌 STOCKGUARD — BUILD & LLM NOTES",type:"n8n-nodes-base.stickyNote",typeVersion:1,position:[-3344,224]},{parameters:{httpMethod:"POST",path:"stockguard-inventory",options:{rawBody:!0}},name:"Shopify Inventory Webhook",type:"n8n-nodes-base.webhook",typeVersion:2,position:[-2640,304]},{parameters:{jsCode:`// Verify Shopify HMAC (if secret available), validate payload, build event + idempotency key.
const item = $input.first();
const headers = item.json.headers || {};
const body = item.json.body || {};
const errors = [];
let valid = true;
let hmacStatus = 'skipped_no_secret';
let secret = '';
try { secret = $env.SHOPIFY_WEBHOOK_SECRET || ''; } catch (e) { secret = ''; }
if (secret) {
  try {
    const crypto = require('crypto');
    const raw = await this.helpers.getBinaryDataBuffer(0, 'data');
    const digest = crypto.createHmac('sha256', secret).update(raw).digest('base64');
    const sent = String(headers['x-shopify-hmac-sha256'] || '');
    const a = Buffer.from(digest);
    const b = Buffer.from(sent);
    hmacStatus = (a.length === b.length && crypto.timingSafeEqual(a, b)) ? 'verified' : 'failed';
    if (hmacStatus === 'failed') { valid = false; errors.push('HMAC verification failed'); }
  } catch (e) {
    hmacStatus = 'error';
    valid = false;
    errors.push('HMAC check error: ' + e.message);
  }
}
const inv = body.inventory_item_id;
const loc = body.location_id;
const avail = body.available;
if (inv === undefined || inv === null || inv === '') { valid = false; errors.push('missing inventory_item_id'); }
if (loc === undefined || loc === null || loc === '') { valid = false; errors.push('missing location_id'); }
if (typeof avail !== 'number' || Number.isNaN(avail)) { valid = false; errors.push('missing or non-numeric available quantity'); }
const updatedAt = body.updated_at || null;
const event = {
  inventory_item_id: inv === undefined || inv === null ? '' : String(inv),
  location_id: loc === undefined || loc === null ? '' : String(loc),
  available: typeof avail === 'number' ? avail : null,
  updated_at: updatedAt,
  topic: headers['x-shopify-topic'] || 'inventory_levels/update',
  shop: headers['x-shopify-shop-domain'] || '',
  webhook_id: headers['x-shopify-webhook-id'] || ''
};
const eventKey = [event.inventory_item_id, event.location_id, event.available, event.updated_at || 'no-ts'].join('|');
return [{ json: { valid, errors, hmac_status: hmacStatus, event, event_key: eventKey, received_at: new Date().toISOString() } }];
`},name:"Verify & Normalize",type:"n8n-nodes-base.code",typeVersion:2,position:[-2400,304]},{parameters:{assignments:{assignments:[{name:"baseId",value:"=appXrNLemdGUd7Q6L",type:"string"},{name:"alertEmail",value:"merchant@example.com",type:"string"},{name:"fromEmail",value:"stockguard@example.com",type:"string"},{name:"defaultLowThreshold",value:10,type:"number"},{name:"criticalRatio",value:.5,type:"number"},{name:"criticalDays",value:3,type:"number"},{name:"runwayCapDays",value:14,type:"number"},{name:"anomalyDropPct",value:30,type:"number"},{name:"anomalyRisePct",value:150,type:"number"},{name:"anomalyMinUnits",value:5,type:"number"},{name:"cooldownMinutes",value:1440,type:"number"}]},includeOtherFields:!0,options:{}},name:"Config (Ingest)",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-2160,304]},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{leftValue:"={{ $json.valid }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},options:{}},name:"IF Valid",type:"n8n-nodes-base.if",typeVersion:2,position:[-1920,304]},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Logs",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: { 'Summary': 'Rejected webhook', 'Time': new Date().toISOString(), 'Workflow': 'Ingest', 'Event Type': 'REJECTED', 'Product': String($json.event.inventory_item_id || ''), 'Status': 'REJECTED', 'Result': 'Payload rejected', 'Error': ($json.errors || []).join('; '), 'Execution ID': String($execution.id) } }) }}",options:{}},name:"Log Rejected",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-1680,512],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Events",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendQuery:!0,queryParameters:{parameters:[{name:"filterByFormula",value:`={{ "{Event Key}='" + $json.event_key + "'" }}`},{name:"maxRecords",value:"1"}]},options:{}},name:"Check Duplicate",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-1680,304],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:1},conditions:[{leftValue:"={{ $json.records.length }}",rightValue:0,operator:{type:"number",operation:"equals"}}],combinator:"and"},options:{}},name:"IF Is New",type:"n8n-nodes-base.if",typeVersion:2,position:[-1440,304]},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Logs",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: { 'Summary': 'Duplicate webhook ignored', 'Time': new Date().toISOString(), 'Workflow': 'Ingest', 'Event Type': 'DUPLICATE', 'Product': $('Config (Ingest)').first().json.event.inventory_item_id, 'Status': 'DUPLICATE', 'Result': 'No action taken', 'Error': '', 'Execution ID': String($execution.id) } }) }}",options:{}},name:"Log Duplicate",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-1200,512],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Products",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendQuery:!0,queryParameters:{parameters:[{name:"filterByFormula",value:`={{ "{Inventory Item ID}='" + $('Config (Ingest)').first().json.event.inventory_item_id + "'" }}`},{name:"maxRecords",value:"1"}]},options:{}},name:"Get Product",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-1200,304],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{jsCode:`// STOCKGUARD deterministic intelligence. The AI is NOT involved here.
const cfg = $('Config (Ingest)').first().json;
const ev = cfg.event;
const recs = ($('Get Product').first().json.records) || [];
const nowIso = new Date().toISOString();
if (recs.length === 0) {
  return [{ json: { found: false, event: ev, reason: 'No Products row with Inventory Item ID ' + ev.inventory_item_id } }];
}
const rec = recs[0];
const f = rec.fields || {};
const num = (v, d = null) => (v === undefined || v === null || v === '' || Number.isNaN(Number(v))) ? d : Number(v);
const esc = s => String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const warnings = [];

let stock = Number(ev.available);
if (stock < 0) { warnings.push('Negative available quantity treated as 0'); stock = 0; }
const prev = num(f['Current Stock']);
let low = num(f['Low Threshold']);
if (low === null || low <= 0) { warnings.push('Missing Low Threshold; default used'); low = cfg.defaultLowThreshold; }
const lead = num(f['Lead Time Days'], 0);
const safety = num(f['Safety Stock'], 0);
let avg = num(f['Avg Daily Sales']);
if (avg !== null && avg <= 0) avg = null;
if (avg === null) warnings.push('No sales velocity; runway not calculated');
const days = stock <= 0 ? 0 : (avg !== null ? Math.round((stock / avg) * 10) / 10 : null);

// Status
const criticalThreshold = Math.max(1, Math.ceil(low * cfg.criticalRatio));
let status;
if (stock <= 0) status = 'SOLD_OUT';
else if (stock <= criticalThreshold || (days !== null && days <= cfg.criticalDays)) status = 'CRITICAL';
else if (stock <= low || (days !== null && lead > 0 && days < lead)) status = 'LOW_STOCK';
else status = 'HEALTHY';

// Risk score
const thrScore = 40 * (1 - Math.min(1, stock / (low * 2)));
let risk;
if (status === 'SOLD_OUT') risk = 100;
else if (days !== null) {
  const runScore = 50 * (1 - Math.min(1, days / cfg.runwayCapDays));
  const ltScore = (lead > 0 && days < lead) ? 10 : 0;
  risk = Math.min(99, Math.round(thrScore + runScore + ltScore));
} else {
  risk = Math.min(99, Math.round((thrScore / 40) * 80));
}

// Reorder recommendation (rule-based)
const target = avg !== null ? Math.ceil(avg * lead + safety) : null;
const reorderRequired = avg !== null ? stock < target : stock <= low;
const reorderQty = target !== null ? Math.max(0, target - stock) : null;

// Event classification
const isStockout = stock <= 0 && (prev === null || prev > 0);
const isRestock = prev !== null && prev <= 0 && stock > 0;
let anomalyRule = null;
let changePct = null;
if (prev !== null && prev > 0) {
  changePct = Math.round(((stock - prev) / prev) * 1000) / 10;
  const units = Math.abs(stock - prev);
  if (stock < prev && (-changePct) >= cfg.anomalyDropPct && units >= cfg.anomalyMinUnits) {
    anomalyRule = 'Large drop: ' + changePct + '% (' + units + ' units)';
  } else if (stock > prev && changePct >= cfg.anomalyRisePct && units >= cfg.anomalyMinUnits) {
    anomalyRule = 'Large increase: +' + changePct + '% (' + units + ' units)';
  }
}
const prevStatus = f['Stock Status'] || 'HEALTHY';
let eventType;
if (isStockout) eventType = 'STOCKOUT';
else if (isRestock) eventType = 'RESTOCK';
else if (anomalyRule) eventType = 'ANOMALY';
else if (prev === null) eventType = 'BASELINE';
else if (status !== prevStatus) eventType = 'STATUS_CHANGE';
else eventType = 'UPDATE';

// Alert decision with cooldown
const rank = { HEALTHY: 0, LOW_STOCK: 1, CRITICAL: 2, SOLD_OUT: 3 };
const worsened = (rank[status] || 0) > (rank[prevStatus] || 0);
const lastAlertStatus = f['Last Alert Status'] || null;
const lastAlertTime = f['Last Alert Time'] ? new Date(f['Last Alert Time']).getTime() : null;
const minsSince = lastAlertTime ? (Date.now() - lastAlertTime) / 60000 : null;
const suppressed = lastAlertStatus === status && minsSince !== null && minsSince < cfg.cooldownMinutes;
let alertType = null;
if (isStockout) alertType = 'STOCKOUT';
else if (worsened && !suppressed && status === 'CRITICAL') alertType = 'CRITICAL';
else if (anomalyRule) alertType = 'ANOMALY';
else if (worsened && !suppressed && status === 'LOW_STOCK') alertType = 'LOW_STOCK';
else if (isRestock) alertType = 'RESTOCK';
const priorityMap = { STOCKOUT: 'URGENT', CRITICAL: 'HIGH', ANOMALY: 'REVIEW', LOW_STOCK: 'NORMAL', RESTOCK: 'INFO' };
const actionMap = {
  STOCKOUT: 'Product is out of stock. Review replenishment and decide whether to pause promotion or offer an alternative.',
  CRITICAL: 'Review replenishment immediately.',
  ANOMALY: 'Inventory anomaly detected — manual review recommended.',
  LOW_STOCK: 'Plan a reorder soon.',
  RESTOCK: 'Confirm the restocked quantity is correct.'
};
const emoji = { STOCKOUT: '🔴', CRITICAL: '🚨', ANOMALY: '⚠️', LOW_STOCK: '🟡', RESTOCK: '🟢' };
const name = f['Product Name'] || 'Unknown product';
const variant = f['Variant'] ? ' — ' + f['Variant'] : '';
const sku = f['SKU'] || '';
let alert = { needed: false };
if (alertType) {
  const rows = [
    ['Product', esc(name + variant)], ['SKU', esc(sku)], ['Current stock', stock],
    ['Previous stock', prev === null ? 'n/a' : prev], ['Low threshold', low], ['Status', status],
    ['Risk score', risk + '/100'], ['Days of stock remaining', days === null ? 'n/a (no sales data)' : days],
    ['Suggested reorder qty (rule-based)', reorderQty === null ? 'n/a' : reorderQty]
  ];
  if (anomalyRule) rows.push(['Anomaly rule', esc(anomalyRule)]);
  rows.push(['Time (UTC)', nowIso]);
  const html = '<h2>' + emoji[alertType] + ' ' + alertType.replace('_', ' ') + ' — ' + esc(name + variant) + '</h2>'
    + '<table cellpadding="6" style="border-collapse:collapse">'
    + rows.map(r => '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>').join('') + '</table>'
    + '<p><b>Recommended human action:</b> ' + actionMap[alertType] + '</p>'
    + '<p style="color:#888">Rule-based alert generated by StockGuard. Quantities come from Shopify webhook data.</p>';
  alert = { needed: true, type: alertType, priority: priorityMap[alertType],
    subject: emoji[alertType] + ' [' + priorityMap[alertType] + '] ' + alertType.replace('_', ' ') + ': ' + name + variant + ' (' + sku + ')', html };
}

const productFields = {
  'Current Stock': stock, 'Previous Stock': prev, 'Stock Status': status, 'Risk Score': risk,
  'Days Remaining': days, 'Recommended Reorder Qty': reorderQty, 'Reorder Required': reorderRequired,
  'Last Event Key': cfg.event_key, 'Last Updated': nowIso
};
if (alert.needed) { productFields['Last Alert Status'] = status; productFields['Last Alert Time'] = nowIso; }
if (isStockout) { productFields['Stockout Open'] = true; productFields['Last Stockout'] = nowIso; }
if (isRestock) { productFields['Stockout Open'] = false; productFields['Last Restock'] = nowIso; }

const eventFields = {
  'Event Key': cfg.event_key, 'Webhook ID': ev.webhook_id, 'Event Time': ev.updated_at || nowIso,
  'Product Name': name, 'Variant': f['Variant'] || '', 'SKU': sku, 'Inventory Item ID': ev.inventory_item_id,
  'Location ID': ev.location_id, 'Previous Stock': prev, 'Current Stock': stock,
  'Change': prev === null ? null : stock - prev, 'Event Type': eventType, 'Stock Status': status,
  'Risk Score': risk, 'Days Remaining': days, 'Anomaly Flag': !!anomalyRule, 'Shop': ev.shop,
  'Product': [rec.id]
};
const stamp = nowIso.replace(/[-:.TZ]/g, '').slice(0, 14);
const stockoutFields = isStockout ? {
  'Stockout ID': sku + '-' + stamp, 'Product Name': name, 'Variant': f['Variant'] || '', 'SKU': sku,
  'Inventory Item ID': ev.inventory_item_id, 'Location ID': ev.location_id, 'Previous Stock': prev,
  'Stockout Start': ev.updated_at || nowIso, 'Status': 'OPEN', 'Risk Score': 100, 'Product': [rec.id]
} : null;
const anomalyFields = anomalyRule ? {
  'Anomaly ID': sku + '-' + stamp, 'Detected At': nowIso, 'Product Name': name, 'SKU': sku,
  'Previous Stock': prev, 'Current Stock': stock, 'Change Percent': changePct, 'Rule Triggered': anomalyRule,
  'Status': 'NEW', 'Note': 'Inventory anomaly detected — manual review recommended.', 'Product': [rec.id]
} : null;

return [{ json: {
  found: true, recordId: rec.id, event: ev, eventType, status, risk, days, stock, prev, low, reorderQty, reorderRequired,
  isStockout, isRestock, isAnomaly: !!anomalyRule, anomalyRule, warnings, alert,
  eventFields, productFields, stockoutFields, anomalyFields,
  name, sku, variant: f['Variant'] || '', restockTime: ev.updated_at || nowIso, quantityRestored: isRestock ? stock : null
} }];
`},name:"Intelligence",type:"n8n-nodes-base.code",typeVersion:2,position:[-960,304]},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:1},conditions:[{leftValue:"={{ $json.found }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},options:{}},name:"IF Product Found",type:"n8n-nodes-base.if",typeVersion:2,position:[-720,304]},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Logs",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: { 'Summary': 'Unmapped inventory item', 'Time': new Date().toISOString(), 'Workflow': 'Ingest', 'Event Type': 'UNMAPPED', 'Product': $('Config (Ingest)').first().json.event.inventory_item_id, 'Status': 'UNMAPPED', 'Result': $json.reason, 'Error': '', 'Execution ID': String($execution.id) } }) }}",options:{}},name:"Log Unmapped",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-480,528],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Events",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: $('Intelligence').first().json.eventFields }) }}",options:{}},name:"Create Event",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-480,304],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{method:"PATCH",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Products/{{ $('Intelligence').first().json.recordId }}",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: $('Intelligence').first().json.productFields }) }}",options:{}},name:"Update Product",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-240,304],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{leftValue:"={{ $('Intelligence').first().json.alert.needed }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},options:{}},name:"IF Send Alert",type:"n8n-nodes-base.if",typeVersion:2,position:[0,0]},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Alerts",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: { 'Alert ID': $('Intelligence').first().json.sku + '-' + Date.now(), 'Sent At': new Date().toISOString(), 'Alert Type': $('Intelligence').first().json.alert.type, 'Priority': $('Intelligence').first().json.alert.priority, 'Product Name': $('Intelligence').first().json.name, 'SKU': $('Intelligence').first().json.sku, 'Current Stock': $('Intelligence').first().json.stock, 'Risk Score': $('Intelligence').first().json.risk, 'Recipient': $('Config (Ingest)').first().json.alertEmail, 'Delivery Status': ($json.error ? 'EMAIL_FAILED' : 'SENT'), 'Product': [$('Intelligence').first().json.recordId] } }) }}",options:{}},name:"Record Alert",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[768,-80],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{leftValue:"={{ $('Intelligence').first().json.isStockout }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},options:{}},name:"IF Stockout",type:"n8n-nodes-base.if",typeVersion:2,position:[0,208]},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Stockouts",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: $('Intelligence').first().json.stockoutFields }) }}",options:{}},name:"Create Stockout",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[240,208],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{leftValue:"={{ $('Intelligence').first().json.isRestock }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},options:{}},name:"IF Restock",type:"n8n-nodes-base.if",typeVersion:2,position:[0,400]},{parameters:{url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Stockouts",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendQuery:!0,queryParameters:{parameters:[{name:"filterByFormula",value:`={{ "AND({Inventory Item ID}='" + $('Intelligence').first().json.event.inventory_item_id + "',{Status}='OPEN')" }}`},{name:"maxRecords",value:"1"}]},options:{}},name:"Find Open Stockout",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[240,400],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{jsCode:`// Compute stockout duration for the OPEN stockout being closed.
const it = $('Intelligence').first().json;
const recs = ($input.first().json.records) || [];
if (recs.length === 0) return [];
const rec = recs[0];
const start = rec.fields['Stockout Start'] ? new Date(rec.fields['Stockout Start']).getTime() : null;
const end = new Date(it.restockTime).getTime();
const hours = start ? Math.max(0, Math.round(((end - start) / 3600000) * 100) / 100) : null;
return [{ json: { recordId: rec.id, fields: { 'Status': 'CLOSED', 'Restock Time': it.restockTime, 'Quantity Restored': it.quantityRestored, 'Duration Hours': hours } } }];
`},name:"Prepare Close Stockout",type:"n8n-nodes-base.code",typeVersion:2,position:[480,400]},{parameters:{method:"PATCH",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Stockouts/{{ $json.recordId }}",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: $json.fields }) }}",options:{}},name:"Close Stockout",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[720,400],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{leftValue:"={{ $('Intelligence').first().json.isAnomaly }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},options:{}},name:"IF Anomaly",type:"n8n-nodes-base.if",typeVersion:2,position:[0,608]},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Anomalies",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: $('Intelligence').first().json.anomalyFields }) }}",options:{}},name:"Create Anomaly",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[240,608],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Ingest)').first().json.baseId }}/Logs",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: { 'Summary': $('Intelligence').first().json.eventType + ': ' + $('Intelligence').first().json.sku, 'Time': new Date().toISOString(), 'Workflow': 'Ingest', 'Event Type': $('Intelligence').first().json.eventType, 'Product': $('Intelligence').first().json.sku, 'Status': 'OK', 'Result': 'Processed. Status=' + $('Intelligence').first().json.status + ' Risk=' + $('Intelligence').first().json.risk, 'Error': ($('Intelligence').first().json.warnings || []).join('; '), 'Execution ID': String($execution.id) } }) }}",options:{}},name:"Log Success",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[0,832],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{},name:"Error Trigger",type:"n8n-nodes-base.errorTrigger",typeVersion:1,position:[-2640,1600]},{parameters:{assignments:{assignments:[{name:"baseId",value:"appXrNLemdGUd7Q6L",type:"string"},{name:"alertEmail",value:"merchant@example.com",type:"string"},{name:"fromEmail",value:"stockguard@example.com",type:"string"},{name:"defaultLowThreshold",value:10,type:"number"},{name:"criticalRatio",value:.5,type:"number"},{name:"criticalDays",value:3,type:"number"},{name:"runwayCapDays",value:14,type:"number"},{name:"anomalyDropPct",value:30,type:"number"},{name:"anomalyRisePct",value:150,type:"number"},{name:"anomalyMinUnits",value:5,type:"number"},{name:"cooldownMinutes",value:1440,type:"number"}]},includeOtherFields:!0,options:{}},name:"Config (Errors)",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-2400,1600]},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Errors)').first().json.baseId }}/Logs",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: { 'Summary': 'Workflow error: ' + ($('Error Trigger').first().json.execution.lastNodeExecuted || 'unknown node'), 'Time': new Date().toISOString(), 'Workflow': 'ErrorHandler', 'Event Type': 'ERROR', 'Product': '', 'Status': 'ERROR', 'Result': 'Execution failed', 'Error': String(($('Error Trigger').first().json.execution.error || {}).message || 'unknown').slice(0, 500), 'Execution ID': String($execution.id) } }) }}",options:{}},name:"Log Error",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-2160,1600],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{rule:{interval:[{triggerAtHour:8}]}},name:"Daily 8AM Trigger",type:"n8n-nodes-base.scheduleTrigger",typeVersion:1.2,position:[-2640,1008]},{parameters:{assignments:{assignments:[{name:"baseId",value:"appXrNLemdGUd7Q6L",type:"string"},{name:"alertEmail",value:"merchant@example.com",type:"string"},{name:"fromEmail",value:"stockguard@example.com",type:"string"},{name:"defaultLowThreshold",value:10,type:"number"},{name:"criticalRatio",value:.5,type:"number"},{name:"criticalDays",value:3,type:"number"},{name:"runwayCapDays",value:14,type:"number"},{name:"anomalyDropPct",value:30,type:"number"},{name:"anomalyRisePct",value:150,type:"number"},{name:"anomalyMinUnits",value:5,type:"number"},{name:"cooldownMinutes",value:1440,type:"number"}]},includeOtherFields:!0,options:{}},name:"Config (Report)",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-2400,1008]},{parameters:{url:"=https://api.airtable.com/v0/{{ $('Config (Report)').first().json.baseId }}/Products",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendQuery:!0,queryParameters:{parameters:[{name:"pageSize",value:"100"}]},options:{}},name:"Get All Products",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-2160,1008],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{url:"=https://api.airtable.com/v0/{{ $('Config (Report)').first().json.baseId }}/Events",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendQuery:!0,queryParameters:{parameters:[{name:"filterByFormula",value:"=IS_AFTER({Event Time}, DATEADD(NOW(), -24, 'hours'))"},{name:"pageSize",value:"100"}]},options:{}},name:"Get Recent Events",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-1920,1008],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{jsCode:`// Deterministic report facts. AI only summarizes these.
const prods = (($('Get All Products').first().json.records) || []).map(r => r.fields || {});
const evs = (($('Get Recent Events').first().json.records) || []).map(r => r.fields || {});
const esc = s => String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const counts = { HEALTHY: 0, LOW_STOCK: 0, CRITICAL: 0, SOLD_OUT: 0 };
prods.forEach(p => { const s = p['Stock Status'] || 'HEALTHY'; counts[s] = (counts[s] || 0) + 1; });
const label = p => (p['Product Name'] || '?') + (p['Variant'] ? ' — ' + p['Variant'] : '') + ' (' + (p['SKU'] || '') + ')';
const top = [...prods].filter(p => (p['Risk Score'] || 0) > 0).sort((a, b) => (b['Risk Score'] || 0) - (a['Risk Score'] || 0)).slice(0, 5)
  .map(p => ({ product: label(p), status: p['Stock Status'], risk: p['Risk Score'], stock: p['Current Stock'], daysRemaining: p['Days Remaining'] === undefined ? null : p['Days Remaining'] }));
const reorder = prods.filter(p => p['Reorder Required']).map(p => ({ product: label(p), stock: p['Current Stock'], suggestedQty: p['Recommended Reorder Qty'] === undefined ? null : p['Recommended Reorder Qty'] }));
const openStockouts = prods.filter(p => p['Stockout Open']).map(label);
const restocked = evs.filter(e => e['Event Type'] === 'RESTOCK').map(e => (e['Product Name'] || '?') + ' (' + (e['SKU'] || '') + ')');
const anomalies = evs.filter(e => e['Anomaly Flag']).map(e => (e['Product Name'] || '?') + ' (' + (e['SKU'] || '') + ')');
const date = new Date().toISOString().slice(0, 10);
const facts = { date, productsMonitored: prods.length, counts, topRisk: top, reorderRequired: reorder, openStockouts, restockedLast24h: restocked, anomaliesLast24h: anomalies, eventsLast24h: evs.length };
const list = a => a.length ? '<ul>' + a.map(x => '<li>' + esc(typeof x === 'string' ? x : JSON.stringify(x)) + '</li>').join('') + '</ul>' : '<p>None</p>';
const html = '<h2>📊 Daily Inventory Intelligence Report — ' + date + '</h2>'
  + '<p>Products monitored: <b>' + prods.length + '</b></p>'
  + '<p>🟢 Healthy: ' + counts.HEALTHY + ' | 🟡 Low: ' + counts.LOW_STOCK + ' | 🟠 Critical: ' + counts.CRITICAL + ' | 🔴 Sold out: ' + counts.SOLD_OUT + '</p>'
  + '<h3>Top priorities</h3><ol>' + top.map(t => '<li>' + esc(t.product) + ' — risk ' + t.risk + '/100, stock ' + t.stock + ', days left: ' + (t.daysRemaining === null ? 'n/a' : t.daysRemaining) + '</li>').join('') + '</ol>'
  + '<h3>Open stockouts</h3>' + list(openStockouts)
  + '<h3>Restocked (24h)</h3>' + list(restocked)
  + '<h3>Anomalies (24h) — manual review recommended</h3>' + list(anomalies)
  + '<h3>Reorder required (rule-based)</h3>' + list(reorder.map(r => r.product + ': stock ' + r.stock + ', suggested qty ' + (r.suggestedQty === null ? 'n/a' : r.suggestedQty)));
return [{ json: { facts, html } }];
`},name:"Build Report Facts",type:"n8n-nodes-base.code",typeVersion:2,position:[-1680,1008]},{parameters:{promptType:"define",text:"={{ 'FACTS (JSON):\\n' + JSON.stringify($json.facts) }}",options:{systemMessage:"You are StockGuard's inventory report writer for a Shopify merchant. You receive a JSON object of facts that were already calculated by deterministic workflow logic. Write a short, plain-language summary (max 150 words): 1 sentence overall health, then up to 3 priorities in order of risk, then 1 sentence on anything needing manual review. RULES: Use ONLY numbers and product names present in the JSON. Never invent, adjust or estimate inventory quantities, sales velocity, supplier details, causes or dates. Never override statuses or risk scores. Do not claim fraud, theft or sync failure; for anomalies say 'manual review recommended'. If a field is null or missing, say the data is unavailable. You have no tools and cannot change any inventory. Do not use markdown tables."}},name:"AI Summary",type:"@n8n/n8n-nodes-langchain.agent",typeVersion:1.7,position:[-1440,1008],onError:"continueRegularOutput"},{parameters:{method:"POST",url:"=https://api.airtable.com/v0/{{ $('Config (Report)').first().json.baseId }}/Reports",authentication:"predefinedCredentialType",nodeCredentialType:"airtableTokenApi",sendBody:!0,specifyBody:"json",jsonBody:"={{ JSON.stringify({ typecast: true, fields: { 'Report Date': $('Build Report Facts').first().json.facts.date, 'Products Monitored': $('Build Report Facts').first().json.facts.productsMonitored, 'Healthy': $('Build Report Facts').first().json.facts.counts.HEALTHY, 'Low Stock': $('Build Report Facts').first().json.facts.counts.LOW_STOCK, 'Critical': $('Build Report Facts').first().json.facts.counts.CRITICAL, 'Sold Out': $('Build Report Facts').first().json.facts.counts.SOLD_OUT, 'Delivery Status': ($json.error ? 'EMAIL_FAILED' : 'SENT'), 'AI Summary': String($('AI Summary').first().json.output || '') } }) }}",options:{}},name:"Record Report",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-368,1040],retryOnFail:!0,maxTries:3,waitBetweenTries:2e3},{parameters:{options:{}},type:"@n8n/n8n-nodes-langchain.lmChatGoogleGemini",typeVersion:1.1,position:[-1584,1216],name:"Google Gemini Chat Model"},{parameters:{sendTo:"olarewajuagbaje1995@gmail.com",subject:"={{ $('Intelligence').first().json.alert.subject }}",message:"={{ $('Intelligence').first().json.alert.html }}",options:{appendAttribution:!1}},type:"n8n-nodes-base.gmail",typeVersion:2.2,position:[480,-64],name:"Send a message"},{parameters:{sendTo:"=olarewajuagbaje@gmail.com",subject:"={{ '📊 StockGuard Daily Inventory Report — ' + $('Build Report Facts').first().json.facts.date }}",message:"={{ $('Build Report Facts').first().json.html + '<h3>AI summary</h3><p>' + ($json.output ? String($json.output).replace(/\\n/g, '<br>') : 'AI summary unavailable. The figures above are unaffected.') + '</p>' }}",options:{appendAttribution:!1}},type:"n8n-nodes-base.gmail",typeVersion:2.2,position:[-912,992],name:"Send a message1"},{parameters:{sendTo:"={{ $('Config (Errors)').first().json.alertEmail }}",subject:"=StockGuard workflow error in {{ $('Error Trigger').first().json.workflow.name }}",message:`=Node: {{ $('Error Trigger').first().json.execution.lastNodeExecuted }}
Message: {{ ($('Error Trigger').first().json.execution.error || {}).message }}
Execution: {{ $('Error Trigger').first().json.execution.url }}`,options:{appendAttribution:!1}},type:"n8n-nodes-base.gmail",typeVersion:2.2,position:[-1808,1600],name:"Send a message2"}],n={},o={"Shopify Inventory Webhook":{main:[[{node:"Verify & Normalize",type:"main",index:0}]]},"Verify & Normalize":{main:[[{node:"Config (Ingest)",type:"main",index:0}]]},"Config (Ingest)":{main:[[{node:"IF Valid",type:"main",index:0}]]},"IF Valid":{main:[[{node:"Check Duplicate",type:"main",index:0}],[{node:"Log Rejected",type:"main",index:0}]]},"Check Duplicate":{main:[[{node:"IF Is New",type:"main",index:0}]]},"IF Is New":{main:[[{node:"Get Product",type:"main",index:0}],[{node:"Log Duplicate",type:"main",index:0}]]},"Get Product":{main:[[{node:"Intelligence",type:"main",index:0}]]},Intelligence:{main:[[{node:"IF Product Found",type:"main",index:0}]]},"IF Product Found":{main:[[{node:"Create Event",type:"main",index:0}],[{node:"Log Unmapped",type:"main",index:0}]]},"Create Event":{main:[[{node:"Update Product",type:"main",index:0}]]},"Update Product":{main:[[{node:"IF Send Alert",type:"main",index:0},{node:"IF Stockout",type:"main",index:0},{node:"IF Restock",type:"main",index:0},{node:"IF Anomaly",type:"main",index:0},{node:"Log Success",type:"main",index:0}]]},"IF Send Alert":{main:[[{node:"Send a message",type:"main",index:0}]]},"IF Stockout":{main:[[{node:"Create Stockout",type:"main",index:0}]]},"IF Restock":{main:[[{node:"Find Open Stockout",type:"main",index:0}]]},"Find Open Stockout":{main:[[{node:"Prepare Close Stockout",type:"main",index:0}]]},"Prepare Close Stockout":{main:[[{node:"Close Stockout",type:"main",index:0}]]},"IF Anomaly":{main:[[{node:"Create Anomaly",type:"main",index:0}]]},"Error Trigger":{main:[[{node:"Config (Errors)",type:"main",index:0}]]},"Config (Errors)":{main:[[{node:"Log Error",type:"main",index:0}]]},"Log Error":{main:[[{node:"Send a message2",type:"main",index:0}]]},"Daily 8AM Trigger":{main:[[{node:"Config (Report)",type:"main",index:0}]]},"Config (Report)":{main:[[{node:"Get All Products",type:"main",index:0}]]},"Get All Products":{main:[[{node:"Get Recent Events",type:"main",index:0}]]},"Get Recent Events":{main:[[{node:"Build Report Facts",type:"main",index:0}]]},"Build Report Facts":{main:[[{node:"AI Summary",type:"main",index:0}]]},"AI Summary":{main:[[{node:"Send a message1",type:"main",index:0}]]},"Google Gemini Chat Model":{ai_languageModel:[[{node:"AI Summary",type:"ai_languageModel",index:0}]]},"Send a message":{main:[[{node:"Record Alert",type:"main",index:0}]]},"Send a message1":{main:[[{node:"Record Report",type:"main",index:0}]]}},a=!0,s={executionOrder:"v1",binaryMode:"separate",availableInMCP:!1},i="cc1e6175-f422-42b2-9afa-051df0d3abfa",r=[],l=[],d={name:e,nodes:t,pinData:n,connections:o,active:a,settings:s,versionId:i,nodeGroups:r,tags:l};export{a as active,o as connections,d as default,e as name,r as nodeGroups,t as nodes,n as pinData,s as settings,l as tags,i as versionId};
