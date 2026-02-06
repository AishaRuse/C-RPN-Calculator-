# HP-Style RPN Calculator - PWA Installation Guide

## Quick Start for iOS/iPadOS

### Step 1: Generate App Icons
1. Open `icon-generator.html` in any web browser
2. Click each "Download" button to save all 5 PNG icon files
3. You'll get:
   - icon-152.png
   - icon-167.png
   - icon-180.png
   - icon-192.png
   - icon-512.png

### Step 2: Organize Your Files
Put these files in the same folder:
```
my-calculator/
├── rpn-calculator.html
├── manifest.json
├── icon-152.png
├── icon-167.png
├── icon-180.png
├── icon-192.png
└── icon-512.png
```

### Step 3: Install on iOS/iPadOS

#### Option A: Local Installation (No Internet Required)
1. Transfer the entire folder to your iOS device (via AirDrop, iCloud Drive, etc.)
2. Open `rpn-calculator.html` in **Safari** (must be Safari, not Chrome)
3. Tap the **Share** button (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Name it "RPN Calculator" (or whatever you like)
6. Tap **Add**

#### Option B: Host Online (Recommended)
1. Upload all files to a web host:
   - **GitHub Pages** (free): https://pages.github.com
   - **Netlify** (free): https://netlify.com
   - **Vercel** (free): https://vercel.com
   - Any web server you have access to

2. Open the URL in Safari on your iOS device
3. Follow the same "Add to Home Screen" steps as Option A

### Step 4: Enjoy!
The calculator will now appear on your home screen with a custom icon. When you tap it:
- ✓ Opens full-screen (no Safari toolbar)
- ✓ Looks like a native app
- ✓ Works offline (once loaded)
- ✓ No bounce scrolling
- ✓ Respects iPhone notch/safe areas

## Features of the PWA

### What You Get:
- **Full-screen mode** - No browser UI
- **Custom app icon** - Beautiful gradient icon on home screen
- **Offline capability** - Works without internet (after first load)
- **Native feel** - Looks and feels like an App Store app
- **Safe area support** - Works perfectly with iPhone notch and iPad borders
- **Status bar integration** - Blends with iOS status bar

### What Works:
- All calculator functions
- 12-level stack display
- Memory operations
- Three modes: Decimal, Integer, Currency
- All HP RPN operations
- Keyboard input (when using external keyboard)

## Troubleshooting

### Icon doesn't appear?
- Make sure all PNG files are in the same folder as the HTML file
- File names are case-sensitive: `icon-180.png` not `Icon-180.png`
- Try force-closing Safari and adding to home screen again

### Opens in Safari instead of full-screen?
- Make sure you opened it in **Safari**, not Chrome or another browser
- Delete the home screen icon and re-add it
- Check that manifest.json is in the same folder

### Calculator looks cut off on iPhone?
- This should be fixed with the safe-area padding
- Try rotating to landscape and back to portrait
- Close and reopen the app

### Can I use this on Android?
Yes! The PWA works on Android too:
1. Open in Chrome (or any modern browser)
2. Tap the menu (⋮)
3. Tap "Add to Home screen"

## Advanced: Customizing the Icon

The `icon-generator.html` file creates icons with:
- Purple/blue gradient background
- Realistic calculator design
- "RPN" text in green LCD style
- Button layout preview

To customize:
1. Edit the `icon-generator.html` file
2. Change colors in the `drawIcon()` function
3. Regenerate icons by opening the file and downloading again

## Files Explained

- **rpn-calculator.html** - Main calculator app
- **manifest.json** - PWA configuration (name, colors, icons)
- **icon-*.png** - App icons for different devices/sizes
- **icon-generator.html** - Tool to create the PNG icons
- **app-icon.svg** - Vector source for the icon (optional)

## No Internet? No Problem!

Once you've added the calculator to your home screen, it works 100% offline. All code is self-contained in the HTML file - no external dependencies, no CDN links, no cloud services.

## Updating the Calculator

If you make changes to `rpn-calculator.html`:
1. Replace the file on your device or server
2. Delete the old home screen icon
3. Re-add to home screen
4. Or: force-refresh in Safari (if accessing via URL)

## Privacy

This calculator:
- ✓ Runs entirely on your device
- ✓ No analytics or tracking
- ✓ No data sent to any server
- ✓ No cookies
- ✓ No internet connection required after installation

Your calculations stay on your device, always.

---

**Enjoy your HP-style RPN calculator!** 🧮

For questions or issues, the calculator is fully open source - check the HTML file to see how everything works.
