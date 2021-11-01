'use strict';

chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: 'https://4nkitd.github.com/h4ck3r'
        });
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log({ request });

        sendResponse(true);
        return true;
    }
);