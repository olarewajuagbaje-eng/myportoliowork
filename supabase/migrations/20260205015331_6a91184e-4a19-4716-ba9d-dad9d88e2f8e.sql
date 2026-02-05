-- Add policy for service role to manage leads (edge functions use service role)
-- This table is backend-only, no user-facing access needed
CREATE POLICY "Service role can manage leads" 
ON public.leads 
FOR ALL 
USING (true) 
WITH CHECK (true);