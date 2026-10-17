# snaily

A little postcard you can spin, flip and write on. Built mobile-first; the final product will be a mobile app.

## Run locally

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

It is a single static page (`index.html`, three.js from cdnjs), so there is no build step.

## Deploy

Hosted on Vercel via Git import: every push to `main` deploys to production, and other branches get preview URLs.

## Structure

- `index.html`: the markup: header, bottom nav and the views (`#home`, `#write`, `#board`, `#sent`, `#gallery`, `#settings`)
- `css/app.css`: all styles
- `js/postcard.js`: the 3D postcard (three.js)
- `js/shell.js`: routing, nav, settings and the stamp intro
- `js/store.js`: the local draft (postcard, photos, captions) in IndexedDB, plus photo resizing
- `js/board.js`: the photo board: collage, drag, tap-to-focus caption bubble
- `js/send.js`: the postcard-into-envelope animation
- `images/`: artwork cropped and recolored from the originals in `images/source/` (`*-dark.png` are the dark-mode versions)
