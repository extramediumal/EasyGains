# EasyGains Accounts & Assets

## Domain & Hosting

- **easygains.app** — purchased on **Namecheap** (managed via Namecheap dashboard)
- **DNS (Namecheap Advanced DNS):**
  - 4x A Records (`@`) → GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - CNAME (`www`) → needs updating (currently `parkingpage.namecheap.com`)
  - TXT (`@`) → `v=spf1 include:spf.efwd.registrar-servers.com ~all` (email forwarding SPF)
  - DNSSEC: off
- **Hosting:** GitHub Pages (not yet configured — needs repo + custom domain setup)
- **SSL:** Will auto-provision via GitHub Pages once custom domain is added
- **Screenshot:** `docs/infrastructure/website DNS 1.png`

### DNS Fix Needed (as of 2026-03-25)
- Verify A record `85.199.110.153` → should be `185.199.110.153` (may be typo in Namecheap, missing leading `1`)
- Update CNAME `www` → `alharris-debug.github.io.` (once Pages repo exists)
- Add custom domain `easygains.app` in GitHub Pages repo settings
- GitHub will auto-issue SSL cert once domain is verified

### Website Status
- Landing page: TBD — needs to be built and deployed to GitHub Pages

## Email

- **easygainsapp@gmail.com** — primary account email for all social platforms

## Social Media Accounts (to create)

| Platform | Handle (target) | Display Name | Account Type | Status |
|----------|----------------|--------------|-------------|--------|
| Twitter/X | @easygainsapp | Coach AL | Personal | Created 2026-03-25 |
| Instagram | @easygainsapp | EasyGains | Professional (Website) | Created 2026-03-25 |
| TikTok | @easygainsapp | EasyGains | Business (Health & Wellness) | Created 2026-03-25 |
| YouTube | @easygainsapp | EasyGains | Brand/Channel | Created 2026-03-25 |

**Fallback handle:** `@easygainsapp` if `@easygains` is taken on any platform.

## Branding Assets

- **Profile pic (all platforms):** App icon — white dumbbell on matte black
- **Banner:** MacroTriforce rings on #1C1C1E (same as splash screen)
- **Voice/Tone:** Coach AL personality on Twitter; EasyGains brand (with AL flavor) on other platforms

## App Store

- **Bundle ID:** com.easygains.app
- **App Store listing draft:** `docs/marketing/app-store-listing.md`

## Notes

- Use easygainsapp@gmail.com for all platform signups
- Can migrate to hello@easygains.app later for professional emails / website contact
- Check @easygains handle availability on all platforms before creating — do them all in one sitting
