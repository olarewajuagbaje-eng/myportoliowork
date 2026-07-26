## Done in this turn
- Added `<meta name="google-site-verification" ...>` to `index.html`. Live after your next deploy to `agbajeautomation.me`.

## Blockers I need you to resolve before I build the rest

**1. Which verification token is correct?**
You pasted two variants. I used the first:
- Used: `qnVFLLMXjZaloQGRx-MHwKJsLEkxR9tja4MfVSqGbbE`
- Also pasted: `gnVFLLMXjZaIoOGRx-MHwkJsLEkxR9tja4MfVSqGbbE`
Copy the exact string from Google Search Console and confirm.

**2. Hosting conflict — this is the big one.**
Your site currently deploys via GitHub Actions to **GitHub Pages** (`.github/workflows/deploy.yml` → `agbajeautomation.me`). A blog + admin + auth backed by Lovable Cloud will work from a static host for reads/writes (the Cloud SDK talks directly to the backend from the browser), **but**:
- Auth email flows (password reset, verification) need Lovable's managed email, which requires the site to be published through **Lovable hosting**, not GitHub Pages.
- Custom domain `agbajeautomation.me` can only point at one host at a time.

Pick one:
- **A. Migrate hosting to Lovable** (recommended). I remove the GitHub Actions workflow, publish through Lovable, then you re-point DNS for `agbajeautomation.me` to Lovable. Full auth + email + admin works.
- **B. Stay on GitHub Pages**. Blog + admin still work, but password reset emails won't. You'd log in with email/password only, and I'd bootstrap your admin account manually.

## Phased plan (after blockers resolved)

### Phase 1 — Backend + Auth (Lovable Cloud)
- Enable Lovable Cloud.
- Tables: `profiles`, `user_roles` (enum `app_role`: admin/editor), `categories`, `tags`, `posts`, `post_tags`, `post_media`. RLS: public reads only for `status='published'`; writes gated by `has_role(auth.uid(),'admin')`.
- Storage buckets: `post-images` (public), `post-videos` (public).
- Auth: email/password + Google. `/login`, `/forgot-password`, `/reset-password` routes.
- First-admin bootstrap: I'll add a one-time trigger that promotes the first signup whose email matches a value you give me to `admin`. Tell me the email to whitelist.

### Phase 2 — Public blog
- Routes: `/blog` (list + search + category/tag filters), `/blog/:slug` (article).
- Reading time, related posts (same category), author card, publish date.
- Rich content rendering: markdown → HTML with syntax-highlighted code blocks (`shiki`), image gallery, YouTube + uploaded video embeds.
- Per-route `<title>`, meta description, canonical, OG/Twitter tags, `Article` JSON-LD via `react-helmet-async`.

### Phase 3 — Admin dashboard (`/admin/*`, admin-only)
- Post list with draft/published filter, search.
- Post editor: title, auto-slug, summary, cover image, body (rich text — TipTap), category, tags, SEO title, meta description, featured/draft toggle, media uploader (images + video).
- Category + tag managers.
- All routes wrapped in an `AdminGuard` that checks `has_role`.

### Phase 4 — New pages
`/`, `/about`, `/services/ai-automation`, `/services/n8n`, `/services/ai-agents`, `/case-studies`, `/blog`, `/resources`, `/contact`. Home stays as-is. New pages reuse existing sections + design tokens — no redesign.

### Phase 5 — SEO + performance
- Dynamic `sitemap.xml` generator that pulls published posts at build time (`scripts/generate-sitemap.ts`, wired to `predev`/`prebuild`).
- `robots.txt` already fine — add `Sitemap:` line.
- Per-route Helmet metadata on every new page.
- Image lazy-loading, `loading="lazy"` on non-LCP images, route-level code splitting for `/admin/*` and `/blog/*`.

### Phase 6 — Deploy + verify
- Publish, verify Google Search Console picks up the meta tag, submit sitemap.

## Technical notes
- Stack additions: `@tanstack/react-query` (already in), `react-helmet-async`, `@tiptap/react` + starter kit, `shiki` or `rehype-pretty-code`, `react-markdown` + `remark-gfm`, `date-fns`.
- Cloud SDK reads env vars already in `.env`.
- Rich text is stored as markdown (portable, diff-friendly) plus a rendered HTML cache column for fast reads.
- All new tables get standard timestamps + `updated_at` triggers, GRANTs, and RLS.

## Reply with
1. Correct verification token.
2. Hosting choice A or B.
3. Email address to whitelist as first admin.

Once I have those, I'll start Phase 1.