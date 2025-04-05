
## Codebase Overview

### Key Features
- **Encoding/Decoding**: Supports Base64, URL, and HEX encoding/decoding.
- **Encryption**: Provides MD5, SHA256, SHA512, SHA3, and AES encryption/decryption.
- **Form Automation**: Auto-fills forms with sample data and resets them.
- **Utilities**: Includes JSON beautifier, SQL injection payloads, and command-line snippets.
- **Toolbar**: A draggable toolbar for quick access to features.
- **Auto Reload**: Automatically reloads the page based on user configuration.

### Key Files and Their Purpose
1. **`injection/injection.js`**: Contains logic for toolbar rendering, form filling, and auto-reload functionality.
2. **`assets/js/app.js`**: Handles encoding, encryption, and JSON beautification.
3. **`assets/js/utf8.js`**: Provides UTF-8 encoding/decoding utilities.
4. **`options/options.html`**: Defines the UI for the extension's options page.
5. **`README.md`**: Documents the purpose, features, and usage of the extension.

---

## Copilot Usage Guidelines

### General Guidelines
1. **Follow Existing Patterns**: Adhere to the coding style and patterns used in the codebase, such as jQuery for DOM manipulation and modular functions for specific tasks.
2. **Use Existing Utilities**: Leverage existing helper functions like `random_string`, `random_number`, and `copyToClipboard` instead of creating new ones.
3. **Respect File Structure**: Place new features or updates in the appropriate files (e.g., UI changes in `options.html`, logic in `app.js` or `injection.js`).

### Specific Instructions
1. **Toolbar Enhancements**:
   - Use the `init` function in `injection.js` to add new toolbar items.
   - Follow the SVG-based icon pattern for new toolbar buttons.

2. **Form Automation**:
   - Extend the `fill_*` functions in `injection.js` for additional input types.
   - Ensure compatibility with existing form-filling logic.

3. **Encoding/Encryption**:
   - Add new encoding or encryption methods in `app.js`.
   - Update the corresponding UI in `options.html` and ensure results are auto-copied to the clipboard.

4. **JSON Beautification**:
   - Use the `syntaxHighlight` function in `app.js` for any JSON-related enhancements.
   - Ensure proper error handling for invalid JSON strings.

5. **SQL Injection Payloads**:
   - Add new payloads to the appropriate sections in `index.html` or `www/index.html`.

---

## Testing and Debugging
- Use the browser's developer tools to test the extension's functionality.
- Check for errors in the console and ensure all features work as expected.
- Validate UI changes in both Chromium and Firefox browsers.

---

## Notes for Copilot
- **Avoid Redundancy**: Before suggesting new code, check if similar functionality already exists.
- **Focus on Security**: Ensure that any new features or updates do not introduce security vulnerabilities.
- **Maintain Readability**: Write clean, well-documented code that aligns with the existing style.

---

## Future Enhancements
- Add support for radio buttons in form automation.
- Implement additional encryption algorithms.
- Enhance the toolbar with more customization options.

---