// ModHeader JavaScript - Manages HTTP header modification rules

$(function () {
    let rules = [];
    let globalEnabled = true;
    let nextRuleId = 1;

    // Initialize
    loadRules();

    // Event Listeners
    $('#addRuleBtn').on('click', addRule);
    $('#globalToggle').on('change', toggleGlobalEnabled);
    $('#exportBtn').on('click', exportRules);
    $('#importFile').on('change', importRules);

    // Load rules from storage
    function loadRules() {
        chrome.storage.local.get(['modHeaderRules', 'modHeaderEnabled', 'modHeaderNextId'], (result) => {
            rules = result.modHeaderRules || [];
            globalEnabled = result.modHeaderEnabled !== false;
            nextRuleId = result.modHeaderNextId || 1;

            $('#globalToggle').prop('checked', globalEnabled);
            renderRulesTable();
            applyRules();
        });
    }

    // Save rules to storage
    function saveRules() {
        chrome.storage.local.set({
            modHeaderRules: rules,
            modHeaderEnabled: globalEnabled,
            modHeaderNextId: nextRuleId
        }, () => {
            applyRules();
        });
    }

    // Add a new rule
    function addRule() {
        const name = $('#ruleName').val().trim();
        const urlPattern = $('#urlPattern').val().trim() || '*://*/*';
        const headerType = $('#headerType').val();
        const operation = $('#operation').val();
        const headerName = $('#headerName').val().trim();
        const headerValue = $('#headerValue').val();

        if (!headerName) {
            showStatus('Header name is required', 'danger');
            return;
        }

        if (operation === 'set' && !headerValue) {
            showStatus('Header value is required for "Set" operation', 'danger');
            return;
        }

        const rule = {
            id: nextRuleId++,
            enabled: true,
            name: name || `Rule ${rules.length + 1}`,
            urlPattern: urlPattern,
            headerType: headerType,
            operation: operation,
            headerName: headerName,
            headerValue: headerValue
        };

        rules.push(rule);
        saveRules();
        renderRulesTable();
        clearForm();
        showStatus('Rule added successfully', 'success');
    }

    // Clear the add rule form
    function clearForm() {
        $('#ruleName').val('');
        $('#urlPattern').val('');
        $('#headerName').val('');
        $('#headerValue').val('');
        $('#headerType').val('request');
        $('#operation').val('set');
    }

    // Render rules table
    function renderRulesTable() {
        const tbody = $('#rulesTableBody');
        tbody.empty();

        if (rules.length === 0) {
            $('#noRulesMessage').show();
            $('table').hide();
            return;
        }

        $('#noRulesMessage').hide();
        $('table').show();

        rules.forEach((rule) => {
            const row = $(`
                <tr data-rule-id="${rule.id}">
                    <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input rule-toggle" type="checkbox" 
                                   ${rule.enabled ? 'checked' : ''} data-rule-id="${rule.id}">
                        </div>
                    </td>
                    <td>${escapeHtml(rule.name)}</td>
                    <td><code class="text-warning">${escapeHtml(rule.urlPattern)}</code></td>
                    <td>
                        <span class="badge ${rule.headerType === 'request' ? 'badge-request' : 'badge-response'}">
                            ${rule.headerType}
                        </span>
                    </td>
                    <td><code class="text-info">${escapeHtml(rule.headerName)}</code></td>
                    <td class="header-value" title="${escapeHtml(rule.headerValue)}">
                        ${rule.operation === 'remove' ? '<em class="text-muted">(removed)</em>' : escapeHtml(rule.headerValue)}
                    </td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm action-btn delete-rule" 
                                data-rule-id="${rule.id}" title="Delete">
                            ✕
                        </button>
                    </td>
                </tr>
            `);
            tbody.append(row);
        });

        // Bind toggle events
        $('.rule-toggle').on('change', function () {
            const ruleId = $(this).data('rule-id');
            toggleRule(ruleId);
        });

        // Bind delete events
        $('.delete-rule').on('click', function () {
            const ruleId = $(this).data('rule-id');
            deleteRule(ruleId);
        });
    }

    // Toggle individual rule
    function toggleRule(ruleId) {
        const rule = rules.find(r => r.id === ruleId);
        if (rule) {
            rule.enabled = !rule.enabled;
            saveRules();
        }
    }

    // Delete a rule
    function deleteRule(ruleId) {
        rules = rules.filter(r => r.id !== ruleId);
        saveRules();
        renderRulesTable();
        showStatus('Rule deleted', 'warning');
    }

    // Toggle global enabled state
    function toggleGlobalEnabled() {
        globalEnabled = $('#globalToggle').is(':checked');
        saveRules();
        showStatus(globalEnabled ? 'ModHeader enabled' : 'ModHeader disabled', 'info');
    }

    // Apply rules using declarativeNetRequest
    function applyRules() {
        // Send message to background script to update rules
        chrome.runtime.sendMessage({
            action: 'updateModHeaderRules',
            rules: rules,
            enabled: globalEnabled
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error applying rules:', chrome.runtime.lastError);
            }
        });
    }

    // Export rules as JSON
    function exportRules() {
        const data = JSON.stringify(rules, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'h4ck3r-modheader-rules.json';
        a.click();

        URL.revokeObjectURL(url);
        showStatus('Rules exported successfully', 'success');
    }

    // Import rules from JSON file
    function importRules(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const importedRules = JSON.parse(event.target.result);
                if (!Array.isArray(importedRules)) {
                    throw new Error('Invalid format');
                }

                // Reassign IDs to avoid conflicts
                importedRules.forEach(rule => {
                    rule.id = nextRuleId++;
                    if (typeof rule.enabled === 'undefined') rule.enabled = true;
                });

                rules = rules.concat(importedRules);
                saveRules();
                renderRulesTable();
                showStatus(`Imported ${importedRules.length} rules`, 'success');
            } catch (err) {
                showStatus('Invalid JSON file', 'danger');
            }
        };
        reader.readAsText(file);

        // Reset file input
        $(e.target).val('');
    }

    // Show status message
    function showStatus(message, type) {
        const statusEl = $('#statusMessage');
        statusEl.removeClass('alert-success alert-danger alert-warning alert-info')
            .addClass(`alert-${type}`)
            .text(message)
            .fadeIn();

        setTimeout(() => {
            statusEl.fadeOut();
        }, 3000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
