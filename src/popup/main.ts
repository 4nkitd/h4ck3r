// h4ck3r Popup - Main Entry Point
import '../styles/globals.css';
import CryptoJS from 'crypto-js';
import {
  sqlInjectionPayloads,
  xssPayloads,
  lfiPayloads,
  reverseShells,
  ttySpawnCommands,
  type PayloadCategory
} from '../lib/payloads';

// Types
interface Tool {
  id: string;
  title: string;
  category: string;
  shortcut?: string;
}

interface ModHeaderRuleLocal {
  id: number;
  enabled: boolean;
  name: string;
  urlPattern: string;
  headerType: 'request' | 'response';
  operation: 'set' | 'remove';
  headerName: string;
  headerValue: string;
}

// Tool definitions
const tools: Tool[] = [
  { id: 'base64', title: 'Base64 Encoder/Decoder', category: 'Encoding', shortcut: '⌘1' },
  { id: 'url', title: 'URL Encoder/Decoder', category: 'Encoding', shortcut: '⌘2' },
  { id: 'hex', title: 'HEX Encoder/Decoder', category: 'Encoding', shortcut: '⌘3' },
  { id: 'html', title: 'HTML Entity Encode/Decode', category: 'Encoding' },
  { id: 'hash', title: 'Hash Generator', category: 'Hashing' },
  { id: 'jwt', title: 'JWT Decoder', category: 'Hashing' },
  { id: 'json', title: 'JSON Beautifier', category: 'Data' },
  { id: 'timestamp', title: 'Timestamp Converter', category: 'Data' },
  { id: 'modheader', title: 'ModHeader', category: 'Network' },
  { id: 'domains', title: 'Domain Extractor', category: 'Network' },
  { id: 'sqli', title: 'SQL Injection Payloads', category: 'Payloads' },
  { id: 'xss', title: 'XSS Payloads', category: 'Payloads' },
  { id: 'shells', title: 'Reverse Shell Generator', category: 'Payloads' },
  { id: 'lfi', title: 'LFI Payloads', category: 'Payloads' },
  { id: 'commands', title: 'Linux Commands', category: 'Reference' },
  { id: 'settings', title: 'Settings', category: 'Settings' },
];

// State
let currentTool = 'base64';

// DOM Elements
const toolTitle = document.getElementById('toolTitle') as HTMLElement;
const toolContent = document.getElementById('toolContent') as HTMLElement;
const commandPalette = document.getElementById('commandPalette') as HTMLElement;
const commandSearch = document.getElementById('commandSearch') as HTMLInputElement;
const commandList = document.getElementById('commandList') as HTMLElement;
const toastContainer = document.getElementById('toastContainer') as HTMLElement;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  populateCommandPalette();
  loadTool('base64');
});

// Event Listeners
function setupEventListeners() {
  // Icon sidebar navigation
  document.querySelectorAll('.icon-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.getAttribute('data-tool');
      if (tool) loadTool(tool);
    });
  });

  // Command palette
  document.getElementById('cmdPalette')?.addEventListener('click', openCommandPalette);
  commandPalette?.addEventListener('click', (e) => {
    if (e.target === commandPalette) closeCommandPalette();
  });
  commandSearch?.addEventListener('input', filterCommands);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  // Open full page
  document.getElementById('openFullPage')?.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/popup/index.html') });
  });
}

// Load tool
function loadTool(toolId: string) {
  currentTool = toolId;

  // Update icon sidebar active state
  document.querySelectorAll('.icon-btn[data-tool]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tool') === toolId);
  });

  // Update title
  const tool = tools.find(t => t.id === toolId);
  if (tool) toolTitle.textContent = tool.title;
  else if (toolId === 'settings') toolTitle.textContent = 'Settings';

  // Render the appropriate panel
  renderToolPanel(toolId);
}

// Render tool panel based on tool type
function renderToolPanel(toolId: string) {
  switch (toolId) {
    case 'sqli':
      renderPayloadPanel(sqlInjectionPayloads, 'SQL Injection');
      break;
    case 'xss':
      renderPayloadPanel(xssPayloads, 'XSS');
      break;
    case 'lfi':
      renderPayloadPanel(lfiPayloads, 'LFI');
      break;
    case 'shells':
      renderShellGenerator();
      break;
    case 'modheader':
      renderModHeaderLink();
      break;
    case 'domains':
      renderDomainExtractor();
      break;
    case 'timestamp':
      renderTimestampConverter();
      break;
    case 'commands':
      renderLinuxCommands();
      break;
    case 'settings':
      renderSettings();
      break;
    default:
      renderEncoderDecoder(toolId);
  }
}

