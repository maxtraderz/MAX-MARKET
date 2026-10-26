# jinxlab

Next.js 16 App Router + React + TypeScript + Tailwind. A reference-inspired trading software website for Agent Jin V1 and JinX ORB Scalper V2.

## Run and build
Requires Node 20.9+.
```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm test
```
Development: http://127.0.0.1:3000. Production is a static export in `out/`; serve it with any static host. Example: `python -m http.server 3000 --bind 127.0.0.1 --directory out`. The build includes a Windows compatibility step for Next static segment filenames.

## Content configuration
- `src/data/site-config.ts`: text-only jinxlab branding, canonical origin, Telegram contact https://t.me/jinzfx.
- `src/data/products.ts`: Agent Jin V1 and JinX ORB Scalper V2, Agent Jin V1: USD 649 (was USD 800); JinX ORB Scalper V2: USD 599 (was USD 800, save USD 201 / 25%). Both show Offer closes soon; optional genuine checkout URL and licensing information.
- `src/data/demos.ts`: supplied buy and sell videos and posters.
- `src/data/testimonials.ts`: 14 owner-supplied reviews and five-star ratings. No dates or independent verification were provided; none are invented.
- `src/data/performance.ts`: supplied historical v1.1 admin report and its source limitations.
- `src/data/faqs.ts`: editable answers.
- `src/data/certificates.ts`: eight displayed anonymized certificates across two slideshows, with a floating product banner in the third frame.

## Design and interactions
The reference was inspected live on 24 October 2026. Its Montserrat family, 700-weight headlines, centered media, blue gradients, rounded cards, review layout, feature rows and pricing composition informed the implementation. The licensed Montserrat variable font is self-hosted; its OFL is in `public/fonts/`.

The homepage places a supplied video under the headline, then supporting copy, supplied-review summary, the exact “Get ORB Access” CTA and supporting chips. The CTA opens Telegram for an access enquiry; it does not generate a payment or purchase confirmation.

The historical report is followed by three vertically stacked certificate slideshows, each changing every five seconds, with pause, arrows, touch gestures and a nine-image lightbox. The buy/sell demonstration panel also changes every five seconds and supports manual selection, pause, native video playback, audio and fullscreen. Autoplay respects reduced motion, interaction and browser visibility.

The initial six review cards expand to all 14 owner-supplied reviews. No review dates, verified-purchase badges, unrelated customer counts or aggregate funded-capital claims are added.

Product details remain available at `/products/agent-jin/`. MAX BLUE and MAX FLUID are removed. Text-only site branding replaces logo graphics; original issuer logos remain within authentic anonymized certificate images.

## Media and privacy
`asset-manifest.json` maps sources to processed public media. See [ASSETS.md](ASSETS.md) for certificate processing. Original certificates stay outside the repository and deployment. The historical screenshot is lossless and unmodified. Supplied buy/sell clips are optimized H.264/AAC MP4 files with faststart and preserved aspect ratios/audio.

Reprocess clips with `powershell -File scripts/process-videos.ps1 -SourceDirectory "PRIVATE_VIDEO_DIRECTORY"`. Only the two supplied clip filenames are imported. The reference recording is never used as product media.

There is no application database, registration form, analytics, or fake checkout. Execution-platform specifications, full license/delivery/refund terms and detailed strategy specifications still require confirmation. Contact is now configured through Telegram.

## Verification
`npm test` serves production output and uses headless Edge on Windows (or Chromium elsewhere). Override `BROWSER_PATH` if necessary. It checks six responsive widths, routing, fonts, branding, contact links, gallery rotation, reviews, video playback, audio, tab navigation and reduced motion. Local QA screenshots stay in ignored `.local/`. See [TEST-RESULTS.md](TEST-RESULTS.md).

## Latest media and access update
The buy/sell demonstration panel uses actual infinitely looping GIF assets with no video toolbar or sound controls. The hero remains a video. Reduced-motion visitors receive still posters. Every Get ORB Access link opens https://t.me/jinzfx with the draft message “Hi, I'd like access to ORB.” The visitor chooses whether to send it.
