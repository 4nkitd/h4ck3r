# ![Icon](./src/assets/icons/icon-32.png) h4ck3r

**All-in-One Red Team Developer Toolkit** - A modern Chrome extension for developers & pentesters.

[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](https://github.com/4nkitd/h4ck3r)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

### 🔐 Encoding & Hashing
- **Base64** - Encode/decode text
- **URL** - URL encode/decode
- **HEX** - Hexadecimal conversion
- **HTML Entity** - HTML entity encoding
- **Hash Generator** - MD5, SHA1, SHA256, SHA512
- **JWT Decoder** - Decode and inspect JWT tokens

### 🛠️ Data Tools
- **JSON Beautify** - Format and validate JSON
- **Timestamp Converter** - Convert Unix timestamps

### 🌐 Network
- **ModHeader** - Modify HTTP request/response headers
- **Domain Extractor** - Extract all domains from current page

### 💉 Payload Libraries
- **SQL Injection** - Common SQLi payloads by category
- **XSS Payloads** - Cross-site scripting vectors
- **LFI Payloads** - Local file inclusion paths
- **Reverse Shells** - Generate reverse shell commands (bash, python, php, nc, etc.)

### 📚 Reference
- **Linux Commands** - Quick reference for common commands

## 🚀 Installation

### From Source
```bash
# Clone the repository
git clone https://github.com/4nkitd/h4ck3r.git
cd h4ck3r

# Install dependencies
npm install

# Build
npm run build

# Load in Chrome:
# 1. Go to chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the `dist` folder
```

### From Store
- **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/h4ck3r/kmnlfjgamfnhcmpfnmgpiapacncdipad)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/h4ck3r-d/)
- **Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/h4ck3r/eglafmgecldkdjfodkjgcpepkodndgdg)

## 📖 Usage

1. **Click the extension icon** - Opens as a side panel
2. **Use the icon sidebar** - Hover for tooltips, click to switch tools
3. **Keyboard shortcuts**:
   - `⌘K` / `Ctrl+K` - Open command palette
   - `⌘⇧E` / `Ctrl+Shift+E` - Encode
   - `⌘⇧D` / `Ctrl+Shift+D` - Decode

## 🎨 UI Features

- **Side Panel Mode** - Works alongside your browsing
- **Compact Icon Sidebar** - More space for content
- **Dark Theme** - Easy on the eyes
- **Floating Toolbar** - Quick actions on any page (can be disabled in settings)

## 🔧 Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Create zip for store submission
npm run build:zip
```

## 📁 Project Structure

```
h4ck3r/
├── src/
│   ├── popup/         # Main UI (side panel)
│   ├── background/    # Service worker
│   ├── content/       # Content script & toolbar
│   ├── lib/           # Payload libraries
│   └── styles/        # CSS design system
├── dist/              # Built extension
└── package.json
```

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Discord Community](https://discord.gg/gFcewQUA)
- [Report Issues](https://github.com/4nkitd/h4ck3r/issues)
- [Demo](https://dagar.in/demo/h4ck3r/)

---

Made with ❤️ for the security community
