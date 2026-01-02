// background.js - Service Worker for Manifest V3

// Listener for runtime messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "log") {
    console.log("Background Log:", message.data);
    sendResponse({ status: "logged" });
  }

  if (message.action === "updateModHeaderRules") {
    updateDeclarativeNetRequestRules(message.rules, message.enabled)
      .then(() => sendResponse({ status: "success" }))
      .catch((error) => sendResponse({ status: "error", error: error.message }));
    return true; // Keep message channel open for async response
  }
});

// Initialize rules on extension install/update
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background service worker initialized.");
  // Load and apply any saved ModHeader rules
  loadAndApplyModHeaderRules();
});

// Also load rules when service worker starts
chrome.runtime.onStartup.addListener(() => {
  loadAndApplyModHeaderRules();
});

// Load and apply ModHeader rules from storage
async function loadAndApplyModHeaderRules() {
  try {
    const result = await chrome.storage.local.get(['modHeaderRules', 'modHeaderEnabled']);
    const rules = result.modHeaderRules || [];
    const enabled = result.modHeaderEnabled !== false;
    await updateDeclarativeNetRequestRules(rules, enabled);
  } catch (error) {
    console.error("Error loading ModHeader rules:", error);
  }
}

// Update declarativeNetRequest rules
async function updateDeclarativeNetRequestRules(rules, enabled) {
  try {
    // Get existing dynamic rules to remove them
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    // Build new rules
    const newRules = [];

    if (enabled && rules && rules.length > 0) {
      rules.forEach((rule, index) => {
        if (!rule.enabled) return;

        // Create rule ID (DNR requires positive integers)
        const ruleId = rule.id || (index + 1);

        // Convert URL pattern to match pattern
        const urlFilter = convertToUrlFilter(rule.urlPattern);

        // Build the rule action based on header type and operation
        let action;

        if (rule.headerType === 'request') {
          if (rule.operation === 'set') {
            action = {
              type: 'modifyHeaders',
              requestHeaders: [{
                header: rule.headerName,
                operation: 'set',
                value: rule.headerValue
              }]
            };
          } else if (rule.operation === 'remove') {
            action = {
              type: 'modifyHeaders',
              requestHeaders: [{
                header: rule.headerName,
                operation: 'remove'
              }]
            };
          }
        } else if (rule.headerType === 'response') {
          if (rule.operation === 'set') {
            action = {
              type: 'modifyHeaders',
              responseHeaders: [{
                header: rule.headerName,
                operation: 'set',
                value: rule.headerValue
              }]
            };
          } else if (rule.operation === 'remove') {
            action = {
              type: 'modifyHeaders',
              responseHeaders: [{
                header: rule.headerName,
                operation: 'remove'
              }]
            };
          }
        }

        if (action) {
          newRules.push({
            id: ruleId,
            priority: 1,
            action: action,
            condition: {
              urlFilter: urlFilter,
              resourceTypes: [
                'main_frame', 'sub_frame', 'stylesheet', 'script',
                'image', 'font', 'object', 'xmlhttprequest', 'ping',
                'media', 'websocket', 'webtransport', 'webbundle', 'other'
              ]
            }
          });
        }
      });
    }

    // Update rules (remove old, add new)
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds,
      addRules: newRules
    });

    console.log(`ModHeader: Applied ${newRules.length} rules`);
    return { success: true, rulesApplied: newRules.length };

  } catch (error) {
    console.error("Error updating declarativeNetRequest rules:", error);
    throw error;
  }
}

// Convert user-friendly URL pattern to declarativeNetRequest urlFilter
function convertToUrlFilter(pattern) {
  if (!pattern) return '*';

  // If pattern is already a simple wildcard pattern, return as-is
  // declarativeNetRequest uses a different syntax than match patterns
  // * matches any characters, | anchors to start/end

  let urlFilter = pattern;

  // Replace *:// with just * for protocol matching
  urlFilter = urlFilter.replace(/^\*:\/\//, '*');

  // Handle common patterns
  // *://*/* -> match everything
  if (urlFilter === '*/*/*' || urlFilter === '*://*/*') {
    return '*';
  }

  return urlFilter;
}