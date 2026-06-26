# 🌿 Isabella & Ethan — Intimate Wedding Invitation Website

A Garden Romance-themed wedding invitation built for **GitHub Pages** (free hosting).

---

## 📁 Files

```
intimate-wedding/
├── index.html   ← Full invitation page
├── style.css    ← Theme, palette, typography
├── script.js    ← Music, countdown, RSVP, confetti, map
├── Code.gs      ← Google Apps Script (copy into script.google.com)
└── README.md    ← This guide
```

---

## 🚀 Deploy to GitHub Pages

### Step 1 — Create the repository

1. Log in to [github.com](https://github.com)
2. Click **New repository**
3. Name it: `yourusername.github.io` *(your actual GitHub username)*
4. Visibility: **Public**
5. Click **Create repository**

### Step 2 — Upload files

**Via browser:**
- In your new repo, click **Add file → Upload files**
- Upload `index.html`, `style.css`, `script.js`, `README.md`
- Click **Commit changes**

**Via Git:**
```bash
git clone https://github.com/yourusername/yourusername.github.io
cd yourusername.github.io
# Copy files here, then:
git add .
git commit -m "Wedding invitation"
git push
```

### Step 3 — Enable GitHub Pages

1. Go to repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Visit `https://yourusername.github.io` in 1–2 minutes ✅

---

## 🔧 Set Up the RSVP → Google Sheets Connection

### Part A — Create your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **New spreadsheet**
2. Name it `Wedding RSVP`
3. Copy the spreadsheet **ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### Part B — Deploy the Google Apps Script

1. Go to [script.google.com](https://script.google.com) → **New Project**
2. Delete any existing code in the editor
3. Open `Code.gs` from this folder and **paste the entire contents**
4. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
5. Click **Save** (Ctrl+S / Cmd+S), name the project `Wedding RSVP`
6. Click **Deploy → New deployment**
7. Settings:
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy** → authorize when prompted
9. **Copy the Web App URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

### Part C — Add the URL to script.js

Open `script.js`, line ~17:
```js
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```
Replace with your copied Web App URL.

### What happens when a guest RSVPs

- Their name, attendance, dietary notes, and timestamp are saved to Google Sheets
- If they accept → confetti 🎊 bursts on screen
- The sheet auto-colours rows: green = accepting, pink = declining

---

## 🎵 Add Real Wedding Music

1. Download royalty-free MP3s from:
   - [pixabay.com/music](https://pixabay.com/music/) (search "wedding", "piano", "romantic")
   - [freemusicarchive.org](https://freemusicarchive.org)
2. Rename files simply: `track1.mp3`, `track2.mp3`, etc.
3. Upload them to your GitHub repo alongside `index.html`
4. In `script.js`, update the `PLAYLIST` array:
   ```js
   const PLAYLIST = [
     { title: 'A Thousand Years', url: './track1.mp3' },
     { title: 'Canon in D',       url: './track2.mp3' },
     { title: 'Perfect',          url: './track3.mp3' },
   ];
   ```

---

## 📍 Update Google Maps

1. Go to [maps.google.com](https://maps.google.com)
2. Search your venue → click **Share → Embed a map**
3. Copy the `src="..."` URL from the `<iframe>` code
4. In `index.html`, find the `<iframe id="map-ceremony">` and `<iframe id="map-reception">` tags
5. Replace their `src` values
6. Also update the `href` of `.dir-btn` anchor tags

---

## 📷 Set Up the Photo Upload Folder

1. Create a folder in [Google Drive](https://drive.google.com)
2. Right-click → **Share** → change to **"Anyone with the link" → Editor**
3. Copy the folder link
4. In `index.html`, find:
   ```html
   href="https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE"
   ```
   Replace with your folder link

---

## ✏️ Personalize Everything

| What to change | Where |
|---|---|
| Couple's names | `index.html` — search "Isabella" & "Ethan" |
| Wedding date | `script.js` line ~14: `WEDDING_DATE` |
| Wedding date (display) | `index.html` `cover-datenum` span |
| Venue names & addresses | `index.html` `#details` section |
| RSVP deadline | `index.html` — "Kindly reply by …" |
| Bible verse / quote | `index.html` `closing-quote` paragraph |
| Entourage names | `index.html` `#entourage` section |
| Motif colors | `style.css` `:root` CSS variables |
| Background images | `style.css` — `#cover` and `#rsvp` background URLs |
| Map locations | `index.html` iframe `src` attributes |

---

## 🎨 Motif Color Tokens (style.css)

```css
:root {
  --sage:      #A8B5A0;  /* Sage Green — accents, borders */
  --champagne: #D4B896;  /* Champagne — CTAs, highlights */
  --burgundy:  #7D3C3C;  /* Burgundy — deep accents */
  --ivory:     #F5F0E8;  /* Ivory — card backgrounds */
  --bark:      #8B7355;  /* Warm Bark — buttons, icons */
  --dark:      #2E2318;  /* Deep Brown — dark sections */
}
```

---

## 💡 Tips

- **Test before pushing**: open `index.html` in any browser — everything works locally except the RSVP submit (needs the deployed script URL)
- **RSVP form troubleshooting**: if responses aren't appearing in Sheets, re-deploy the Apps Script and make sure "Anyone" access is set
- **Music autoplay**: browsers block autoplay until the user interacts. The first scroll, click, or tap will start the music automatically
- The site is **fully mobile-responsive** and respects `prefers-reduced-motion`

---

*Crafted with ♥ for your most intimate celebration.*
