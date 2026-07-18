# farbot.ai — Portfolio of Farhan Sargath

One single-page portfolio: hero with a cursor-following 3D robot, work archive, resume, about, contact, an AI chat + terminal (Farbot), and WORLD52 — a walkable 3D world of everything shipped.

## How to run

**Easiest:** double-click `index.html`. It opens in your browser — that's it.
(Internet is needed the first time, for the fonts and the Three.js library loaded from a CDN.)

**Recommended (local server):** some browsers restrict local files, so this is the most reliable way:

1. Open a terminal/PowerShell in this folder
2. Run: `python -m http.server 8000`
3. Open http://localhost:8000 in your browser

**Put it online free (GitHub Pages):**

1. Create a new repo on GitHub (e.g. `portfolio`)
2. Upload everything in this folder (keep the folder structure)
3. Repo Settings → Pages → Source: `main` branch, `/ (root)` → Save
4. Your site goes live at `https://<username>.github.io/portfolio/`

## Controls & features

| Where | What |
|---|---|
| Anywhere | Press `L` to like · `Ctrl/Cmd + K` opens the terminal |
| Nav | WORLD52 opens the 3D world · download icon = CV PDF |
| Chat (💬 icon) | Ask Farbot anything about Farhan — projects, skills, hiring |
| Terminal | `/work` `/world` `/resume` `/about` `/contact` `/cv` `/clear` |
| WORLD52 | `WASD`/arrows move · `Shift` run · drag to look · `M` map fast-travel · `Esc` exit · walk into beacons to unlock all 12 |

## Files

```
index.html          the whole site (single page)
css/style.css       all styling
js/robot.js         cursor-following 3D robot (Three.js)
js/world.js         WORLD52 3D world overlay
js/farbot-brain.js  Farbot's answers (edit this to change what the AI says)
js/main.js          nav, chat, terminal, animations
assets/             your resume PDF (Download CV button)
```

## Editing tips

- Change what Farbot says → `js/farbot-brain.js`
- Add/edit projects → the `work-card` blocks in `index.html`, and `BEACONS` in `js/world.js`
- Update LinkedIn URL → search `linkedin.com/in/farhan-sargath` in `index.html`
- Replace CV → drop a new PDF at `assets/Farhan_Sargath_Resume.pdf`
