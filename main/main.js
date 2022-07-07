'use strict';

$('.btn-theme').on('click', (event) =>{

    console.log('clicked', event.target);
    const where = $(event.target).data('goto');
    console.log('where', where);
    $(`#${where}`).removeClass('d-none');
    $(`.block`).hide().fadeOut(1000);

})