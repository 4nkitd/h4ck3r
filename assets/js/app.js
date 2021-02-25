

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
    })

    $('.base64_decode').on('click',(elem)=>{
        var enc_text = $('#base64_data').val();        
        $('#base64_data').val(window.atob(enc_text));
    })



    $('.url_encode').on('click',(elem)=>{
        var dec_text = $('#url_data').val();        
        $('#url_data').val(window.encodeURI(dec_text));
    })

    $('.url_decode').on('click',(elem)=>{
        var enc_text = $('#url_data').val();        
        $('#url_data').val(window.decodeURI(enc_text));
    })



    $('.hex_encode').on('click',(elem)=>{
        var dec_text = $('#hex_data').val();        
        $('#hex_data').val(String2Hex(utf8.encode(dec_text)));
    })

    $('.hex_decode').on('click',(elem)=>{
        var enc_text = $('#hex_data').val();        
        $('#hex_data').val(hex2a(enc_text));
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
    })

});