(function() {

var DEFAULT_CLOCK_STYLE = "svgjs",
    clocks = [];

$(document).ready(function() {
    initTimezoneJS();
    renderSelectBoxes();
    bindEventListeners();

    if (location.hash.length > 1) {
        parseLocationHash();
    } else {
        restoreDefaultClocks();
    }
});





//-----------------------------------------------------------------
function initTimezoneJS() {
    timezoneJS.timezone.zoneFileBasePath = 'tzdata';
    timezoneJS.timezone.loadingScheme = timezoneJS.timezone.loadingSchemes.PRELOAD_ALL;
    timezoneJS.timezone.init({ async: false });
}
function bindEventListeners() {
    $("#config-button").click(function() {
        $("#config").fadeIn();
    });
    $("#config button.close").click(function() {
        $("#config").fadeOut();
    });
    $("#config button.clear").click(function() {
        clearAllClocks();
        syncLocationHash();
    });
    $("#config button.default").click(function() {
        clearAllClocks();
        restoreDefaultClocks();
    });
    $("#config button.add").click(function() {
        var title = $("#config input[name='title']").val(),
            tz = $("#config select[name='timezone']").val(),
            style = $("#config select[name='style']").val();
        addNewClock(style, tz, title);
        syncLocationHash();
    });
    $(window).on('hashchange', function() {
        parseLocationHash();
    });

    var intervalId = null;
    $(window).focus(function() {
        function updateAll() {
            $.each(clocks, function(index, value) {
                value.update();
            });
        }
        updateAll();
        intervalId = window.setInterval(updateAll, 1000);
    });
    $(window).blur(function() {
        if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
        }
    });
}
function renderSelectBoxes() {
    $.each(timezoneJS.timezone.getAllZones(), function(index, value) {
        $("#config select[name='timezone']").append("<option value='" + value + "'>" + value + "</option>");
    });
    $.each(clockwork.clocks, function(key, value) {
        var checked = key === DEFAULT_CLOCK_STYLE ? " checked='checked'" : "";
        $("#config select[name='style']").append("<option value='" + key + "'" + checked + ">" + value.label + "</option>");
    });
}
function restoreDefaultClocks() {
    addNewClock(DEFAULT_CLOCK_STYLE, "Europe/Berlin", "Berlin");
    syncLocationHash();
}
function clearAllClocks() {
    $.each(clocks, function(index, value) {
        value.remove();
    });
    clocks = [];
}
function syncLocationHash() {
    var hash = "";
    $.each(clocks, function(index, clock) {
        hash += clock.clockstyle + "," + clock.zone + "," + clock.title + "|";
    });
    syncLocationHash.lastHash = "#" + hash;
    location.hash = syncLocationHash.lastHash;
}
function parseLocationHash() {
    if (syncLocationHash.lastHash === location.hash) {
        return;
    }

    clearAllClocks();
    var hash = location.hash, inclocks;
    if (hash.substring(0, 1) === '#') {
        hash = hash.substr(1);
    }
    inclocks = hash.split('|');
    $.each(inclocks, function(index, value) {
        var data = value.split(',');
        if (data[0] === '' || data.length !== 3) {
            return;
        }
        try {
            var zone = decodeURI(data[1]),
                zoneinfo = timezoneJS.timezone.getTzInfo(new Date().valueOf(), zone, true);
            if (zoneinfo) {
                addNewClock(decodeURI(data[0]), zone, decodeURI(data[2]));
            }
        } catch (e) {
            console.log("invalid data: " + inclocks[i] + " " + e);
        }
    });
    syncLocationHash();
}
function addNewClock(style, timezone, title) {
    if (!clockwork.clocks[style]) { style = DEFAULT_CLOCK_STYLE; };

    var newclock = clockwork.clocks[style].fn(timezone, title);
    clocks.push(newclock);
    $("#clocks").append(newclock);

    var rows = clocks.length / 5.0,
        newWidth = window.innerWidth / clocks.length * rows - 20,
        maxHeight = window.innerHeight / rows - 20;
    if (newWidth > maxHeight) newWidth = maxHeight;
    $.each(clocks, function(index, value) {
        value.setSize(newWidth);
    });
}
})();
