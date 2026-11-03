# The Listening Room — Jia Oswal

An interactive portfolio imagined as an independent record store. You arrive on the street, scroll through the doors, and explore the room. Each record on the rail is a section of the portfolio.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/, deploy to Vercel as-is
```

## Edit content
Everything (words, links, images, numbers) lives in **`src/content/site.ts`**.
- `[TBC: …]` renders as a blue dashed placeholder. Search the file for `TBC` before submitting.
- Images: drop files in `public/`, set `src: '/your-file.jpg'`. Real images keep their own proportions and are never cropped.
- `person.email` / `person.linkedin`: their buttons only appear once these are filled in.

## Structure
| Scene | File |
|---|---|
| Street → doors → room (one pinned, scrubbed GSAP timeline) | `sections/Arrival.tsx` |
| Storefront, doors, blade sign | `components/StoreExterior.tsx` |
| Room illustration (procedural shelves, perspective floor) | `components/ListeningRoom.tsx` |
| CSS-3D turntable | `components/Turntable.tsx` |
| Record rail and play-on-the-turntable sequence | `components/RecordCollection.tsx`, `Arrival.tsx` |
| A1 Person · A2 Receipts · B1 Work · B2 Experiments · B3 Crates · B4 Liner note · B5 Last track | `sections/*` |
| Project sleeve (GSAP Flip) | `components/ProjectDetail.tsx` |
| Tracklist nav, progress groove, room tone | `components/Navigation.tsx`, `Crackle.tsx` |

Design tokens are in `styles/base.css`. Reduced-motion users get two still frames and no pinning.

## Deploy (Vercel — recommended)
1. Push this folder to a GitHub repo, import it at vercel.com (framework: Vite, build `npm run build`, output `dist`).
2. In Vercel → Settings → Environment Variables, set `VITE_SITE_URL` to your live URL (e.g. `https://jia-oswal.vercel.app`, no trailing slash) and redeploy. This makes the LinkedIn/WhatsApp preview image (`public/og.jpg`) load.
3. `vercel.json` already sends security headers (CSP, no framing, nosniff, strict referrer, locked-down permissions) and long-term caching for hashed assets.

The build uses a relative base, so it also works on GitHub Pages under a sub-path.

## Before you share
- Search `src/content/site.ts` for `TBC` — what's left is one honest line per project ("what it taught me").
- Check it on a real phone, in Safari and Chrome.
- Re-run `npm run build`; it must finish with no errors.