// Render encoder/decoder panel (Base64, URL, Hex, HTML, Hash, JWT, JSON)
function renderEncoderDecoder(toolId: string) {
  const placeholders: Record<string, string> = {
    base64: 'Enter text to encode/decode...',
    url: 'Enter URL to encode/decode...',
    hex: 'Enter text for HEX conversion...',
    html: 'Enter text for HTML entity encoding...',
    hash: 'Enter text to hash...',
    jwt: 'Paste JWT token here...',
    json: 'Paste JSON to beautify...',
  };

  const hashSelector = toolId === 'hash' ? `
    <select class="input select" id="hashType" style="flex: 1;">
      <option value="md5">MD5</option>
      <option value="sha1">SHA1</option>
      <option value="sha256">SHA256</option>
      <option value="sha512">SHA512</option>
    </select>
  ` : '';

  toolContent.innerHTML = `
    <div class="tool-panel" style="display: flex; flex-direction: column; gap: 12px; height: calc(100vh - 100px);">
      <!-- Action buttons row -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${hashSelector}
        <button class="btn btn-primary btn-sm" id="encodeBtn" style="flex: 1; min-width: 60px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          </svg>
          Encode
        </button>
        <button class="btn btn-secondary btn-sm" id="decodeBtn" style="flex: 1; min-width: 60px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          Decode
        </button>
      </div>
      
      <!-- Text area -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
        <textarea 
          class="input textarea" 
          id="mainText" 
          placeholder="${placeholders[toolId] || 'Enter text...'}"
          style="flex: 1; resize: none; font-family: var(--font-mono); font-size: 13px;"
        ></textarea>
      </div>
      
      <!-- Quick actions -->
      <div style="display: flex; gap: 6px;">
        <button class="btn btn-ghost btn-sm" id="pasteBtn" title="Paste from clipboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          </svg>
          Paste
        </button>
        <button class="btn btn-ghost btn-sm" id="copyBtn" title="Copy to clipboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy
        </button>
        <button class="btn btn-ghost btn-sm" id="clearBtn" title="Clear">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Clear
        </button>
      </div>
    </div>
  `;

  const mainText = document.getElementById('mainText') as HTMLTextAreaElement;

  // Bind events
  document.getElementById('encodeBtn')?.addEventListener('click', () => {
    const result = encodeText(toolId, mainText.value);
    if (result !== null) mainText.value = result;
  });

  document.getElementById('decodeBtn')?.addEventListener('click', () => {
    const result = decodeText(toolId, mainText.value);
    if (result !== null) mainText.value = result;
  });

  document.getElementById('copyBtn')?.addEventListener('click', () => {
    copyToClipboard(mainText.value);
  });

  document.getElementById('pasteBtn')?.addEventListener('click', async () => {
    try {
      mainText.value = await navigator.clipboard.readText();
      showToast('Pasted', 'success');
    } catch {
      showToast('Failed to paste', 'error');
    }
  });

  document.getElementById('clearBtn')?.addEventListener('click', () => {
    mainText.value = '';
  });
}

// Encode text helper
function encodeText(toolId: string, input: string): string | null {
  if (!input) return null;

  try {
    switch (toolId) {
      case 'base64':
        return btoa(unescape(encodeURIComponent(input)));
      case 'url':
        return encodeURIComponent(input);
      case 'hex':
        return Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      case 'html':
        return input.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
      case 'hash':
        const hashType = (document.getElementById('hashType') as HTMLSelectElement)?.value || 'md5';
        const CryptoJS = (window as any).CryptoJS;
        if (!CryptoJS) return input;
        switch (hashType) {
          case 'sha1': return CryptoJS.SHA1(input).toString();
          case 'sha256': return CryptoJS.SHA256(input).toString();
          case 'sha512': return CryptoJS.SHA512(input).toString();
          default: return CryptoJS.MD5(input).toString();
        }
      case 'json':
        return JSON.stringify(JSON.parse(input), null, 2);
      default:
        return input;
    }
  } catch (e) {
    showToast('Error: ' + (e as Error).message, 'error');
    return null;
  }
}

// Decode text helper
function decodeText(toolId: string, input: string): string | null {
  if (!input) return null;

  try {
    switch (toolId) {
      case 'base64':
        return decodeURIComponent(escape(atob(input)));
      case 'url':
        return decodeURIComponent(input);
      case 'hex':
        return input.match(/.{1,2}/g)?.map(b => String.fromCharCode(parseInt(b, 16))).join('') || '';
      case 'html':
        const el = document.createElement('textarea');
        el.innerHTML = input;
        return el.value;
      case 'jwt':
        const parts = input.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT');
        const decode = (s: string) => {
          s = s.replace(/-/g, '+').replace(/_/g, '/');
          while (s.length % 4) s += '=';
          return JSON.parse(atob(s));
        };
        return JSON.stringify({ header: decode(parts[0]), payload: decode(parts[1]) }, null, 2);
      default:
        return input;
    }
  } catch (e) {
    showToast('Error: ' + (e as Error).message, 'error');
    return null;
  }
}

