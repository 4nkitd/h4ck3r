var web;

if (typeof browser !== 'undefined') {
    web = browser;
}

if (typeof chrome !== 'undefined') {
    web = chrome;
}

const github = "https://github.com/4nkitd/h4ck3r";

setTimeout(() => {
    web.runtime?.onMessage.addListener(
        function (request, sender, sendResponse) {
    
            if (request.message === "formFill") {
                fillForm();
    
            }
    
            if (request.message === "devTools") {
                triggerDevtoolsWindow();
            }
    
            if (request.message === "clearForm") {
                cleanForm();
            }
    
            if (request.message === "clearCache") {
    
                removeCache();
    
            }
    
            if (request.message === "reload") {
    
                reload();
    
            }
    
            sendResponse(true);
            return true;
        }
    );
}, 300);

setInterval(() => {

    const result = localStorage.getItem('reload')
    
    if (result) {

        console.log('cron-3000');

        setTimeout(() => {
            window.location.reload();
        }, result);
    }

},9000);


function reload() {
    console.log("reloading");
    const result = localStorage.getItem('reload')
    if (result) {
        return localStorage.removeItem('reload');
    } else {
        return localStorage.setItem('reload', 3000);
    }

}

function openTab() {
    window.open(url, '_blank').focus();
}

function fillForm() {
    fillInput();
    fillTextarea();
    selectOption();
    fillRadio();
    fillCheckbox();
}

function cleanForm() {
    cleanInput();
}

function cleanInput() {
    $("input").each((index, elm) => {
        $(elm).val("");
    });
}

function fillRadio() {
    $("input[type='radio']").each((index, elm) => {
        $(elm).prop("checked", true);
    });
}

function fillCheckbox() {
    $("input[type='checkbox']").each((index, elm) => {
        $(elm).prop("checked", true);
    });
}

function selectOption() {
    $("select").each((index, elm) => {
        $($(elm).find('option')[0]).prop('selected', true);
    });
}

function fillTextarea() {
    $("textarea").each((index, elm) => {
        $(elm).val(faker.lorem.paragraph());
    });
}

function fillInput() {
    $("input").each((index, elm) => {

        const type = $(elm).attr('type');

        switch (type) {
            case 'button':
                break;
            case 'checkbox':
                $(elm).val(true);
                break;
            case 'color':
                $(elm).val(faker.internet.color());
                break;
            case 'date':
                $(elm).val(faker.date.past().toLocaleDateString("en-US"));
                break;
            case 'datetime-local':
                $(elm).val(faker.date.recent())
                break;
            case 'email':
                $(elm).val(getEmail());
                break;
            case 'file':
                break;
            case 'hidden':
                break;
            case 'image':
                break;
            case 'month':
                $(elm).val(faker.date.month());
                break;
            case 'number':
                $(elm).val(faker.datatype.number());
                break;
            case 'password':
                $(elm).val('#Pass@123');
                break;
            case 'radio':
                $(elm).prop("checked", true);
                break;
            case 'range':
                $(elm).val(faker.datatype.number())
                break;
            case 'reset':
                break;
            case 'search':
                $(elm).val(faker.lorem.word());
                break;
            case 'submit':
                break;
            case 'tel':
                $(elm).val(faker.phone.phoneNumber());
                break;
            case 'text':
                autoDetect(elm)
                break;
            case 'time':
                $(elm).val(faker.time.recent());
                break;
            case 'url':
                $(elm).val(faker.internet.url());
                break;
            case 'week':
                $(elm).val(faker.date.weekday());
                break;
            default:
                autoDetect(elm)
                break;
        }

    });
}

function autoDetect(elm) {
    $(elm).val(faker.lorem.word());
}

function getEmail() {
    return faker.lorem.slug() + "@yopmail.com";
}

function removeCache() {

    localStorage.clear();
    sessionStorage.clear();

    // clear cookies
    deleteAllCookies();

    // clear cache
    window.location.reload(true);

}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function triggerDevtoolsWindow() {
    console.log("opening devtools");
}

function simulateKeyPress(character) {
    jQuery.event.trigger({
        type: 'keypress',
        which: character.charCodeAt(0)
    });
}