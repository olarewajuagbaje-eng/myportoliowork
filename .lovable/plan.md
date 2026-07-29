# Phase 2 – Reader Engagement & Content Discovery

Shipping in one coordinated phase. Existing design tokens (glass-card, hover-lift, primary gradient), URLs (/blog, /blog/:slug), auth, SEO, and Markdown backward compatibility are preserved.

## 1. Database (single migration)

New tables in `public` (all with grants + RLS):

- `post_likes` (post_id, ip_hash, created_at) — anon-likeable, 1 per hashed IP+post
- `post_bookmarks` (post_id, user_id) — auth only
- `comments` (id, post_id, parent_id, author_name, author_email, author_user_id, body, status: pending|approved|hidden, pinned, like_count, edited_at, created_at) — public read of `approved`, insert open, admin moderates
- `comment_likes` (comment_id, ip_hash)
- `newsletter_subscribers` (id, email unique, status: pending|confirmed|unsubscribed, confirm_token, confirmed_at, created_at) — insert open, admin read
- Extend `categories` with `parent_id uuid` self-ref
- Add view/RPC `increment_post_like(post_id, ip_hash)` (SECURITY DEFINER) returning new count

Grants: anon SELECT on approved comments + counts; authenticated for bookmarks; service_role for admin.

## 2. Backend / Edge Functions

- `newsletter-subscribe` — creates pending row, sends double opt-in email via Resend (already configured), returns generic success
- `newsletter-confirm` — token flip to `confirmed`
- Update `ai-writer` — add resilient fallback chain: `google/gemini-3.6-flash` → `google/gemini-2.5-flash` → `openai/gpt-5-mini`. Retry on 429/5xx/timeout with 8s AbortController. Log fallback reason server-side; return generic message to client. No raw API errors to UI.

## 3. Admin CMS additions

- `/admin/categories` — CRUD, slug auto, parent selector, description
- `/admin/tags` — CRUD, slug auto, search
- `/admin/comments` — moderation queue: approve / hide / delete / pin, filter by status/post
- `/admin/newsletter` — subscriber list, status filter, CSV export button

Post editor: category select + tag autocomplete multi-select (writes to `post_tags`).

## 4. Public blog UX

**BlogList**: category & tag filter chips, search already present.

**BlogPost** upgrades (new components):
- `ReadingProgressBar` — top fixed 2px bar
- `TableOfContents` — sticky right rail on desktop, drawer on mobile, generated from H2/H3
- `ArticleMeta` — category chip, tag chips, last updated, author bio card
- `EngagementBar` — sticky floating (desktop left) + inline (mobile): like, bookmark, copy link, share menu (LinkedIn/X/Facebook/WhatsApp/Telegram/Email)
- `CommentsSection` — threaded, guest name+email, nested replies, like, edit within 15min, delete own (client token in localStorage tying comment_id → edit key stored server-side via hashed secret), spam honeypot + simple rate limit via ip_hash
- `NewsletterInline` — below article, double-opt-in messaging
- `PrevNextArticles` + `RelatedArticles` — by shared category/tags
- `BackToBlog` button

**Archive pages**: `/blog/category/:slug`, `/blog/tag/:slug` — reuse BlogList grid.

## 5. Reliability & QA

- All AI calls: try/catch with fallback loop; user-facing message = "Retrying with a backup model…" then final generic error on total failure
- Mobile: TOC becomes bottom sheet; engagement bar becomes inline; comment threads indent capped at 3 levels then flatten
- Accessibility: all buttons labelled, focus rings, keyboard-nav for share menu, aria-live on like counts
- Preserve Markdown rendering path in BlogPost
- SEO: archive pages get canonical + meta; comment JSON-LD added to article schema

## Technical notes

- Anon "like/comment" identity via SHA-256(ip + UA + daily-salt) computed server-side in an edge function `engagement` (single function multiplexes like/unlike/comment CRUD) to keep RLS strict
- Share URLs built client-side, no tracking params
- CSV export = client-side blob from admin query
- No new routes above the 4 admin + 2 archive pages listed; App.tsx additions only
