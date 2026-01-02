import '../styles/globals.css';

// Load settings
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

function loadSettings() {
    const toolbarEnabled = localStorage.getItem('h4ck3r.toolbar.enabled') !== 'false';
    const autoFillEnabled = localStorage.getItem('h4ck3r.toolbar.fill') !== 'false';
    const domainsEnabled = localStorage.getItem('h4ck3r.toolbar.domains') !== 'false';

    (document.getElementById('toolbarEnabled') as HTMLInputElement).checked = toolbarEnabled;
    (document.getElementById('autoFillEnabled') as HTMLInputElement).checked = autoFillEnabled;
    (document.getElementById('domainsEnabled') as HTMLInputElement).checked = domainsEnabled;
}

function setupEventListeners() {
    // Save settings on change
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    // Clear rules button
    document.getElementById('clearRules')?.addEventListener('click', clearModHeaderRules);
}

function saveSettings() {
    localStorage.setItem('h4ck3r.toolbar.enabled',
        (document.getElementById('toolbarEnabled') as HTMLInputElement).checked.toString());
    localStorage.setItem('h4ck3r.toolbar.fill',
        (document.getElementById('autoFillEnabled') as HTMLInputElement).checked.toString());
    localStorage.setItem('h4ck3r.toolbar.domains',
        (document.getElementById('domainsEnabled') as HTMLInputElement).checked.toString());

    showToast('Settings saved');
}

function clearModHeaderRules() {
    chrome.storage.local.remove(['modHeaderRules', 'modHeaderNextId'], () => {
        chrome.runtime.sendMessage({ action: 'updateModHeaderRules', rules: [], enabled: true });
        showToast('All ModHeader rules cleared');
    });
}

function showToast(message: string) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 2000);
    }
}
