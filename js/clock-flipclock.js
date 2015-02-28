(function() {
    var NAME = "flipclock",
        clockwork = window.clockwork = window.clockwork || {},
        utils = clockwork.utils;

    clockwork.clocks = clockwork.clocks || {};
    clockwork.clocks[NAME] = {
            label: "Flip Clock",
            fn: function(zone, title, s) {
                var main = document.createElement("div"),
                    canvas = document.createElement("canvas"),
                    text = utils.createClockSubtitleNode(title, zone);
                main.appendChild(canvas);
                main.appendChild(text);

                var flipClock = flip_clock_create();
                
                flipClock.init(canvas, function() {
                    updateCurrent(s);
                });

                main.update = updateCurrent;
                main.zone = zone;
                main.title = title;
                main.clockstyle = NAME;
                main.showSeconds = s;
                $(main).addClass(NAME);
                main.setSize = setsize;
                $(main).resize(function() {main.setSize($(main).width());});
                return main;
    
                function setsize(w) {
                    main.style.width = w + "px";
                    main.style.height = (w / 2.6) + "px";
                    flipClock.resize(w);
                    updateCurrent(main.showSeconds);
                }
                function updateCurrent(s) {
                    var current = utils.getCurrentTime(zone);
                    main.showSeconds = s;
                    flipClock.draw(current.date, s);
                    utils.updateClockSubtitleNode(text, current.hours, current.minutes, current.seconds,
                            current.additions, current.date, s);
                }
            }
    };
})();
