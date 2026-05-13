# AGENTS.md

## Dev server

```bash
npm run dev    # Starts on http://localhost:3000
```

## Architecture

- Vanilla JS/HTML/CSS — no frameworks, no build step, no dependencies
- `server.js` — static file server (Node `http` module)
- `app.js` — all frontend logic (mock data, rendering, event handling)
- `index.html` / `styles.css` — markup and styling
- All run data is hardcoded mock data in `app.js` — no database or API

## File serving

The server maps files 1:1 from the project root:
- `/` → `index.html`
- `/app.js` → `app.js`
- `/styles.css` → `styles.css`

Only `.html`, `.css`, `.js` are served with correct `Content-Type` headers.