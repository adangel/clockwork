(function() {

var DEFAULT_CLOCK_STYLE = "svgjs",
    CLOCK_DELIMITER = ";",
    CLOCK_ALT_DELIMITER = "|",
    DELIMITER = ",";

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
    $(window).resize(resize);

    var intervalId = null,
        unregisterRefreshInterval = function() {
            if (intervalId !== null) {
                window.clearInterval(intervalId);
                intervalId = null;
            }
        },
        registerRefreshInterval = function() {
            function updateAll() {
                $('#clocks > div').each(function(index, value) {
                    value.update();
                });
            }
            updateAll();
            unregisterRefreshInterval();
            intervalId = window.setInterval(updateAll, 1000);
        };
    $(window).focus(registerRefreshInterval);
    $(window).blur(unregisterRefreshInterval);
    // register once
    registerRefreshInterval();
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
    addNewClock(DEFAULT_CLOCK_STYLE, "America/New_York", "New York");
    addNewClock(DEFAULT_CLOCK_STYLE, "Asia/Tokyo", "Tokyo");
    syncLocationHash();
}
function clearAllClocks() {
    $('#clocks > div').each(function(index, value) {
        value.remove();
    });
}
function syncLocationHash() {
    var hash = "";

    $('#clocks > div').each(function(index, clock) {
        hash += clock.clockstyle + DELIMITER + clock.zone + DELIMITER + clock.title;
        hash += CLOCK_DELIMITER;
    });
    hash = hash.substring(0, hash.length - CLOCK_DELIMITER.length); // remove last CLOCK_DELIMITER
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
    hash = decodeURI(hash);

    if (hash.indexOf(CLOCK_ALT_DELIMITER) > -1) {
        inclocks = hash.split(CLOCK_ALT_DELIMITER); // for backward compatibility
    } else {
        inclocks = hash.split(CLOCK_DELIMITER);
    }
    $.each(inclocks, function(index, value) {
        var data = value.split(DELIMITER);
        if (data[0] === '' || data.length !== 3) {
            return;
        }
        try {
            var zone = data[1],
                zoneinfo = timezoneJS.timezone.getTzInfo(new Date().valueOf(), zone, true);
            if (zoneinfo) {
                addNewClock(data[0], zone, data[2]);
            }
        } catch (e) {
            console.log("invalid data: " + inclocks[i] + " " + e);
        }
    });
    syncLocationHash();
}
function addNewClock(style, timezone, title) {
    if (!clockwork.clocks[style]) { style = DEFAULT_CLOCK_STYLE; }
    style = removeAllDelimiters(style);
    timezone = removeAllDelimiters(timezone);
    title = removeAllDelimiters(title);

    var newclock = clockwork.clocks[style].fn(timezone, title);
    $(newclock).draggable();
    $(newclock).resizable();
    $("#clocks").append(newclock);
    resize();
}
function resize() {
    var clocks = $('#clocks > div'),
        rows = clocks.length / 5.0,
        newWidth = window.innerWidth / clocks.length * rows - 20,
        maxHeight = window.innerHeight / rows - 20;
    if (newWidth > maxHeight) newWidth = maxHeight;
    clocks.each(function(index, value) {
        value.setSize(newWidth);
    });
}
function removeAllDelimiters(s) {
    var re = new RegExp("\\" + DELIMITER + "|" + "\\" + CLOCK_DELIMITER + "|" + "\\" + CLOCK_ALT_DELIMITER, "g");
    s = s.replace(re, " ");
    return s;
}
})();
