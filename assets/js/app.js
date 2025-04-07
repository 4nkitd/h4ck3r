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

    $('.hash_encode').on('click', (elem) => {
        var dec_text = $('#hash_data').val();
        var enc_type = $('#hash_select_enc').val();
        var hash_salt = $('#hash_salt').val();
    
        if (!enc_type) {
            alert('Select Encryption Type');
            return false;
        }
    
        let enc_res = '';
    
        if (enc_type === 'MD5') {
            enc_res += CryptoJS.MD5(dec_text);
        } else if (enc_type === 'SHA256') {
            enc_res += CryptoJS.SHA256(dec_text);
        } else if (enc_type === 'SHA512') {
            enc_res += CryptoJS.SHA512(dec_text);
        } else if (enc_type === 'SHA3') {
            enc_res += CryptoJS.SHA3(dec_text);
        } else if (enc_type === 'AES') {
            enc_res = CryptoJS.AES.encrypt(dec_text, hash_salt);
        } else if (enc_type === 'HMAC') {
            enc_res = CryptoJS.HmacSHA256(dec_text, hash_salt);
        } else if (enc_type === 'PBKDF2') {
            enc_res = CryptoJS.PBKDF2(dec_text, hash_salt, {
                keySize: 128 / 32
            });
        }
    
        if (hash_salt) {
            enc_res = hash_salt + enc_res;
        }
    
        $('#hash_data').val(enc_res);
        copy_result_if_asked($('#hash_data'));
    });

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
    
    $('.jwt_decode').on('click', (elem) => {
        const token = $('#jwt_data').val().trim();
        const headerOutput = $('#jwt_header_output');
        const payloadOutput = $('#jwt_payload_output');
        const errorOutput = $('#jwt_error');

        headerOutput.empty(); // Clear previous output
        payloadOutput.empty();
        errorOutput.hide().empty();

        if (!token) {
            errorOutput.text('Please paste a JWT token.').show();
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Token must have 3 parts separated by dots.');
            }

            const decodedHeader = decodeJwtPart(parts[0]);
            const decodedPayload = decodeJwtPart(parts[1]);

            headerOutput.html(syntaxHighlight(JSON.stringify(decodedHeader, null, 4)));
            payloadOutput.html(syntaxHighlight(JSON.stringify(decodedPayload, null, 4)));

        } catch (error) {
            console.error("JWT Decode Error:", error);
            errorOutput.text(`Error decoding JWT: ${error.message}`).show();
            headerOutput.text(''); // Clear output on error
            payloadOutput.text('');
        }
    });

    // Add JWT decoding logic
    $('.h4ckr-jwt-decoder').on('click', () => {
        const token = prompt('Enter JWT Token:');
        if (!token) {
            alert('No token provided.');
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Token must have 3 parts separated by dots.');
            }

            const decodeBase64 = (str) => decodeURIComponent(atob(str).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const header = JSON.parse(decodeBase64(parts[0]));
            const payload = JSON.parse(decodeBase64(parts[1]));

            alert(`Header: ${JSON.stringify(header, null, 2)}\n\nPayload: ${JSON.stringify(payload, null, 2)}`);
        } catch (error) {
            alert(`Error decoding JWT: ${error.message}`);
        }
    });

    // Function to format and display domain extraction results
    function displayDomainResults(domains) {
        let domainList = Array.from(domains).sort();
        let output = domainList.join('\n');
        $('#domains_output').text(output);
        
        // Copy results to clipboard automatically
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = output;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
    }

    // Extract domains from active tab when button is clicked
    $('.extract_domains').on('click', function() {
        // For pages loaded in DevTools panel, we need to communicate with background script
        if (chrome && chrome.devtools) {
            chrome.devtools.inspectedWindow.eval(
                `
                (function() {
                    const domains = new Set();
                    const links = document.querySelectorAll('a[href]');
                    const images = document.querySelectorAll('img[src]');
                    const scripts = document.querySelectorAll('script[src]');
                    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
                    const iframes = document.querySelectorAll('iframe[src]');
                    
                    // Extract domains from all links
                    links.forEach(link => {
                        try {
                            const url = new URL(link.href);
                            domains.add(url.hostname);
                        } catch (e) {}
                    });
                    
                    // Extract domains from images
                    images.forEach(img => {
                        try {
                            if (img.src.startsWith('http')) {
                                const url = new URL(img.src);
                                domains.add(url.hostname);
                            }
                        } catch (e) {}
                    });
                    
                    // Extract domains from scripts
                    scripts.forEach(script => {
                        try {
                            if (script.src) {
                                const url = new URL(script.src);
                                domains.add(url.hostname);
                            }
                        } catch (e) {}
                    });
                    
                    // Extract domains from stylesheets
                    stylesheets.forEach(sheet => {
                        try {
                            if (sheet.href) {
                                const url = new URL(sheet.href);
                                domains.add(url.hostname);
                            }
                        } catch (e) {}
                    });
                    
                    // Extract domains from iframes
                    iframes.forEach(iframe => {
                        try {
                            if (iframe.src.startsWith('http')) {
                                const url = new URL(iframe.src);
                                domains.add(url.hostname);
                            }
                        } catch (e) {}
                    });
                    
                    return Array.from(domains);
                })()
                `, 
                function(result, isException) {
                    if (isException) {
                        $('#domains_output').text('Error extracting domains: ' + isException);
                    } else {
                        const domains = new Set(result);
                        displayDomainResults(domains);
                    }
                }
            );
        }
    });

    // Global function to extract domains from page (used by toolbar button)
    window.extractDomainsFromPage = function() {
        const domains = new Set();
        
        // Only execute if we're in the main window, not in the DevTools panel
        if (!chrome || !chrome.devtools) {
            try {
                // Collect all elements that might have domains
                const links = document.querySelectorAll('a[href]');
                const images = document.querySelectorAll('img[src]');
                const scripts = document.querySelectorAll('script[src]');
                const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
                const iframes = document.querySelectorAll('iframe[src]');
                const sources = document.querySelectorAll('source[src]');
                
                // Extract domains from links
                links.forEach(link => {
                    try {
                        const url = new URL(link.href, window.location.href);
                        domains.add(url.hostname);
                    } catch (e) {}
                });
                
                // Extract domains from images
                images.forEach(img => {
                    try {
                        const url = new URL(img.src, window.location.href);
                        domains.add(url.hostname);
                    } catch (e) {}
                });
                
                // Extract domains from scripts
                scripts.forEach(script => {
                    try {
                        if (script.src) {
                            const url = new URL(script.src, window.location.href);
                            domains.add(url.hostname);
                        }
                    } catch (e) {}
                });
                
                // Extract domains from stylesheets
                stylesheets.forEach(sheet => {
                    try {
                        if (sheet.href) {
                            const url = new URL(sheet.href, window.location.href);
                            domains.add(url.hostname);
                        }
                    } catch (e) {}
                });
                
                // Extract domains from iframes
                iframes.forEach(iframe => {
                    try {
                        if (iframe.src) {
                            const url = new URL(iframe.src, window.location.href);
                            domains.add(url.hostname);
                        }
                    } catch (e) {}
                });
                
                // Extract domains from source elements (video, audio)
                sources.forEach(source => {
                    try {
                        if (source.src) {
                            const url = new URL(source.src, window.location.href);
                            domains.add(url.hostname);
                        }
                    } catch (e) {}
                });
                
                // Format and display the results
                let domainList = Array.from(domains).sort();
                let output = domainList.join('\n');
                
                // Display in alert for toolbar button
                alert("Domains found on this page:\n\n" + output);
                
                // Copy to clipboard
                const tempTextarea = document.createElement('textarea');
                tempTextarea.value = output;
                document.body.appendChild(tempTextarea);
                tempTextarea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextarea);
                
                console.log("Domains copied to clipboard:", domainList);
            } catch (e) {
                console.error("Error extracting domains:", e);
                alert("Error extracting domains: " + e.message);
            }
        }
    };
});

function decodeJwtPart(base64Url) {
    // Replace non-url compatible chars with base64 standard chars
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad out with standard base64 required padding characters
    const pad = base64Url.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        base64Url += new Array(5 - pad).join('=');
    }

    const base64 = window.atob(base64Url);
    const jsonPayload = decodeURIComponent(base64.split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
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

async function copyToClipboard(elem) {
    let val = $(elem).val();
    try {
        await navigator.clipboard.writeText(val);
        console.log('Text copied to clipboard');
        // Optionally, provide user feedback here (e.g., show a temporary message)
    } catch (err) {
        console.error('Failed to copy text: ', err);
        // Fallback or error message for the user
        alert('Failed to copy text. Please try again or copy manually.');
    }
}