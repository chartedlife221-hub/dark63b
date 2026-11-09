# DARK6.3B — When the Lights Went Dark

An independent remembrance of the October 29, 2026 crypto security incident, and a community project to turn it into security education and documented public benefit. **Not affiliated with or endorsed by Binance.**

Live site (after the first deploy): https://chartedlife221-hub.github.io/dark63b/

## Stack

- React 19 + TypeScript
- esbuild for bundling (the same engine Vite uses for transforms); a small build script in `scripts/build.mjs`
- Build-time prerender with `react-dom/server`, so all content is in the HTML before JavaScript loads
- Native HTML5 video for the film; 2D canvas for the gold dust and the scale visual; Web Audio for the optional ambient sound
- No Three.js: the film already carries the 3D, and a WebGL layer would add weight without a visible gain
- Deployed to GitHub Pages by GitHub Actions

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/dark63b/ — rebuilds on save
npm run build      # production build in dist/
npm run preview    # serve dist/ without watching
npm run typecheck
```

The dev server mirrors the GitHub Pages path (`/dark63b/`) and supports HTTP range requests, so video seeking behaves as it will in production.

## Deploy

1. In the repository on GitHub: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root** (already set).
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes `dist/` to the `gh-pages` branch, which Pages serves.

All asset URLs are relative, so the site also works on a custom domain or another repository name. Set `SITE_URL` when building elsewhere so social previews point to the right address.

## Updating content

| What | Where |
|---|---|
| Historical timeline, figures and sources | `src/data/incident.ts` (update `LAST_VERIFIED` when you re-check) |
| Token details, official channels | `src/data/project.ts` → `TOKEN`, `CHANNELS` |
| Creator-fee ledger and distributions | `src/data/project.ts` → `LEDGER` |
| Roadmap status | `src/data/project.ts` → `ROADMAP` |

Rules the site is built around:

- Fill a token field only with an independently verified value. `null` shows "Not yet announced".
- The ledger shows "None yet" until real fees exist. Never enter projected numbers.
- A roadmap phase becomes `Complete` only with evidence to link to.
- No Buy, Swap or wallet-connect features before launch and a separate security review.

## Media

| File | Use |
|---|---|
| `public/media/dark63b-film-1080.mp4` | Original film with audio (lossless faststart remux of `452.mp4`), used in the film viewer |
| `public/media/dark63b-film-1080-silent.mp4` | Hero background on tall/high-density screens |
| `public/media/dark63b-film-720-silent.mp4` | Hero background elsewhere (0.8 MB) |
| `public/media/film-poster-end*.jpg` | Static fallback: the film's final emblem frame |
| `public/img/dark63b-logo-*.webp` | Approved logo, resized only |
| `brand/dark63b-logo-master.png` | Approved logo master file, unmodified |

The hero video is skipped for visitors with reduced motion or data-saver enabled; they see the still emblem instead.

## Security

- Content Security Policy (`script-src 'self'`, no inline scripts, `media-src 'self'`, `form-action 'none'`)
- No cookies, analytics, wallets, keys or third-party scripts. Google Fonts is the only external request.
- External links use `rel="noopener noreferrer"`.
- The community wall accepts no submissions until moderation and privacy handling exist (Phase 2).
