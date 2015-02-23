(function() {

    var clockwork = window.clockwork = window.clockwork || {},
        utils = clockwork.utils = clockwork.utils || {};

    utils.leadingZero = function (n) {
        if (n < 10) {
            return "0" + n;
        }
        return "" + n;
    };
    utils.createClockSubtitleNode = function(title, zone) {
        var text = document.createElement("span"),
            zoneinfo = timezoneJS.timezone.getTzInfo(new Date().valueOf(), zone, true);

        text.appendChild(document.createTextNode("will be the current time"));
        text.appendChild(document.createTextNode(" "));
        text.appendChild(document.createTextNode(title));

        text.appendChild(document.createTextNode(" (" + zoneinfo.tzAbbr + ")"));
//        text.appendChild(document.createTextNode(" (" + zoneinfo.tzOffset + ")"));
        return text;
    };
    utils.updateClockSubtitleNode = function(spanElement, hours, minutes, seconds, additions) {
        spanElement.firstChild.textContent = utils.leadingZero(hours) + ":" + utils.leadingZero(minutes) + ":" + utils.leadingZero(seconds) + additions;
    };
    utils.getCurrentTime = function(zone) {
        var now = new Date().valueOf(),
            local = new Date(),
            d = new timezoneJS.Date(now, zone),
            additions = "";

        if (d.getDate() > local.getDate()) {
            additions = " (+1d)";
        } else if (d.getDate() < local.getDate()) {
            additions = " (-1d)";
        }

        return {
            hours: d.getHours(),
            minutes: d.getMinutes(),
            seconds: d.getSeconds(),
            additions: additions
        };
    };

})();