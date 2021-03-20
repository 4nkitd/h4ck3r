
$(function() {
    
    $('.tab_btn').on('click',(elem)=>{
        

        var data_id = $(elem.target).data('id');
        $('.tab-content').hide();
        $('#'+data_id).show();

        $('.active').removeClass('active')

        $(elem.target).addClass('active');

    });

    $('.rest_tab_btn').on('click', (elem) => {


        var data_id = $(elem.target).data('id');
        $('.rest_tab_btn-content').hide();
        $('#' + data_id).show();

        
    });
  
    
});

function copyToClipboard(elem) {
    let $temp = $('<input>');
    $('body').append($temp);
    let val = $(elem).val();
    $temp.val(val).select();
    document.execCommand('copy');
    $temp.remove();
}

function encoding_en() {
    var action = $('input[name=encoding_type]:checked').val();

    switch (action) {
        case "hex": {

            var dec_text = $('#encoding_data').val();
            $('#encoding_data').val(String2Hex(utf8.encode(dec_text)));

        }
            break;

        case "base64": {

            var dec_text = $('#encoding_data').val();
            console.log({dec_text})
            $('#encoding_data').val(window.btoa(dec_text));

        }
            break;

        case "url": {

            var dec_text = $('#encoding_data').val();
            $('#encoding_data').val(window.encodeURI(dec_text));

        }
            break;

        case "MD5": {

            var dec_text = $('#encoding_data').val();
            $('#encoding_data').val(CryptoJS.MD5(dec_text));

        }
            break;

        default:
            alert('Please Create a issue to add a new type @ github.com/4nkitd/h4ck3r');
            break;
    }

}

function encoding_de() {
    var action = $('input[name=encoding_type]:checked').val();

    switch (action) {
        case "hex": {

            var dec_text = $('#encoding_data').val();
            $('#encoding_data').val(hex2a((dec_text)));

        }
            break;

        case "base64": {

            var dec_text = $('#encoding_data').val();
            console.log({ dec_text })
            $('#encoding_data').val(window.atob(dec_text));

        }
            break;

        case "url": {

            var dec_text = $('#encoding_data').val();
            $('#encoding_data').val(window.decodeURI(dec_text));

        }
            break;

        case "MD5": {

            alert('Can only be done using a brute force rainbow comparison')

        }
            break;

        default:
            alert('Please Create a issue to add a new type @ github.com/4nkitd/h4ck3r');
            break;
    }

}

function decrypt_aes() {

    var aes_data = $('#aes_data').val();
    var aes_key = $('#aes_key').val();

    var enc_res = CryptoJS.AES.decrypt(aes_data, aes_key);
    $('#aes_data').val((enc_res));


}

function encrypt_aes() {

    var aes_data = $('#aes_data').val();
    var aes_key = $('#aes_key').val();

    var enc_res = CryptoJS.AES.encrypt(aes_data, aes_key);
    $('#aes_data').val((enc_res));

}

function copy_aes(e) {

    $(e).html('Copied');
    copyToClipboard($('#aes_data'));
    setTimeout(() => {
        $(e).html('Copy');
    }, 300);
}

function copy_encoding(e) {

    $(e).html('Copied');
    copyToClipboard($('#encoding_data'));
    setTimeout(()=>{
        $(e).html('Copy');
    }, 300);
}

function run_terminal() {

    var code = $('#code').val();
    
    var results = '';

    try {
        
        var F = new Function(code);
        results = F();
        
    } catch (error) {
        results = error;
    }
    
    $('#code_results').val(results);

}

function copy_code(e) {

    $(e).html('Copied');
    copyToClipboard($('#code'));
    setTimeout(() => {
        $(e).html('Copy');
    }, 300);
}

async function send_rest_api_request() {

    try {



        var req_type = $('#rest_type').val() ?? 'POST';

        console.log({ req_type});
        var req_headers = $('#rest_headers').val() ?? {};
        req_headers = JSON.parse(req_headers.replace("'", '"').trim());

        var data = $('#rest_body').val() ?? {};
        data = JSON.stringify(JSON.parse(data.replace("'", '"').trim()));
        var url = $('#rest_url').val();

        var options = {
            method: req_type,
            cache: 'no-cache',
            headers: req_headers,
            body: data
        };

        console.log({ options});

        fetch(url,options).then(async(resp) => {

            var data = await resp.text();
            console.log({data});
            $('#rest_response').val(JSON.stringify(data) ?? data);

        }).catch((err) => {

            $('#rest_response').val(JSON.stringify(err) ?? err);

        })
        
    } catch (error) {

        $('#rest_response').val(JSON.stringify(error) ?? error);

    }


}

function copy_rest_response(e) {

    $(e).html('Copied');
    copyToClipboard($('#rest_response'));
    setTimeout(() => {
        $(e).html('Copy');
    }, 300);
}


function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function json_beautify() {
    
    var enc_text = $('#json_data').val();
    try {
        var j_obj = JSON.parse(enc_text.replace('\\', '').replace("'", '"'));
    } catch (error) {
        $('#json_results').val('Invalid Json String.');
        return;
    }
    var str = JSON.stringify(j_obj, undefined, 4);
    $('#json_results').html(syntaxHighlight(str));

}

function copy_json(e) {
    $(e).html('Copied');
    copyToClipboard($('#json_data'));
    setTimeout(() => {
        $(e).html('Copy');
    }, 300);
}