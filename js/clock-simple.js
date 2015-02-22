(function() {

    var clockwork = window.clockwork = window.clockwork || {},
        utils = clockwork.utils;

    clockwork.clocks = clockwork.clocks || {};
    clockwork.clocks.simple = {
            label: "Simple SVG clock",
            fn: function(zone, title) {
                var svg = svgElement("svg", {'viewBox': '0 0 500 500'}),
                    clockGroup = svgElement("g"),
                    group1 = svgElement("g", {'transform': 'translate(250,250)'}),
                    i, hourHandle, minuteHandle, secondHandle;

                svg.appendChild(clockGroup);
                clockGroup.appendChild(svgElement("circle", {'cx': 250, 'cy': 250, 'r': 200, 'stroke': '#000', 'stroke-width': 4, 'fill-opacity': 0}));
                for (i = 0, j = 12; i < 360; i+= 30, j++) {
                    group1.appendChild(svgElement("line", {'x1':0, 'y1':-150, 'x2':0, 'y2':-200, 'stroke':'black', 'stroke-width':3, 'transform':'rotate(' + i + ')'}));
                    if (j > 12) { j -= 12; }
                    if (j >= 4 && j <= 8) {
                        group1.appendChild(svgElement("text", {'x':0, 'y':-220, 'transform':'rotate('+ i +') rotate(180 0 -220)'}, j));
                    } else {
                        group1.appendChild(svgElement("text", {'x':0, 'y':-210, 'transform':'rotate('+ i +')'}, j));
                    }
                }
                for (i = 0; i < 360; i+= 6) {
                    group1.appendChild(svgElement("line", {'x1':0, 'y1':-180, 'x2':0, 'y2':-200, 'stroke':'black', 'stroke-width':1, 'transform':'rotate(' + i + ')'}));
                }

                hourHandle = svgElement("line", {'x1':0,'y1':0,'x2':0,'y2':-110,'stroke':'black','stroke-width':9});
                minuteHandle = svgElement("line", {'x1':0,'y1':0,'x2':0,'y2':-180,'stroke':'black','stroke-width':6});
                secondHandle = svgElement("line", {'x1':0,'y1':0,'x2':0,'y2':-200,'stroke':'black','stroke-width':3});

                group1.appendChild(hourHandle);
                group1.appendChild(minuteHandle);
                group1.appendChild(secondHandle);
                clockGroup.appendChild(group1);

                var main = document.createElement("div"),
                    text = utils.createClockSubtitleNode(title, zone);
                main.appendChild(svg);
                main.appendChild(text);

                updateCurrent();
                main.update = updateCurrent;
                main.zone = zone;
                main.title = title;
                main.clockstyle = "simple";
                $(main).addClass("simple");
                main.setSize = function(w) {
                    main.style.width = w + "px";
                    main.style.height = w + "px";
                };
                return main;
    
                function updateCurrent() {
                    var current = utils.getCurrentTime(zone);
                    update(current.hours, current.minutes, current.seconds, current.additions);
                }
                function update(hours, minutes, seconds, additions) {
                    utils.updateClockSubtitleNode(text, hours, minutes, seconds, additions);
                    if (hours > 12) { hours -= 12; }
                    hourHandle.setAttribute("transform", "rotate(" + (360.0/12 * (hours + minutes/60.0 + seconds/3600.0)) + ")");
                    minuteHandle.setAttribute("transform", "rotate(" + (360.0/60 * (minutes + seconds/60.0)) + ")");
                    secondHandle.setAttribute("transform", "rotate(" + (360/60 * seconds) + ")");
                }
        }
    };

    function svgElement(name, atts, text) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", name);
        svgAttrs(element, atts);
        if (text) {
            element.appendChild(document.createTextNode(text));
        }
        return element;
    }
    function svgAttrs(element, atts) {
        $.each(atts || {}, function(key, value) {
            element.setAttribute(key, value);
        });
        return element;
    }

})();
