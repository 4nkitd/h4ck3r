// options.js - Handles saving and loading toolbar settings

$(function() {
    // Load saved settings when the options page loads
    loadToolbarSettings();

    // Save settings when the save button is clicked
    $('#save_toolbar_settings').on('click', saveToolbarSettings);

    // Reset toolbar position and visibility
    $('#reset_toolbar_position').on('click', resetToolbar);
});

function loadToolbarSettings() {
    // Use chrome.storage.sync for cross-device settings (fallback to localStorage if needed)
    // For simplicity, using localStorage as per existing patterns in injection.js

    const settings = {
        fill: localStorage.getItem('h4ck3r.toolbar.fill') !== 'false', // Default true
        reset: localStorage.getItem('h4ck3r.toolbar.reset') !== 'false', // Default true
        hide: localStorage.getItem('h4ck3r.toolbar.hideToggle') !== 'false', // Default true
        reload: localStorage.getItem('h4ck3r.toolbar.reload') !== 'false', // Default true
        needed: localStorage.getItem('h4ck3r.toolbar.needed') !== 'false' // Default true
    };

    $('#toolbar_fill_toggle').prop('checked', settings.fill);
    $('#toolbar_reset_toggle').prop('checked', settings.reset);
    $('#toolbar_hide_toggle').prop('checked', settings.hide);
    $('#toolbar_reload_toggle').prop('checked', settings.reload);
    $('#toolbar_needed_toggle').prop('checked', settings.needed);
}

function saveToolbarSettings() {
    const settings = {
        fill: $('#toolbar_fill_toggle').is(':checked'),
        reset: $('#toolbar_reset_toggle').is(':checked'),
        hide: $('#toolbar_hide_toggle').is(':checked'),
        reload: $('#toolbar_reload_toggle').is(':checked'),
        needed: $('#toolbar_needed_toggle').is(':checked')
    };

    localStorage.setItem('h4ck3r.toolbar.fill', settings.fill);
    localStorage.setItem('h4ck3r.toolbar.reset', settings.reset);
    localStorage.setItem('h4ck3r.toolbar.hideToggle', settings.hide); // Renamed key slightly to avoid conflict with existing 'h4ck3r.hide'
    localStorage.setItem('h4ck3r.toolbar.reload', settings.reload);
    localStorage.setItem('h4ck3r.toolbar.needed', settings.needed);

    // Show saved message
    $('#toolbar_settings_saved_message').fadeIn().delay(2000).fadeOut();
}

function resetToolbar() {
    console.log("Resetting toolbar position and visibility");
    // Set state to visible
    localStorage.setItem('h4ck3r.hide', 'true');

    // Set position to top center
    localStorage.setItem('h4ck3r_position_top', '10px'); // Default top position
    localStorage.setItem('h4ck3r_position_bottom', '50%'); // Use 50% for left to center

    // Show reset message
    $('#toolbar_reset_message').fadeIn().delay(3000).fadeOut();
}