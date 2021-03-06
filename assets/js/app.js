

$(function() {
    
    $('.tab_btn').on('click',(elem)=>{
        

        var data_id = $(elem.target).data('id');
        $('.bg-tab-content').hide();
        $('#'+data_id).show();

        $('.active_tab').removeClass('active_tab')

        $(elem.target).addClass('active_tab');

    });

    $('.base64_encode').on('click',(elem)=>{
        var dec_text = $('#base64_data').val();        
        $('#base64_data').val(window.btoa(dec_text));
        copy_result_if_asked($('#base64_data'));
    })

    $('.base64_decode').on('click',(elem)=>{
        var enc_text = $('#base64_data').val();        
        $('#base64_data').val(window.atob(enc_text));
        copy_result_if_asked($('#base64_data'));

    })

    $('.url_encode').on('click',(elem)=>{
        var dec_text = $('#url_data').val();        
        $('#url_data').val(window.encodeURI(dec_text));
        copy_result_if_asked($('#url_data'));

    })

    $('.url_decode').on('click',(elem)=>{
        var enc_text = $('#url_data').val();        
        $('#url_data').val(window.decodeURI(enc_text));
        copy_result_if_asked($('#url_data'));
    })

    $('.hex_encode').on('click',(elem)=>{
        var dec_text = $('#hex_data').val();        
        $('#hex_data').val(String2Hex(utf8.encode(dec_text)));
        copy_result_if_asked($('#hex_data'));

    })

    $('.hex_decode').on('click',(elem)=>{
        var enc_text = $('#hex_data').val();        
        $('#hex_data').val(hex2a(enc_text));
        copy_result_if_asked($('#hex_data'));
    })

    $('.hash_encode').on('click',(elem)=>{
        var dec_text = $('#hash_data').val();  
        var enc_type = $('#hash_select_enc').val();
        var hash_salt = $('#hash_salt').val();

        if(enc_type == undefined || enc_type == null || enc_type == ''){
            alert('Select Encryption Type');
            return false;
        }

        let enc_res = '';
        
        if(enc_type == 'MD5'){
            enc_res += CryptoJS.MD5(dec_text);
        } else if (enc_type == 'SHA256'){
            enc_res += CryptoJS.SHA256(dec_text);
        } else if (enc_type == 'SHA512'){
            enc_res += CryptoJS.SHA512(dec_text);
        } else if (enc_type == 'SHA3'){
            enc_res += CryptoJS.SHA3(dec_text);
        } else if (enc_type == 'AES'){
            enc_res = CryptoJS.AES.encrypt(dec_text,hash_salt);
        }
        if (hash_salt){
            enc_res = hash_salt + enc_res;
        }


        $('#hash_data').val(enc_res);
        copy_result_if_asked($('#hash_data'));

    })

    $('.hash_decode').on('click',(elem)=>{
        var enc_text = $('#hash_data').val();  
        var enc_type = $('#hash_select_enc').val();
        var hash_salt = $('#hash_salt').val();  
        
        let enc_res = '';

        if (enc_type == 'AES'){
            enc_res = CryptoJS.AES.decrypt(enc_text,hash_salt);
        } else {
            alert('Works Only For AES');
            return false;
        }

        $('.aes-alert').html('If text is not readable try hex decoding');
        $('#hash_data').val(enc_res);
        copy_result_if_asked($('#hash_data'));
    })

    $('.json_beautifier').on('click', (elem) => {
        $('.json__retry').show();
        var enc_text = $('#json_data').val();
        try {
            var j_obj = JSON.parse(enc_text);
        } catch (error) {
            $('#json_data').val('Invalid Json String.');
            return;  
        }
        var str = JSON.stringify(j_obj, undefined, 4);
        $('#json_data').hide();
        $('#json_data_p').show();
        $('#json_data_p').html(syntaxHighlight(str));
    })

    $('.json__retry').on('click', (elem) => {
        $('.json__retry').hide();
        $('#json_data').show();
        $('#json_data_p').hide();
    })
    
});

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

function copy_result_if_asked(target) {

    var will_copy_val = $('#will_copy:checkbox:checked').length > 0;
    
    if (true){

        copyToClipboard(target);

        $(target).find('label').insertAfter($('.extra'));
        $('.extra').addClass('text-dark');
        
        setTimeout(() => {
            $('.extra').removeClass('text-dark');
            $('.extra').remove();
        }, 1000);

    }

}


function copyToClipboard(elem) {
    let $temp = $('<input>');
    $('body').append($temp);
    let val = $(elem).val();
    $temp.val(val).select();
    document.execCommand('copy');
    $temp.remove();
}