// ModHeader functionality using declarativeNetRequest

export interface ModHeaderRule {
    id: number;
    enabled: boolean;
    name: string;
    urlPattern: string;
    headerType: 'request' | 'response';
    operation: 'set' | 'remove';
    headerName: string;
    headerValue: string;
}

// Update declarativeNetRequest rules
export async function updateModHeaderRules(rules: ModHeaderRule[], enabled: boolean): Promise<void> {
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

    // Handle common patterns
    if (pattern === '*://*/*' || pattern === '*/*/*') {
        return '*';
    }

    // Remove protocol prefix for simpler matching
    return pattern.replace(/^\*:\/\//, '*');
}
