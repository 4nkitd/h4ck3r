chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "start") {
            start();
        } else if (request.message === "fillForm") {
            fillForm();
        }
    }
);

function start() {
    alert("started");
}

function fillForm() {
    var randomName = faker.name.findName(); // Caitlyn Kerluke
    var randomEmail = faker.internet.email(); // Rusty@arne.info
    var randomCard = faker.helpers.createCard();

    console.log({
        randomName,
        randomEmail,
        randomCard,
    })
}