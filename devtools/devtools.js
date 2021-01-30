navigator.userAgent.indexOf('Firefox') != -1 &&
	browser.devtools.panels.create('h4ck3r', 'get_started16.png', 'index.html');

navigator.userAgent.indexOf('Chrome') != -1 &&
	chrome.devtools.panels.create(
		'h4ck3r', // title for the panel tab
		"./../assets/icon.png", //   path to an icon
		'index.html', // html page which is gonna be injecting into the tab's content
		null // callback function here
	);