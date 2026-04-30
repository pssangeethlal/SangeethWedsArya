# Sangeeth & Arya — Wedding Website

A dreamy, premium wedding invitation website for Sangeeth Lal P S & Arya.

## Local Development

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Deploy to GitHub Pages

1. Push your code to the `main` branch of your GitHub repo.
2. In your repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. GitHub Actions will build and deploy automatically on every push to `main`.
4. Your site will be at `https://<your-username>.github.io/<repo-name>/`.

## How to Update

### Photos
Place photos in `src/images/` — they are auto-imported. Supported formats: jpg, jpeg, png, webp, avif, gif.

For the hero background, name a file `groomandbride.*`. For groom portrait, `groom.*`. For bride portrait, `bride.*`.

### Dates & Times
- Wedding: edit `src/lib/calendar.ts` → `weddingEvent.startIST` / `endIST`
- Reception time: search for `TODO` in `src/lib/calendar.ts` and `src/App.tsx` — update the time there.

### Event Details
Edit `src/App.tsx` — each `<EventCard>` has `date`, `time`, `venue`, `address`, and `mapUrl` props.
