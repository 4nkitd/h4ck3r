navigator.userAgent.indexOf('Firefox') != -1 &&
    browser.devtools.panels.create('h4ck3r', '/assets/icons/icon.png', '../main/main.html');

navigator.userAgent.indexOf('Chrome') != -1 &&
    chrome.devtools.panels.create(
        'h4ck3r', // title for the panel tab
        "/assets/icons/icon.png", //   path to an icon
        '../main/main.html', // html page which is gonna be injecting into the tab's content
        null // callback function here
    );