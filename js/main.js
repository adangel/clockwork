(function() {

var DEFAULT_CLOCK_STYLE = "svgjs",
    DEFAULT_CLOCKS_PER_ROW = 5,
    CLOCK_DELIMITER = ";",
    CLOCK_ALT_DELIMITER = "|",
    DELIMITER = ",";

$(document).ready(function() {
    initTimezoneJS();
    render();
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
        $("#config").dialog("open");
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
    $("#clocks-per-row").val(DEFAULT_CLOCKS_PER_ROW);
    $("#clocks-per-row").change(function() {
        resize();
        syncLocationHash();
    });
    $("#show-seconds").change(function() {
        updateAll();
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
            updateAll();
            unregisterRefreshInterval();
            intervalId = window.setInterval(updateAll, 1000);
        };
    $(window).focus(registerRefreshInterval);
    $(window).blur(unregisterRefreshInterval);
    // register once
    registerRefreshInterval();
}
function updateAll() {
    var showSeconds = $("#show-seconds:checked").val() === "on";
    $('#clocks > div').each(function(index, value) {
        value.update(showSeconds);
    });
}
function render() {
    $("#config-button").button();
    $("#config button.clear").button();
    $("#config button.default").button();
    $("#config button.add").button();
    $("#config > div.tabs").tabs();
    $("#config").dialog({
        autoOpen: false,
        width: 400
    });

    $.each(timezoneJS.timezone.getAllZones(), function(index, value) {
        $("#timezone-select").append("<option value='" + value + "'>" + value + "</option>");
    });
    $("#timezone-select").selectmenu()
        .selectmenu( "menuWidget" )
            .addClass( "overflow" );
    $.each(clockwork.clocks, function(key, value) {
        var checked = key === DEFAULT_CLOCK_STYLE ? " checked='checked'" : "";
        $("#clockstyle-select").append("<option value='" + key + "'" + checked + ">" + value.label + "</option>");
    });
    $("#clockstyle-select").selectmenu();
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

    hash += "c";
    hash += ":s" + ($("#show-seconds:checked").val() === "on" ? "1" : "0");
    hash += ":r" + $("#clocks-per-row").val();
    hash += CLOCK_DELIMITER;

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
    if (inclocks.length > 0 && inclocks[0].substring(0, 2) === "c:") {
        var config = inclocks[0].split(":");
        inclocks.shift();
        $.each(config, function(index, value) {
            if (value.substring(0, 1) === "s") {
                document.getElementById("show-seconds").checked = value.substring(1, 2) === "1" ? "checked" : "";
            } else if (value.substring(0, 1) === "r") {
                $("#clocks-per-row").val(value.substr(1));
            }
        });
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
            console.log("invalid data: " + value + " " + e);
        }
    });
    syncLocationHash();
}
function addNewClock(style, timezone, title) {
    if (!clockwork.clocks[style]) { style = DEFAULT_CLOCK_STYLE; }
    style = removeAllDelimiters(style);
    timezone = removeAllDelimiters(timezone);
    title = removeAllDelimiters(title);

    var newclock = clockwork.clocks[style].fn(timezone, title, $("#show-seconds:checked").val() === "on");
    $(newclock).draggable();
    $(newclock).resizable();
    $("#clocks").append(newclock);
    resize();
}
function resize(event) {
    if (event && $(event.target).hasClass("ui-resizable")) {
        return;
    }

    var clocks = $('#clocks > div'),
        rows = clocks.length / $("#clocks-per-row").val(),
        newWidth = window.innerWidth / clocks.length * rows - 20;
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
