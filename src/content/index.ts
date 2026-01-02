// h4ck3r Content Script - Toolbar injection
import './injection.css';

// Check if toolbar should be shown via chrome.storage
async function init() {
    try {
        const result = await chrome.storage.local.get(['toolbarEnabled']);
        const shouldShow = result.toolbarEnabled !== false;

        if (shouldShow) {
            createToolbar();
        }
    } catch {
        // Fallback: show toolbar if storage fails
        createToolbar();
    }
}

init();

// Message listener for side panel communication
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'extractDomains') {
        const domains = extractAllDomains();
        sendResponse({ domains });
    }
    return true;
});

// Extract all domains from page
function extractAllDomains(): string[] {
    const domains = new Set<string>();
    const selectors = ['a[href]', 'img[src]', 'script[src]', 'link[href]', 'iframe[src]'];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            const attr = sel.includes('href') ? 'href' : 'src';
            const url = el.getAttribute(attr);
            if (url) {
                try {
                    const parsed = new URL(url, window.location.href);
                    if (parsed.hostname) domains.add(parsed.hostname);
                } catch { }
            }
        });
    });

    return Array.from(domains).sort();
}

function createToolbar() {
    // Check if already exists
    if (document.getElementById('h4ck3r-toolbar')) return;

    // Create toolbar container
    const toolbar = document.createElement('div');
    toolbar.id = 'h4ck3r-toolbar';
    toolbar.innerHTML = `
    <div class="h4ck3r-toolbar-inner">
      <span class="h4ck3r-logo">&lt;/&gt;</span>
      <button class="h4ck3r-btn" data-action="fill" title="Auto-fill forms">Fill</button>
      <button class="h4ck3r-btn" data-action="domains" title="Extract domains">Domains</button>
      <button class="h4ck3r-btn" data-action="reload" title="Hard reload">↻</button>
      <button class="h4ck3r-btn h4ck3r-hide" data-action="hide" title="Hide toolbar">×</button>
    </div>
  `;

    document.body.appendChild(toolbar);

    // Make draggable
    makeDraggable(toolbar);

    // Button handlers
    toolbar.querySelectorAll('.h4ck3r-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = (e.target as HTMLElement).getAttribute('data-action');
            handleToolbarAction(action);
        });
    });
}

function handleToolbarAction(action: string | null) {
    switch (action) {
        case 'fill':
            autoFillForms();
            break;
        case 'domains':
            extractDomains();
            break;
        case 'reload':
            location.reload();
            break;
        case 'hide':
            hideToolbar();
            break;
    }
}

function autoFillForms() {
    const testData: Record<string, string> = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        password: 'Test@123',
        phone: '+1234567890',
        address: '123 Test Street',
        city: 'Test City',
        zip: '12345',
        country: 'Test Country',
    };

    document.querySelectorAll('input, textarea').forEach((input) => {
        const el = input as HTMLInputElement;
        const name = (el.name || el.id || el.placeholder || '').toLowerCase();

        for (const [key, value] of Object.entries(testData)) {
            if (name.includes(key)) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
        }
    });

    showNotification('Forms auto-filled');
}

function extractDomains() {
    const domains = new Set<string>();

    const selectors = ['a[href]', 'img[src]', 'script[src]', 'link[href]', 'iframe[src]'];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            const attr = selector.includes('href') ? 'href' : 'src';
            const url = el.getAttribute(attr);
            if (url) {
                try {
                    const parsed = new URL(url, window.location.href);
                    if (parsed.hostname) domains.add(parsed.hostname);
                } catch {
                    // Invalid URL, skip
                }
            }
        });
    });

    const domainList = Array.from(domains).sort().join('\n');

    navigator.clipboard.writeText(domainList).then(() => {
        showNotification(`${domains.size} domains copied to clipboard`);
    });

    console.log('Domains found:', domainList);
}

function hideToolbar() {
    const toolbar = document.getElementById('h4ck3r-toolbar');
    if (toolbar) {
        toolbar.style.display = 'none';
        // Save to chrome.storage so it persists
        chrome.storage.local.set({ toolbarEnabled: false });
    }
}

function showNotification(message: string) {
    const notification = document.createElement('div');
    notification.className = 'h4ck3r-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
}

function makeDraggable(element: HTMLElement) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let origX = 0, origY = 0;

    element.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).classList.contains('h4ck3r-btn')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = element.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;

        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        element.style.left = `${origX + dx}px`;
        element.style.top = `${origY + dy}px`;
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'move';

            // Save position to chrome.storage
            chrome.storage.local.set({
                toolbarPositionTop: element.style.top,
                toolbarPositionLeft: element.style.left,
            });
        }
    });

    // Restore saved position
    chrome.storage.local.get(['toolbarPositionTop', 'toolbarPositionLeft']).then(result => {
        const top = result.toolbarPositionTop as string | undefined;
        const left = result.toolbarPositionLeft as string | undefined;
        if (top && left) {
            element.style.top = top;
            element.style.left = left;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }
    });
}
