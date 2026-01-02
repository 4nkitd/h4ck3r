import '../styles/globals.css';
import type { ModHeaderRule } from '../background/modheader';

let rules: ModHeaderRule[] = [];
let globalEnabled = true;
let nextRuleId = 1;

// DOM Elements
const rulesTableBody = document.getElementById('rulesTableBody')!;
const noRulesDiv = document.getElementById('noRules')!;
const statusDiv = document.getElementById('status')!;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRules();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addRuleBtn')?.addEventListener('click', addRule);
    document.getElementById('globalToggle')?.addEventListener('change', toggleGlobal);
    document.getElementById('exportBtn')?.addEventListener('click', exportRules);
    document.getElementById('importFile')?.addEventListener('change', importRules);
}

async function loadRules() {
    const result = await chrome.storage.local.get(['modHeaderRules', 'modHeaderEnabled', 'modHeaderNextId']);
    rules = result.modHeaderRules || [];
    globalEnabled = result.modHeaderEnabled !== false;
    nextRuleId = result.modHeaderNextId || 1;

    (document.getElementById('globalToggle') as HTMLInputElement).checked = globalEnabled;
    renderRules();
}

function saveRules() {
    chrome.storage.local.set({
        modHeaderRules: rules,
        modHeaderEnabled: globalEnabled,
        modHeaderNextId: nextRuleId,
    });

    chrome.runtime.sendMessage({
        action: 'updateModHeaderRules',
        rules,
        enabled: globalEnabled,
    });
}

function addRule() {
    const name = (document.getElementById('ruleName') as HTMLInputElement).value.trim();
    const urlPattern = (document.getElementById('urlPattern') as HTMLInputElement).value.trim() || '*://*/*';
    const headerType = (document.getElementById('headerType') as HTMLSelectElement).value as 'request' | 'response';
    const operation = (document.getElementById('operation') as HTMLSelectElement).value as 'set' | 'remove';
    const headerName = (document.getElementById('headerName') as HTMLInputElement).value.trim();
    const headerValue = (document.getElementById('headerValue') as HTMLInputElement).value;

    if (!headerName) {
        showStatus('Header name is required', 'error');
        return;
    }

    rules.push({
        id: nextRuleId++,
        enabled: true,
        name: name || `Rule ${rules.length + 1}`,
        urlPattern,
        headerType,
        operation,
        headerName,
        headerValue,
    });

    saveRules();
    renderRules();
    clearForm();
    showStatus('Rule added', 'success');
}

function clearForm() {
    (document.getElementById('ruleName') as HTMLInputElement).value = '';
    (document.getElementById('urlPattern') as HTMLInputElement).value = '';
    (document.getElementById('headerName') as HTMLInputElement).value = '';
    (document.getElementById('headerValue') as HTMLInputElement).value = '';
}

function renderRules() {
    if (rules.length === 0) {
        rulesTableBody.innerHTML = '';
        noRulesDiv.style.display = 'block';
        return;
    }

    noRulesDiv.style.display = 'none';
    rulesTableBody.innerHTML = rules.map(rule => `
    <tr>
      <td>
        <label class="switch" style="transform: scale(0.8);">
          <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-id="${rule.id}" class="rule-toggle">
          <span class="switch-thumb"></span>
        </label>
      </td>
      <td>${escapeHtml(rule.name)}</td>
      <td><code class="text-warning">${escapeHtml(rule.urlPattern)}</code></td>
      <td><span class="badge ${rule.headerType === 'request' ? 'badge-info' : 'badge-primary'}">${rule.headerType}</span></td>
      <td><code class="text-primary">${escapeHtml(rule.headerName)}</code></td>
      <td class="truncate" style="max-width: 150px;">${rule.operation === 'remove' ? '<em class="text-muted">(removed)</em>' : escapeHtml(rule.headerValue)}</td>
      <td><button class="btn btn-ghost btn-sm btn-icon delete-rule" data-id="${rule.id}">×</button></td>
    </tr>
  `).join('');

    // Bind events
    rulesTableBody.querySelectorAll('.rule-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const id = parseInt((e.target as HTMLInputElement).getAttribute('data-id')!);
            toggleRule(id);
        });
    });

    rulesTableBody.querySelectorAll('.delete-rule').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt((e.target as HTMLElement).getAttribute('data-id')!);
            deleteRule(id);
        });
    });
}

function toggleRule(id: number) {
    const rule = rules.find(r => r.id === id);
    if (rule) {
        rule.enabled = !rule.enabled;
        saveRules();
    }
}

function deleteRule(id: number) {
    rules = rules.filter(r => r.id !== id);
    saveRules();
    renderRules();
    showStatus('Rule deleted', 'warning');
}

function toggleGlobal() {
    globalEnabled = (document.getElementById('globalToggle') as HTMLInputElement).checked;
    saveRules();
    showStatus(globalEnabled ? 'ModHeader enabled' : 'ModHeader disabled', 'info');
}

function exportRules() {
    const data = JSON.stringify(rules, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'h4ck3r-modheader-rules.json';
    a.click();

    URL.revokeObjectURL(url);
    showStatus('Rules exported', 'success');
}

function importRules(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target?.result as string);
            if (!Array.isArray(imported)) throw new Error('Invalid format');

            imported.forEach(rule => {
                rule.id = nextRuleId++;
                if (typeof rule.enabled === 'undefined') rule.enabled = true;
            });

            rules = rules.concat(imported);
            saveRules();
            renderRules();
            showStatus(`Imported ${imported.length} rules`, 'success');
        } catch {
            showStatus('Invalid JSON file', 'error');
        }
    };
    reader.readAsText(file);
}

function showStatus(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `toast toast-${type}`;
    statusDiv.style.display = 'flex';
    setTimeout(() => statusDiv.style.display = 'none', 3000);
}

function escapeHtml(text: string): string {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
