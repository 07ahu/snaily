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

- `index.html`: the whole app: stamp intro, header, bottom nav and four views (`#home`, `#write`, `#gallery`, `#settings`)
- `images/`: artwork cropped and recolored from the originals in `images/source/` (`*-dark.png` are the dark-mode versions)
