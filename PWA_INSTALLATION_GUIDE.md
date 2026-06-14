# HP-Style RPN Calculator — PWA Installation & Deployment Guide

A fully self-contained HP-style RPN calculator that installs as a Progressive
Web App (PWA) on iPhone, iPad, Android, and desktop. No build step, no
dependencies, no tracking.

## Files in this package

```
rpn-calculator/
├── index.html              ← the app (entry point; served at the site root)
├── manifest.json           ← PWA configuration (name, colours, icons)
├── sw.js                   ← service worker (offline caching)
├── icon-152.png            ← icons for various devices/sizes
├── icon-167.png
├── icon-180.png
├── icon-192.png
├── icon-512.png
├── icon-generator.html     ← optional tool to regenerate the PNG icons
├── test.js                 ← engine test harness (Node; not used at runtime)
└── PWA_INSTALLATION_GUIDE.md
```

The app is now named **`index.html`** so that visiting the deployment root
(e.g. `https://username.github.io/your-repo/`) loads it directly and the PWA
installs cleanly.

## Deploying to GitHub Pages

1. Create (or reuse) a GitHub repository and upload **all** the files above to
   the repository root — keep the file names exactly as they are.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   choose your branch (usually `main`) and the `/ (root)` folder, then **Save**.
4. Wait for the green check, then open the published URL
   (`https://<username>.github.io/<repo>/`).

Because every path in `manifest.json` and `sw.js` is **relative** (`./…`), the
app works correctly whether it is served from a domain root or a project
subpath. HTTPS (which GitHub Pages provides automatically) is required for the
service worker, and therefore for offline support and installation.

## Installing on a device

### iPhone / iPad (Safari)
1. Open the published URL in **Safari** (not Chrome).
2. Tap the **Share** button, then **Add to Home Screen**.
3. Name it and tap **Add**. It launches full-screen with its own icon.

### Android (Chrome)
1. Open the URL in Chrome.
2. Tap the menu (⋮) → **Add to Home screen** / **Install app**.

### Desktop (Chrome/Edge)
Click the install icon in the address bar, or use the browser menu → *Install*.

## What's included

- **Genuine HP RPN behaviour** — automatic stack lift, `ENTER`/`CLx` disable
  lift, `LASTx`, and HP-style `%` / `Δ%` that preserve the Y register.
- **Error handling** — divide-by-zero, `1/0`, `STO ÷ 0`, and overflow show
  `Error`; the operands are preserved and `CLx` clears it.
- **Adaptive layout** — iPhone portrait (6 registers), iPhone landscape
  (4 registers, function pad beside the stack), and iPad/desktop (full
  12-level stack), with safe-area padding for notches and rounded corners.
- **Responsive, drop-free keys** — taps register on press, so fast successive
  digit entry is never swallowed.
- **Offline support** — the service worker caches the app shell on first load.
- **Three modes** — Currency (default at startup), Decimal, and Integer.
- **Backspace key (⌫)** — sits under CLX; deletes the last digit while
  typing, or clears X if you're not mid-entry.
- **Remembers your session** — the stack, memory, and mode are saved and
  restored across launches (on the deployed site; not in a preview sandbox).
- **In-app update prompt** — when you deploy a new version, an "Update
  available" toast appears; tapping it loads the new version.
- **Keyboard input** — digits, `. , + - * /`, `%`, `Enter`/`=`,
  `Backspace`, `Delete` (CLx), `Esc` (Clear). Browser shortcuts such as
  Ctrl/Cmd+R and Ctrl/Cmd+C are left untouched.

## Running the tests

The calculator engine has a test harness in `test.js`. It pulls the engine
straight out of `index.html` and runs it, so the tests always exercise the
exact code that ships. With Node installed:

```
node test.js
```

It prints each check and exits non-zero if any fail — handy as a quick
regression check before committing changes to the engine.

## Updating the app

When you change `index.html` (or any asset):
1. Re-upload the file(s) to the repository.
2. Bump the cache name in `sw.js` (e.g. `rpn-calc-v1` → `rpn-calc-v2`) so
   installed copies fetch the new version on next launch.
3. Reload the page (or relaunch the installed app) twice — once to install the
   new worker, once for it to take control.

## Regenerating icons (optional)

Open `icon-generator.html` in a browser and download each size. If you want
Android maskable icons to fill the adaptive shape without clipping, give the
artwork extra padding (a safe zone) before regenerating.

## Privacy

Runs entirely on your device — no analytics, no cookies, no network calls, and
no data leaves the device after the initial load.

---

**Enjoy your HP-style RPN calculator!** 🧮
