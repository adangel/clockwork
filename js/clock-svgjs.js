(function() {

    var clockwork = window.clockwork = window.clockwork || {},
        utils = clockwork.utils;

    clockwork.clocks = clockwork.clocks || {};
    clockwork.clocks.svgjs = {
            label: "svgjs Example Clock",
            fn: function(zone, title) {
                var main = document.createElement("div"),
                    text = utils.createClockSubtitleNode(title, zone),
                    svg = SVG(main).size(400, 400),
                    clock = svg.clock('100%');

                main.appendChild(text);

                updateCurrent();

                main.update = updateCurrent;
                main.zone = zone;
                main.title = title;
                main.clockstyle = "svgjs";
                $(main).addClass("svgjs");
                main.setSize = function(w) {
                    main.style.width = w + "px";
                    main.style.height = w + "px";
                    svg.size(w - 20, w - 20);
                };

                return main;

                function updateCurrent() {
                    var current = utils.getCurrentTime(zone);
                    update(current.hours, current.minutes, current.seconds, current.additions);
                }
                function update(hours, minutes, seconds, additions) {
                    var duration = 300;
                    utils.updateClockSubtitleNode(text, hours, minutes, seconds, additions);
                    clock.setHours(hours, minutes);
                    clock.setMinutes(minutes, duration);
                    clock.setSeconds(seconds, duration);
                }
            }
    };
})();