// Render payload panel
function renderPayloadPanel(categories: PayloadCategory[], title: string) {
  const categoriesHtml = categories.map((cat, idx) => `
    <div class="card" style="margin-bottom: var(--spacing-md);">
      <div class="card-header" style="cursor: pointer;" data-category="${idx}">
        <span class="card-title">${cat.name}</span>
        <span class="text-muted text-sm">${cat.description}</span>
      </div>
      <div class="card-content category-content" id="category-${idx}">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Payload</th>
                <th style="width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              ${cat.payloads.map(p => `
                <tr>
                  <td>
                    ${p.name}
                    ${p.database ? `<span class="badge badge-info" style="margin-left: 4px;">${p.database}</span>` : ''}
                  </td>
                  <td><code class="text-primary">${escapeHtml(p.payload.substring(0, 50))}${p.payload.length > 50 ? '...' : ''}</code></td>
                  <td>
                    <button class="btn btn-ghost btn-sm btn-icon copy-payload" data-payload="${escapeHtml(p.payload)}" title="Copy">📋</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `).join('');

  toolContent.innerHTML = `
    <div class="tool-panel" style="max-height: calc(100vh - 150px); overflow-y: auto;">
      <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-md);">
        <input type="text" class="input" id="payloadSearch" placeholder="Search payloads..." style="max-width: 300px;">
      </div>
      ${categoriesHtml}
    </div>
  `;

  // Bind copy events
  document.querySelectorAll('.copy-payload').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const payload = (e.target as HTMLElement).getAttribute('data-payload') || '';
      copyToClipboard(payload);
    });
  });

  // Search functionality
  document.getElementById('payloadSearch')?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    document.querySelectorAll('.table tbody tr').forEach(row => {
      const text = row.textContent?.toLowerCase() || '';
      (row as HTMLElement).style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// Render reverse shell generator
function renderShellGenerator() {
  toolContent.innerHTML = `
    <div class="tool-panel">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Reverse Shell Generator</span>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-3 gap-md" style="margin-bottom: var(--spacing-lg);">
            <div>
              <label class="text-sm text-muted">Listener IP</label>
              <input type="text" class="input" id="shellIP" placeholder="10.10.10.10" value="10.10.10.10">
            </div>
            <div>
              <label class="text-sm text-muted">Listener Port</label>
              <input type="text" class="input" id="shellPort" placeholder="4444" value="4444">
            </div>
            <div>
              <label class="text-sm text-muted">Shell Type</label>
              <select class="input select" id="shellType">
                <option value="bash">Bash</option>
                <option value="bashUdp">Bash (UDP)</option>
                <option value="python">Python</option>
                <option value="python3">Python3</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="netcat">Netcat</option>
                <option value="netcatMkfifo">Netcat (mkfifo)</option>
                <option value="perl">Perl</option>
                <option value="powershell">PowerShell</option>
              </select>
            </div>
          </div>
          
          <button class="btn btn-primary w-full" id="generateShell">Generate Shell</button>
          
          <div style="margin-top: var(--spacing-lg);">
            <label class="text-sm text-muted">Generated Command</label>
            <textarea class="input textarea" id="shellOutput" rows="4" readonly placeholder="Generated shell will appear here..."></textarea>
            <button class="btn btn-secondary w-full" id="copyShell" style="margin-top: var(--spacing-sm);">Copy to Clipboard</button>
          </div>
        </div>
      </div>
      
      <div class="card" style="margin-top: var(--spacing-lg);">
        <div class="card-header">
          <span class="card-title">TTY Shell Spawn Commands</span>
        </div>
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <tbody>
                ${ttySpawnCommands.map(cmd => `
                  <tr>
                    <td><code class="text-primary">${escapeHtml(cmd)}</code></td>
                    <td style="width: 60px;">
                      <button class="btn btn-ghost btn-sm btn-icon copy-payload" data-payload="${escapeHtml(cmd)}">📋</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind events
  document.getElementById('generateShell')?.addEventListener('click', () => {
    const ip = (document.getElementById('shellIP') as HTMLInputElement).value;
    const port = (document.getElementById('shellPort') as HTMLInputElement).value;
    const type = (document.getElementById('shellType') as HTMLSelectElement).value;

    const generator = reverseShells[type as keyof typeof reverseShells];
    if (generator) {
      const shell = generator(ip, port);
      (document.getElementById('shellOutput') as HTMLTextAreaElement).value = shell;
    }
  });

  document.getElementById('copyShell')?.addEventListener('click', () => {
    const output = (document.getElementById('shellOutput') as HTMLTextAreaElement).value;
    copyToClipboard(output);
  });

  document.querySelectorAll('.copy-payload').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const payload = (e.target as HTMLElement).getAttribute('data-payload') || '';
      copyToClipboard(payload);
    });
  });
}

// Render ModHeader - Full inline configuration
function renderModHeaderLink() {
  toolContent.innerHTML = `
    <div class="tool-panel" style="max-height: calc(100vh - 150px); overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none;">
      <!-- Header with global toggle -->
      <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-md);">
        <div>
          <h3 class="text-base" style="margin: 0;">HTTP Header Rules</h3>
          <span class="text-sm text-muted">Modify request and response headers</span>
        </div>
        <div class="flex items-center gap-sm">
          <span class="text-sm">Enable</span>
          <label class="switch">
            <input type="checkbox" id="modHeaderGlobalToggle" checked>
            <span class="switch-thumb"></span>
          </label>
        </div>
      </div>
      
      <!-- Add Rule Form -->
      <div class="card" style="margin-bottom: var(--spacing-md);">
        <div class="card-header">
          <span class="card-title">Add New Rule</span>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--spacing-sm);">
            <input type="text" class="input" id="mhRuleName" placeholder="Rule Name">
            <input type="text" class="input" id="mhUrlPattern" placeholder="URL Pattern (e.g., *://api.*)">
          </div>
          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--spacing-sm);">
            <select class="input select" id="mhHeaderType">
              <option value="request">Request Header</option>
              <option value="response">Response Header</option>
            </select>
            <select class="input select" id="mhOperation">
              <option value="set">Set Value</option>
              <option value="remove">Remove Header</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--spacing-sm);">
            <input type="text" class="input" id="mhHeaderName" placeholder="Header Name">
            <input type="text" class="input" id="mhHeaderValue" placeholder="Header Value">
          </div>
          <button class="btn btn-primary w-full" id="mhAddRule">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Rule
          </button>
        </div>
      </div>
      
      <!-- Active Rules -->
      <div class="card" style="margin-bottom: var(--spacing-md);">
        <div class="card-header flex justify-between items-center">
          <span class="card-title">Active Rules</span>
          <div class="flex gap-xs">
            <button class="btn btn-outline btn-sm" id="mhExport">Export</button>
            <label class="btn btn-outline btn-sm" style="cursor: pointer;">
              Import
              <input type="file" id="mhImportFile" accept=".json" style="display: none;">
            </label>
          </div>
        </div>
        <div id="mhRulesContainer">
          <div id="mhNoRules" class="text-muted" style="text-align: center; padding: var(--spacing-lg);">
            No rules configured. Add a rule above to get started.
          </div>
          <div class="table-container" id="mhRulesTableContainer" style="display: none;">
            <table class="table">
              <thead>
                <tr>
                  <th style="width: 50px;">On</th>
                  <th>Name</th>
                  <th>Header</th>
                  <th>Value</th>
                  <th style="width: 50px;"></th>
                </tr>
              </thead>
              <tbody id="mhRulesTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="flex gap-sm">
        <button class="btn btn-destructive btn-sm" id="mhClearAll">Clear All</button>
      </div>
    </div>
  `;

  // State
  let rules: ModHeaderRuleLocal[] = [];
  let globalEnabled = true;
  let nextRuleId = 1;



  // Load rules
  loadRules();

  async function loadRules() {
    const result = await chrome.storage.local.get(['modHeaderRules', 'modHeaderEnabled', 'modHeaderNextId']);
    rules = (result.modHeaderRules as ModHeaderRuleLocal[]) || [];
    globalEnabled = result.modHeaderEnabled !== false;
    nextRuleId = (result.modHeaderNextId as number) || 1;

    (document.getElementById('modHeaderGlobalToggle') as HTMLInputElement).checked = globalEnabled;
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

  function renderRules() {
    const noRules = document.getElementById('mhNoRules')!;
    const tableContainer = document.getElementById('mhRulesTableContainer')!;
    const tbody = document.getElementById('mhRulesTableBody')!;

    if (rules.length === 0) {
      noRules.style.display = 'block';
      tableContainer.style.display = 'none';
      return;
    }

    noRules.style.display = 'none';
    tableContainer.style.display = 'block';

    tbody.innerHTML = rules.map(rule => `
      <tr>
        <td>
          <label class="switch" style="transform: scale(0.7);">
            <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-rule-id="${rule.id}" class="mh-rule-toggle">
            <span class="switch-thumb"></span>
          </label>
        </td>
        <td class="truncate" style="max-width: 100px;" title="${escapeHtml(rule.urlPattern)}">${escapeHtml(rule.name)}</td>
        <td><code class="text-primary" style="font-size: 0.75rem;">${escapeHtml(rule.headerName)}</code></td>
        <td class="truncate text-muted" style="max-width: 80px;">${rule.operation === 'remove' ? '(removed)' : escapeHtml(rule.headerValue)}</td>
        <td><button class="btn btn-ghost btn-sm btn-icon mh-delete-rule" data-rule-id="${rule.id}">×</button></td>
      </tr>
    `).join('');

    // Bind toggle events
    tbody.querySelectorAll('.mh-rule-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const id = parseInt((e.target as HTMLInputElement).getAttribute('data-rule-id')!);
        const rule = rules.find(r => r.id === id);
        if (rule) {
          rule.enabled = (e.target as HTMLInputElement).checked;
          saveRules();
        }
      });
    });

    // Bind delete events
    tbody.querySelectorAll('.mh-delete-rule').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt((e.target as HTMLElement).getAttribute('data-rule-id')!);
        rules = rules.filter(r => r.id !== id);
        saveRules();
        renderRules();
        showToast('Rule deleted', 'warning');
      });
    });
  }

  // Add rule
  document.getElementById('mhAddRule')?.addEventListener('click', () => {
    const name = (document.getElementById('mhRuleName') as HTMLInputElement).value.trim();
    const urlPattern = (document.getElementById('mhUrlPattern') as HTMLInputElement).value.trim() || '*://*/*';
    const headerType = (document.getElementById('mhHeaderType') as HTMLSelectElement).value as 'request' | 'response';
    const operation = (document.getElementById('mhOperation') as HTMLSelectElement).value as 'set' | 'remove';
    const headerName = (document.getElementById('mhHeaderName') as HTMLInputElement).value.trim();
    const headerValue = (document.getElementById('mhHeaderValue') as HTMLInputElement).value;

    if (!headerName) {
      showToast('Header name is required', 'error');
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

    // Clear form
    (document.getElementById('mhRuleName') as HTMLInputElement).value = '';
    (document.getElementById('mhUrlPattern') as HTMLInputElement).value = '';
    (document.getElementById('mhHeaderName') as HTMLInputElement).value = '';
    (document.getElementById('mhHeaderValue') as HTMLInputElement).value = '';

    showToast('Rule added', 'success');
  });

  // Global toggle
  document.getElementById('modHeaderGlobalToggle')?.addEventListener('change', (e) => {
    globalEnabled = (e.target as HTMLInputElement).checked;
    saveRules();
    showToast(globalEnabled ? 'ModHeader enabled' : 'ModHeader disabled', 'info');
  });

  // Export
  document.getElementById('mhExport')?.addEventListener('click', () => {
    const data = JSON.stringify(rules, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'h4ck3r-modheader-rules.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Rules exported', 'success');
  });

  // Import
  document.getElementById('mhImportFile')?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        imported.forEach((rule: ModHeaderRuleLocal) => {
          rule.id = nextRuleId++;
          if (typeof rule.enabled === 'undefined') rule.enabled = true;
        });

        rules = rules.concat(imported);
        saveRules();
        renderRules();
        showToast(`Imported ${imported.length} rules`, 'success');
      } catch {
        showToast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
  });

  // Clear all
  document.getElementById('mhClearAll')?.addEventListener('click', () => {
    if (!confirm('Delete all ModHeader rules?')) return;
    rules = [];
    saveRules();
    renderRules();
    showToast('All rules cleared', 'success');
  });
}

// Render domain extractor
function renderDomainExtractor() {
  toolContent.innerHTML = `
    <div class="tool-panel" style="display: flex; flex-direction: column; gap: 12px; height: calc(100vh - 100px);">
      <p class="text-sm text-muted">
        Extract all domains from the current page (links, scripts, images, iframes).
      </p>
      <button class="btn btn-primary" id="extractDomains">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        Extract Domains
      </button>
      
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
        <textarea 
          class="input textarea" 
          id="domainsOutput" 
          readonly 
          placeholder="Domains will appear here..."
          style="flex: 1; resize: none; font-family: var(--font-mono); font-size: 12px;"
        ></textarea>
      </div>
      
      <button class="btn btn-secondary" id="copyDomains">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy to Clipboard
      </button>
    </div>
  `;

  document.getElementById('extractDomains')?.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id || !tab.url) {
        showToast('No active tab found', 'error');
        return;
      }

      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractDomains' });

      if (response?.domains) {
        const domains = response.domains as string[];
        (document.getElementById('domainsOutput') as HTMLTextAreaElement).value = domains.join('\n');
        showToast(`Found ${domains.length} domains`, 'success');
      } else {
        showToast('No response from page', 'error');
      }
    } catch (e) {
      showToast('Reload the page and try again', 'error');
    }
  });

  document.getElementById('copyDomains')?.addEventListener('click', () => {
    const output = (document.getElementById('domainsOutput') as HTMLTextAreaElement).value;
    copyToClipboard(output);
  });
}

// Render timestamp converter
function renderTimestampConverter() {
  toolContent.innerHTML = `
    <div class="tool-panel">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Timestamp Converter</span>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-2 gap-md">
            <div>
              <label class="text-sm text-muted">Unix Timestamp (seconds)</label>
              <input type="number" class="input" id="unixTimestamp" placeholder="1704067200">
              <button class="btn btn-primary w-full" id="convertToDate" style="margin-top: var(--spacing-sm);">Convert to Date →</button>
            </div>
            <div>
              <label class="text-sm text-muted">Human Readable Date</label>
              <input type="text" class="input" id="humanDate" placeholder="2024-01-01 00:00:00">
              <button class="btn btn-secondary w-full" id="convertToUnix" style="margin-top: var(--spacing-sm);">← Convert to Unix</button>
            </div>
          </div>
          
          <div style="margin-top: var(--spacing-lg); text-align: center;">
            <button class="btn btn-outline" id="useCurrentTime">Use Current Time</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('convertToDate')?.addEventListener('click', () => {
    const unix = parseInt((document.getElementById('unixTimestamp') as HTMLInputElement).value);
    if (!isNaN(unix)) {
      const date = new Date(unix * 1000);
      (document.getElementById('humanDate') as HTMLInputElement).value = date.toISOString().replace('T', ' ').slice(0, 19);
    }
  });

  document.getElementById('convertToUnix')?.addEventListener('click', () => {
    const dateStr = (document.getElementById('humanDate') as HTMLInputElement).value;
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      (document.getElementById('unixTimestamp') as HTMLInputElement).value = Math.floor(date.getTime() / 1000).toString();
    }
  });

  document.getElementById('useCurrentTime')?.addEventListener('click', () => {
    const now = Date.now();
    (document.getElementById('unixTimestamp') as HTMLInputElement).value = Math.floor(now / 1000).toString();
    (document.getElementById('humanDate') as HTMLInputElement).value = new Date(now).toISOString().replace('T', ' ').slice(0, 19);
  });
}

