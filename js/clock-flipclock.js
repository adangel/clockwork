(function() {
    var NAME = "flipclock",
        clockwork = window.clockwork = window.clockwork || {},
        utils = clockwork.utils;

    clockwork.clocks = clockwork.clocks || {};
    clockwork.clocks[NAME] = {
            label: "Flip Clock",
            fn: function(zone, title) {
                var main = document.createElement("div"),
                    canvas = document.createElement("canvas"),
                    text = utils.createClockSubtitleNode(title, zone);
                main.appendChild(canvas);
                main.appendChild(text);

                var flipClock = flip_clock_create();
                
                flipClock.init(canvas, function() {
                    updateCurrent();
                });

                main.update = updateCurrent;
                main.zone = zone;
                main.title = title;
                main.clockstyle = NAME;
                $(main).addClass(NAME);
                main.setSize = function(w) {
                    main.style.width = w + "px";
                    main.style.height = (w / 2.6) + "px";
                    flipClock.resize(w);
                    updateCurrent();
                };
                $(main).resize(function() {main.setSize($(main).width());});
                return main;
    
                function updateCurrent() {
                    var current = utils.getCurrentTime(zone);
                    flipClock.draw(current.date);
                }
            }
    };
})();
