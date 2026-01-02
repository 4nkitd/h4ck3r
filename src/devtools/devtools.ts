// Create DevTools panel
chrome.devtools.panels.create(
    'h4ck3r',
    '/src/assets/icons/icon-32.png',
    '/src/popup/index.html',
    (panel) => {
        console.log('h4ck3r DevTools panel created');
    }
);