// Render Linux commands reference
function renderLinuxCommands() {
  const commands = {
    'System Info': [
      'cat /etc/issue',
      'cat /etc/*-release',
      'uname -a',
      'cat /proc/version',
      'hostname',
      'id',
      'whoami',
    ],
    'Network': [
      'ifconfig',
      'ip addr',
      'netstat -antup',
      'ss -tulpn',
      'cat /etc/resolv.conf',
      'iptables -L',
    ],
    'Users': [
      'cat /etc/passwd',
      'cat /etc/shadow',
      'cat /etc/group',
      'last',
      'w',
    ],
    'File Transfer': [
      'python3 -m http.server 8000',
      'python -m SimpleHTTPServer 8000',
      'wget http://IP/file',
      'curl -o file http://IP/file',
      'scp user@IP:/path/file .',
    ],
    'Privilege Escalation': [
      'sudo -l',
      'find / -perm -u=s -type f 2>/dev/null',
      'find / -perm -g=s -type f 2>/dev/null',
      'getcap -r / 2>/dev/null',
      'cat /etc/crontab',
    ],
  };

  const sectionsHtml = Object.entries(commands).map(([section, cmds]) => `
    <div class="card" style="margin-bottom: var(--spacing-md);">
      <div class="card-header">
        <span class="card-title">${section}</span>
      </div>
      <div class="card-content">
        <div class="table-container">
          <table class="table">
            <tbody>
              ${cmds.map(cmd => `
                <tr>
                  <td><code class="text-primary">${escapeHtml(cmd)}</code></td>
                  <td style="width: 60px;">
                    <button class="btn btn-ghost btn-sm btn-icon copy-payload" data-payload="${escapeHtml(cmd)}">📋</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `).join('');

  toolContent.innerHTML = `
    <div class="tool-panel" style="max-height: calc(100vh - 150px); overflow-y: auto;">
      ${sectionsHtml}
    </div>
  `;

  document.querySelectorAll('.copy-payload').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const payload = (e.target as HTMLElement).getAttribute('data-payload') || '';
      copyToClipboard(payload);
    });
  });
}

// Encoding handler
function handleEncode(toolId: string) {
  const input = (document.getElementById('inputText') as HTMLTextAreaElement).value;
  const output = document.getElementById('outputText') as HTMLTextAreaElement;
  if (!input) return;

  try {
    let result = '';

    switch (toolId) {
      case 'base64':
        result = btoa(unescape(encodeURIComponent(input)));
        break;
      case 'url':
        result = encodeURIComponent(input);
        break;
      case 'hex':
        result = Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        break;
      case 'html':
        result = input.replace(/[&<>"']/g, char => {
          const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
          return entities[char];
        });
        break;
      case 'hash':
        const hashType = (document.getElementById('hashType') as HTMLSelectElement)?.value || 'md5';
        switch (hashType) {
          case 'md5': result = CryptoJS.MD5(input).toString(); break;
          case 'sha1': result = CryptoJS.SHA1(input).toString(); break;
          case 'sha256': result = CryptoJS.SHA256(input).toString(); break;
          case 'sha512': result = CryptoJS.SHA512(input).toString(); break;
        }
        break;
      case 'json':
        result = JSON.stringify(JSON.parse(input), null, 2);
        break;
      default:
        result = input;
    }

    output.value = result;
    showToast('Encoded successfully', 'success');
  } catch (e) {
    showToast('Encoding failed: ' + (e as Error).message, 'error');
  }
}

// Decoding handler
function handleDecode(toolId: string) {
  const input = (document.getElementById('inputText') as HTMLTextAreaElement).value;
  const output = document.getElementById('outputText') as HTMLTextAreaElement;
  if (!input) return;

  try {
    let result = '';

    switch (toolId) {
      case 'base64':
        result = decodeURIComponent(escape(atob(input)));
        break;
      case 'url':
        result = decodeURIComponent(input);
        break;
      case 'hex':
        result = input.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
        break;
      case 'html':
        const textarea = document.createElement('textarea');
        textarea.innerHTML = input;
        result = textarea.value;
        break;
      case 'jwt':
        result = decodeJWT(input);
        break;
      default:
        result = input;
    }

    output.value = result;
    showToast('Decoded successfully', 'success');
  } catch (e) {
    showToast('Decoding failed: ' + (e as Error).message, 'error');
  }
}

// JWT Decoder
function decodeJWT(token: string): string {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const decodeBase64Url = (str: string) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) str += '='.repeat(4 - pad);
    return atob(str);
  };

  const header = JSON.parse(decodeBase64Url(parts[0]));
  const payload = JSON.parse(decodeBase64Url(parts[1]));

  return JSON.stringify({ header, payload }, null, 2);
}

// Clipboard helpers
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  } catch {
    showToast('Failed to copy', 'error');
  }
}


// Command Palette
function openCommandPalette() {
  commandPalette.classList.add('open');
  commandSearch.value = '';
  commandSearch.focus();
  filterCommands();
}

function closeCommandPalette() {
  commandPalette.classList.remove('open');
}

function populateCommandPalette() {
  commandList.innerHTML = tools.map(tool => `
    <div class="command-item" data-tool="${tool.id}">
      <span class="command-item-title">${tool.title}</span>
      <span class="badge badge-secondary">${tool.category}</span>
      ${tool.shortcut ? `<span class="command-item-shortcut">${tool.shortcut}</span>` : ''}
    </div>
  `).join('');

  commandList.querySelectorAll('.command-item').forEach(item => {
    item.addEventListener('click', () => {
      const tool = item.getAttribute('data-tool');
      if (tool) {
        loadTool(tool);
        closeCommandPalette();
      }
    });
  });
}

function filterCommands() {
  const query = commandSearch.value.toLowerCase();
  commandList.querySelectorAll('.command-item').forEach(item => {
    const title = item.querySelector('.command-item-title')?.textContent?.toLowerCase() || '';
    (item as HTMLElement).style.display = title.includes(query) ? 'flex' : 'none';
  });
}

// Keyboard shortcuts
function handleKeyboard(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    commandPalette.classList.contains('open') ? closeCommandPalette() : openCommandPalette();
  }

  if (e.key === 'Escape') {
    closeCommandPalette();
  }

  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
    e.preventDefault();
    handleEncode(currentTool);
  }

  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
    e.preventDefault();
    handleDecode(currentTool);
  }
}

// Toast notifications
function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render Settings panel (integrated into sidebar)
function renderSettings() {
  toolContent.innerHTML = `
    <div class="tool-panel">
      <!-- Toolbar Settings -->
      <div class="card" style="margin-bottom: var(--spacing-md);">
        <div class="card-header">
          <span class="card-title">Toolbar Settings</span>
          <span class="text-muted text-sm">Configure the floating toolbar on pages</span>
        </div>
        <div class="card-content">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm">Show Toolbar on Pages</div>
              <div class="text-xs text-muted">Display floating toolbar on websites (reload pages after changing)</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="toolbarEnabled" checked>
              <span class="switch-thumb"></span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- ModHeader Settings -->
      <div class="card" style="margin-bottom: var(--spacing-md);">
        <div class="card-header">
          <span class="card-title">ModHeader</span>
          <span class="text-muted text-sm">HTTP header modification rules</span>
        </div>
        <div class="card-content">
          <div class="flex gap-sm" style="flex-wrap: wrap;">
            <button class="btn btn-primary" id="openModHeaderConfig">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/>
              </svg>
              Configure Rules
            </button>
            <button class="btn btn-outline" id="exportModHeaderRules">Export Rules</button>
            <button class="btn btn-destructive" id="clearModHeaderRules">Clear All Rules</button>
          </div>
          <div id="modHeaderStats" class="text-sm text-muted" style="margin-top: var(--spacing-md);"></div>
        </div>
      </div>
      
      <!-- Keyboard Shortcuts -->
      <div class="card" style="margin-bottom: var(--spacing-md);">
        <div class="card-header">
          <span class="card-title">Keyboard Shortcuts</span>
        </div>
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <tbody>
                <tr>
                  <td><code>⌘K</code> / <code>Ctrl+K</code></td>
                  <td>Open command palette</td>
                </tr>
                <tr>
                  <td><code>⌘⇧E</code> / <code>Ctrl+Shift+E</code></td>
                  <td>Encode current input</td>
                </tr>
                <tr>
                  <td><code>⌘⇧D</code> / <code>Ctrl+Shift+D</code></td>
                  <td>Decode current input</td>
                </tr>
                <tr>
                  <td><code>Escape</code></td>
                  <td>Close command palette</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- About -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">About h4ck3r</span>
        </div>
        <div class="card-content">
          <div class="flex items-center gap-md" style="margin-bottom: var(--spacing-md);">
            <div class="text-2xl text-primary">&lt;/&gt;</div>
            <div>
              <div class="text-lg">h4ck3r</div>
              <div class="text-sm text-muted">v0.2.0</div>
            </div>
          </div>
          <p class="text-muted" style="margin-bottom: var(--spacing-md);">
            All in one Red Team Developer Tool Kit. Encoding, hashing, payloads, reverse shells, and more.
          </p>
          <div class="flex gap-sm">
            <a href="https://github.com/4nkitd/h4ck3r" target="_blank" class="btn btn-outline btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://github.com/4nkitd/h4ck3r/issues" target="_blank" class="btn btn-ghost btn-sm">Report Issue</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Load saved settings
  loadSettingsState();
  loadModHeaderStats();

  // Bind events
  document.getElementById('toolbarEnabled')?.addEventListener('change', saveSettingsState);

  document.getElementById('openModHeaderConfig')?.addEventListener('click', () => {
    loadTool('modheader');
  });

  document.getElementById('exportModHeaderRules')?.addEventListener('click', exportModHeaderRules);
  document.getElementById('clearModHeaderRules')?.addEventListener('click', clearModHeaderRules);
}

async function loadSettingsState() {
  try {
    const result = await chrome.storage.local.get(['toolbarEnabled']);
    const toolbarEnabled = result.toolbarEnabled !== false;

    const el = document.getElementById('toolbarEnabled') as HTMLInputElement;
    if (el) el.checked = toolbarEnabled;
  } catch {
    // Default to enabled
  }
}

async function saveSettingsState() {
  const toolbarEnabled = (document.getElementById('toolbarEnabled') as HTMLInputElement)?.checked ?? true;

  await chrome.storage.local.set({ toolbarEnabled });

  showToast(toolbarEnabled ? 'Toolbar enabled' : 'Toolbar disabled (reload pages)', 'success');
}

async function loadModHeaderStats() {
  try {
    const result = await chrome.storage.local.get(['modHeaderRules', 'modHeaderEnabled']);
    const rules = (result.modHeaderRules as ModHeaderRuleLocal[]) || [];
    const enabled = result.modHeaderEnabled !== false;
    const activeRules = rules.filter((r: ModHeaderRuleLocal) => r.enabled).length;

    const statsDiv = document.getElementById('modHeaderStats');
    if (statsDiv) {
      statsDiv.innerHTML = `
        <span class="badge ${enabled ? 'badge-success' : 'badge-secondary'}">${enabled ? 'Enabled' : 'Disabled'}</span>
        <span style="margin-left: var(--spacing-sm);">${rules.length} rules (${activeRules} active)</span>
      `;
    }
  } catch {
    // Ignore errors
  }
}

async function exportModHeaderRules() {
  try {
    const result = await chrome.storage.local.get(['modHeaderRules']);
    const rules = result.modHeaderRules || [];
    const data = JSON.stringify(rules, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'h4ck3r-modheader-rules.json';
    a.click();

    URL.revokeObjectURL(url);
    showToast('Rules exported', 'success');
  } catch {
    showToast('Failed to export rules', 'error');
  }
}

async function clearModHeaderRules() {
  if (!confirm('Are you sure you want to delete all ModHeader rules?')) return;

  try {
    await chrome.storage.local.remove(['modHeaderRules', 'modHeaderNextId']);
    chrome.runtime.sendMessage({ action: 'updateModHeaderRules', rules: [], enabled: true });
    loadModHeaderStats();
    showToast('All rules cleared', 'success');
  } catch {
    showToast('Failed to clear rules', 'error');
  }
}

// Export for global access
(window as any).h4ck3r = { loadTool, showToast, copyToClipboard };

