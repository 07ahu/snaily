# snaily

A little postcard you can spin, flip and write on. Built mobile-first; the final product will be a mobile app.

## Run locally

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

It is a single static page (`index.html`, three.js from cdnjs), so there is no build step.

## Sending (Supabase)

Postcards are sent as links. Setup, once per Supabase project:

1. Run `supabase/schema.sql` in the SQL editor.
2. Turn on Authentication → Sign In / Providers → **Allow anonymous sign-ins**.
3. Put the project URL and the **publishable** key in `js/config.js` (both are public; never the secret key).

A sent card is a row in `postcards` plus `front.jpg` / `back.jpg` in the private `postcards` bucket. Anyone with the link can see who it's from and when it arrives; the images unlock at `deliver_at` ("by snail" means 8:00 the next morning).

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
- `js/collage.js`: the finished postcard: the crafted card with the photos piled on top as a seeded, homemade-looking collage (mixed cuts and tape, every photo's middle and the stamps kept clear); the layout is saved on the draft
- `js/card3d.js`: the 3D postcard you can turn and flip, shared by the review step and the link page
- `js/preview.js`: the review step (`#sent`): the collage on the 3D card, an arrange mode to move, turn and resize photos, randomize (with undo), and the send sheet
- `js/net.js`, `js/config.js`: sending through Supabase (anonymous sign-in, upload, open by link)
- `js/open.js`: what a postcard link (`?p=<id>`) shows: the card, or the snail still on its way
- `supabase/schema.sql`: the database, functions and storage rules
- `images/`: artwork cropped and recolored from the originals in `images/source/` (`*-dark.png` are the dark-mode versions)
