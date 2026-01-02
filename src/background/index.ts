// h4ck3r Background Service Worker

// Types
interface ModHeaderRule {
    id: number;
    enabled: boolean;
    name: string;
    urlPattern: string;
    headerType: 'request' | 'response';
    operation: 'set' | 'remove';
    headerName: string;
    headerValue: string;
}

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
    console.log('h4ck3r extension installed');
    loadModHeaderRules();
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
    loadModHeaderRules();
});

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        chrome.sidePanel.open({ tabId: tab.id });
    }
});

// Message handler
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    switch (message.action) {
        case 'log':
            console.log('Background Log:', message.data);
            sendResponse({ status: 'logged' });
            break;

        case 'updateModHeaderRules':
            updateModHeaderRules(message.rules, message.enabled)
                .then(() => sendResponse({ status: 'success' }))
                .catch((error: Error) => sendResponse({ status: 'error', error: error.message }));
            return true; // Keep channel open for async

        case 'getModHeaderRules':
            chrome.storage.local.get(['modHeaderRules', 'modHeaderEnabled'], (result) => {
                sendResponse({
                    rules: result.modHeaderRules || [],
                    enabled: result.modHeaderEnabled !== false,
                });
            });
            return true;

        default:
            sendResponse({ status: 'unknown action' });
    }
});

// Load ModHeader rules from storage
async function loadModHeaderRules() {
    try {
        const result = await chrome.storage.local.get(['modHeaderRules', 'modHeaderEnabled']);
        const rules: ModHeaderRule[] = Array.isArray(result.modHeaderRules) ? result.modHeaderRules : [];
        const enabled = result.modHeaderEnabled !== false;
        await updateModHeaderRules(rules, enabled);
    } catch (error) {
        console.error('Error loading ModHeader rules:', error);
    }
}

// Update declarativeNetRequest rules
async function updateModHeaderRules(rules: ModHeaderRule[], enabled: boolean): Promise<void> {
    try {
        // Get existing dynamic rules
        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        const existingRuleIds = existingRules.map(rule => rule.id);

        // Build new rules
        const newRules: chrome.declarativeNetRequest.Rule[] = [];

        if (enabled && rules?.length > 0) {
            rules.forEach((rule) => {
                if (!rule.enabled) return;

                const urlFilter = convertToUrlFilter(rule.urlPattern);

                let action: chrome.declarativeNetRequest.RuleAction;

                if (rule.headerType === 'request') {
                    action = {
                        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                        requestHeaders: [{
                            header: rule.headerName,
                            operation: rule.operation === 'set'
                                ? chrome.declarativeNetRequest.HeaderOperation.SET
                                : chrome.declarativeNetRequest.HeaderOperation.REMOVE,
                            ...(rule.operation === 'set' && { value: rule.headerValue }),
                        }],
                    };
                } else {
                    action = {
                        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                        responseHeaders: [{
                            header: rule.headerName,
                            operation: rule.operation === 'set'
                                ? chrome.declarativeNetRequest.HeaderOperation.SET
                                : chrome.declarativeNetRequest.HeaderOperation.REMOVE,
                            ...(rule.operation === 'set' && { value: rule.headerValue }),
                        }],
                    };
                }

                newRules.push({
                    id: rule.id,
                    priority: 1,
                    action,
                    condition: {
                        urlFilter,
                        resourceTypes: [
                            chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
                            chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
                            chrome.declarativeNetRequest.ResourceType.STYLESHEET,
                            chrome.declarativeNetRequest.ResourceType.SCRIPT,
                            chrome.declarativeNetRequest.ResourceType.IMAGE,
                            chrome.declarativeNetRequest.ResourceType.FONT,
                            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
                            chrome.declarativeNetRequest.ResourceType.PING,
                            chrome.declarativeNetRequest.ResourceType.MEDIA,
                            chrome.declarativeNetRequest.ResourceType.WEBSOCKET,
                            chrome.declarativeNetRequest.ResourceType.OTHER,
                        ],
                    },
                });
            });
        }

        // Update rules
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds,
            addRules: newRules,
        });

        console.log(`ModHeader: Applied ${newRules.length} rules`);
    } catch (error) {
        console.error('Error updating declarativeNetRequest rules:', error);
        throw error;
    }
}

// Convert URL pattern to declarativeNetRequest urlFilter
function convertToUrlFilter(pattern: string): string {
    if (!pattern) return '*';

    if (pattern === '*://*/*' || pattern === '*/*/*') {
        return '*';
    }

    return pattern.replace(/^\*:\/\//, '*');
}
