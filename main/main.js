'use strict';

(() => {

    function route(elm){

        console.log(elm);

        $(elm).removeClass('active');
        $(this).addClass('active');

        $('.lcontent').removeClass('active');
        $('#' + $(this).data('target')).addClass('active');

    }

});