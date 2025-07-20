# Favicon Generator

A free, easy-to-use web tool to generate custom favicons from text, emojis, or images. Instantly preview, customize, and download favicons in multiple sizes for your website or app.

## Features

- **Text/Emoji or Image Input:** Create favicons from a single character, emoji, or upload your own image.
- **Live Preview:** Instantly see your favicon in various sizes (16x16, 32x32, 48x48, 256x256).
- **Customization:**
  - Background color picker
  - Text color picker (for text/emoji mode)
  - Adjustable border radius
- **Download Multiple Sizes:** Export PNG favicons in common sizes (16x16, 32x32, 48x48, 128x128, 180x180, 192x192, 512x512).
- **Dark/Light Theme:** Toggle between dark and light mode for comfortable editing.
- **Responsive Design:** Works great on desktop and mobile.

## How to Use

1. **Choose Input Mode:**
   - *Text/Emoji:* Enter a character or emoji.
   - *Image:* Upload a PNG, JPG, or other image file.
2. **Customize:**
   - Pick background and (if applicable) text color.
   - Adjust border radius for rounded or square icons.
3. **Preview:**
   - See your favicon in multiple sizes in real time.
4. **Download:**
   - Click "Download Favicons" and save the sizes you need.
   - For websites, rename the 32x32 (or 16x16) PNG to `favicon.ico` if needed.
   - Place the favicon files in your website's root directory.
   - Add the following to your HTML `<head>`:

     ```html
     <link rel="icon" href="/favicon.ico" sizes="any">
     <link rel="apple-touch-icon" href="/favicon-180x180.png">
     ```

## Project Structure

- `index.html` – Main HTML file, includes UI and links to scripts/styles.
- `script.js` – Handles all logic: drawing, preview, download, theme, and input.
- `style.css` – Custom styles for theming, layout, and controls.

## Tech Stack

- **HTML5, CSS3** (with custom properties for theming)
- **JavaScript (Vanilla)**
- **Tailwind CSS** (via CDN)
- **Google Fonts: Inter**

## Local Development

Just open `index.html` in your browser. No build step or server required.

## License

MIT License. Free for personal and commercial use.

---

*Created by saahiyo. Contributions welcome!* 