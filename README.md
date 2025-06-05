# 🦊 AddFox – Local Address Book for Firefox

**AddFox** is a lightweight, privacy-focused Firefox extension that allows you to manage a personal address book — all stored **locally** in your browser.

No accounts, no sync, no trackers. Just you and your contacts. 🖤

---

## ✨ Features

- 📬 Save contact info: email, phone, and full address (with post code!)
- 🌗 Toggle between light and dark mode
- 📁 Import/export your contacts as JSON
- ✏️ Edit and delete existing entries
- 🔒 100% local storage — nothing leaves your browser

---

## 📦 Installation

1. Clone or download this repo:
   ```bash
   git clone https://github.com/BWolf-16/AddFox.git
   ```
2. Open `about:debugging` in Firefox
3. Click **"Load Temporary Add-on"**
4. Select `manifest.json` from the project folder

> 🔁 You’ll need to reload it manually every time you restart Firefox unless you publish it to AMO.

---

## 🛠️ File Structure

| File              | Purpose                        |
|-------------------|--------------------------------|
| `popup.html`      | The UI of the extension        |
| `popup.js`        | Logic for saving, editing, and exporting contacts |
| `popup.css`       | Styling for the UI             |
| `manifest.json`   | Extension metadata             |
| `icons/`          | Add-on icons                   |
| `screenshots/`    | (Optional) Demo images         |

---

## 🧪 Dev Notes

- Built with plain JS + HTML/CSS — no frameworks
- Firefox-only (uses `browser.*` API)
- Contacts are saved in `browser.storage.local`

---

## 💡 Ideas for Future (for when i have too much extra time)

- 📱 Contact groups or tags
- 🔍 Search/filter support
- ☁️ Optional cloud sync (with opt-in only)

---

## 📜 License

MIT — do whatever you want, just don’t remove my name.  
Made by [@BWolf-16](https://github.com/BWolf-16) 🐺
