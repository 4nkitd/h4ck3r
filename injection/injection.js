chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "start") {
            start();
        }
    }
);

function start() {
    alert("started");
}