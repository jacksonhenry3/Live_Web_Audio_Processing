//https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
window.onload = function(){

// set up for audio playback
try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
}

catch(e) {
	alert("Sorry, your browser doesn't support the magic of web audio \n try the latest firefox or chrome");
}




var timePlot   	  = document.getElementById('timeDomainPlot'),
	freqPlot      = document.getElementById('freqDomainPlot'),
	freqBinNumber = Math.pow(2,11),
	analyser      = context.createAnalyser(),
	oscillator    = context.createOscillator(),
	freqBuffer    = new Float32Array(freqBinNumber),
	timeBuffer    = new Uint8Array(freqBinNumber),
	freqCanvasDim,
	timeCanvasDim,
	hFreqScale,
	colorScale,
	freqBinWidth,
	timeBinWidth;

// analyser settings
analyser.fftSize = freqBinNumber;
analyser.smoothingTimeConstant = .8;
analyser.connect(context.destination)
function getBinWidth () {
	freqBinWidth     = (freqCanvasDim.width)/freqBinNumber;
	timeBinWidth     = (timeCanvasDim.width)/freqBinNumber;
}

function getCanvasSizes(){
    freqCanvasDim = {width:timePlot.offsetWidth,height:timePlot.offsetHeight},
    timeCanvasDim = {width:freqPlot.offsetWidth,height:freqPlot.offsetHeight};
}

function getScales () {
	hFreqScale = d3.scale.linear()
			.range([0,freqCanvasDim.height])
			.domain([-15,-110])

	colorScale = d3.scale.linear()
			.range([1,0])
			.domain([-30,-100])
}

function canvasResize(canvas,dims){
	canvas.attr("width",dims.width)
		  .attr("height",dims.height)
}

window.onresize = function(){
	getCanvasSizes()
	canvasResize(freqCanvas,freqCanvasDim)
	canvasResize(timeCanvas,timeCanvasDim)
	getScales()
	getBinWidth()
}

getCanvasSizes()
getScales()
getBinWidth()

freqCanvas = d3.select("#freqDomainPlot").append("canvas")
	.attr('id',"freqCanvas")
	.attr("width",freqCanvasDim.width)
	.attr("height",  freqCanvasDim.height);

timeCanvas = d3.select("#timeDomainPlot").append("canvas")
	.attr('id',"timeCanvas")
	.attr("width",timeCanvasDim.width)
	.attr("height",  timeCanvasDim.height);

var freqctx = freqCanvas[0][0].getContext("2d"),
	timectx = timeCanvas[0][0].getContext("2d");

oscillator.type = 'square'
oscillator.frequency.value = 200;
// oscillator.start(0);
oscillator.connect(analyser);

d3.select("#freqDomainPlot").on("mousemove", function()
{
	var m = d3.mouse(this)
		oscillator.frequency.value = m[0]/freqCanvasDim.width*5000;
});

var base = d3.select("#freqDomainPlot");
var dataContainer = base.append("custom");

var dataBinding = dataContainer.selectAll("custom.rect")
    	.data(freqBuffer, function(d) { return d; });


function drawCanvas() {
	analyser.getFloatFrequencyData(freqBuffer);
	freqctx.fillStyle = 'rgb(0, 0, 0)';
	freqCanvas.attr("width",freqCanvasDim.width)

	var barWidth = (freqCanvasDim.width / freqBinNumber) * 2.5;
	var barHeight;
	var x = 0;


	for(var i = 0; i < freqBinNumber; i++) {
	    barHeight = (freqBuffer[i] + freqCanvasDim.height)*2;
	    freqctx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
	    freqctx.fillRect(x,freqCanvasDim.height-barHeight/2,freqBinWidth*2.5+1,barHeight/2);
	    x += freqBinWidth*2.5 ;
	  }
	};


function analyze() 
{
	analyser.getFloatFrequencyData(freqBuffer);
	analyser.getByteTimeDomainData(timeBuffer);
	drawCanvas()
	requestAnimationFrame(analyze);
}

analyze()

var audio = new Audio();
var audio1 = new Audio();
audio.src = "http://www.podtrac.com/pts/redirect.mp3/audio.wnyc.org/radiolab_podcast/radiolab_podcast14outsidewestgate.mp3";
audio1.src = 'http://freemusicarchive.org/music/download/39f6174edc92e4d4a0a8795b7c8fa7edcc9723fe';
audio.controls = true;
audio.autoplay = false;
audio1.controls = true;
audio1.autoplay = false;
document.getElementById('plop').appendChild(audio);
document.getElementById('plop').appendChild(audio1);

var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  var source1 = context.createMediaElementSource(audio1);
  source1.connect(analyser);
}

