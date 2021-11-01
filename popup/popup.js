const githubUrl = "https://4nkitd.github.io/h4ck3r/";

function sendMsg(message) {
    return function() {

        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            var activeTab = tabs[0];
            console.log({ message });
            chrome.tabs.sendMessage(activeTab.id, { "message": message });
        });

    };
}

function formFill() {

    sendMsg("formFill")();

}

function github() {
    chrome.tabs.create({ url: githubUrl, active: true });
}

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("formFill").addEventListener("click", sendMsg("formFill"));
    document.getElementById("devTools").addEventListener("click", sendMsg("devTools"));
    document.getElementById("github").addEventListener("click", github);

    document.getElementById("clearForm").addEventListener("click", sendMsg("clearForm"));
    document.getElementById("clearCache").addEventListener("click", sendMsg("clearCache"));
    document.getElementById("reload").addEventListener("click", sendMsg("reload"));
});