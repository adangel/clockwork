(function() {

function create() {
// Global variable
var clock_face = null,
	ctx = null;

var IMG_HEIGHT = 451,
	IMG_WIDTH = 1200,
	DIGIT_HEIGHT = IMG_HEIGHT,
	DIGIT_WIDTH = 263,
	ACTUAL_DIGIT_HEIGHT = DIGIT_HEIGHT,
	ACTUAL_DIGIT_WIDTH = DIGIT_WIDTH,
	xPositions = null,
	xSecondStartPos = 0,
	yPositionStart = 0,
	secondWidth = 0,
	secondHeight = 0;
	
function clearCanvas() {
	 // clear canvas
	ctx.clearRect(0, 0, IMG_WIDTH, IMG_HEIGHT);
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number;
}

function draw(in_time) {
	
	var currentTime = in_time || new Date(),
		time = pad2(currentTime.getHours()) + pad2(currentTime.getMinutes()) + pad2(currentTime.getSeconds()),
		iDigit;
	
	console.log(time);
	clearCanvas();

	// Draw the HHHH digits onto the canvas
	for(iDigit = 0; iDigit < 4; iDigit++) {
		drawHHMMDigit(time, iDigit);
	}
	
	// Draw scalled second digits
	ctx.drawImage(clock_face, time.substr(4, 1) * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, xSecondStartPos, yPositionStart + 20, secondWidth, secondHeight);
	ctx.drawImage(clock_face, time.substr(5, 1) * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, xSecondStartPos + secondWidth, yPositionStart + 20, secondWidth, secondHeight);
}

function drawHHMMDigit(time, unit) {
	ctx.drawImage(clock_face, time.substr(unit,1) * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, xPositions[unit], yPositionStart, ACTUAL_DIGIT_WIDTH, ACTUAL_DIGIT_HEIGHT);
}

function imgLoaded() {
	// Image loaded event complete.  Start the timer
	setInterval(draw, 1000);
}
function resize(current_width) {
    var iHHMMGap = 25,
        iSSGap = 0;

    ACTUAL_DIGIT_WIDTH = current_width / 5;
    ACTUAL_DIGIT_HEIGHT = ACTUAL_DIGIT_WIDTH / (DIGIT_WIDTH / DIGIT_HEIGHT);
    iHHMMGap = ACTUAL_DIGIT_WIDTH / 10;

    yPositionStart = 0;
    xPositions = Array(ACTUAL_DIGIT_WIDTH * 0,
                        ACTUAL_DIGIT_WIDTH * 1,
                        (ACTUAL_DIGIT_WIDTH * 2) + iHHMMGap,
                        (ACTUAL_DIGIT_WIDTH * 3) + iHHMMGap);
                        
    xSecondStartPos = xPositions[3] + ACTUAL_DIGIT_WIDTH + iSSGap;
    
    secondWidth = ACTUAL_DIGIT_WIDTH * 0.25;
    secondHeight = ACTUAL_DIGIT_HEIGHT * 0.25;

    ctx.canvas.width = current_width;
    ctx.canvas.height = ACTUAL_DIGIT_HEIGHT;
}
function init(canvasElement, callback) {
	// Grab the clock element
	var canvas = canvasElement || document.getElementById('clock');
	
	// Canvas supported?
	if (canvas.getContext('2d')) {
		ctx = canvas.getContext('2d');

		resize($(canvas).width());

		// Load the clock face image
		clock_face = new Image();
		clock_face.src = 'js/flip_clock/flip_clock.png';
		clock_face.onload = callback || imgLoaded;
	} else {
		alert("Canvas not supported!");
	}
}

return {
    init: init,
    draw: draw,
    resize: resize
};
}

window.flip_clock_create = create;
})();