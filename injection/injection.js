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

setTimeout(() => {
    fillForm()
})

function input() {
    $("input").each(() => {
        const type = $(this).attr('type');

        switch (type) {
            case 'button':
                break;
            case 'checkbox':
                $(this).val(true);
                break;
            case 'color':
                $(this).val(faker.internet.color());
                break;
            case 'date':
                $(this).val(faker.date.past());
                break;
            case 'datetime-local':
                $(this).val(faker.date.recent())
                break;
            case 'email':
                $(this).val(getEmail());
                break;
            case 'file':
                break;
            case 'hidden':
                break;
            case 'image':
                break;
            case 'month':
                $(this).val(faker.date.month());
                break;
            case 'number':
                $(this).val(faker.number.random());
                break;
            case 'password':
                $(this).val('#Pass@123');
                break;
            case 'radio':
                $(this).prop("checked", true);
                break;
            case 'range':
                break;
            case 'reset':
                break;
            case 'search':
                $(this).val(faker.lorem.word());
                break;
            case 'submit':
                break;
            case 'tel':
                $(this).val(faker.phone.phoneNumber());
                break;
            case 'text':
                $(this).val(faker.lorem.word());
                break;
            case 'time':
                $(this).val(faker.time.recent());
                break;
            case 'url':
                $(this).val(faker.internet.url());
                break;
            case 'week':
                $(this).val(faker.date.weekday());
                break;
            default:
                break;
        }

    });
}

function getEmail() {
    return faker.lorem.slug() + "@yopmail.com";
}