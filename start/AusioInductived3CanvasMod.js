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

// set up for audio input
try {
	navigator.getUserMedia = navigator.webkitGetUserMedia
	navigator.webkitGetUserMedia({audio: true, video: false}, connectStream, microphoneError);
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of getUserMedia \n try the latest firefox or chrome");
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
// analyser.connect(context.destination)

function connectStream(stream)
{
	var source = context.createMediaStreamSource(stream);
	source.connect(analyser);
	analyze();
}

function microphoneError(e) {
	alert('MicrophoneError error!', e);
};


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
			.domain([analyser.minDecibels*1.01,analyser.maxDecibels])

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
oscillator.start(0);
// oscillator.connect(analyser);

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


timectx.fillStyle = 'rgb(0, 0, 0)';
	timeCanvas.attr("width",freqCanvasDim.width)

	var barWidth = (freqCanvasDim.width / freqBinNumber) * 2.5;
	var barHeight;
	var x = 0;

	freqctx.fillStyle = 'rgba(0,188,212,1)';
	for(var i = 0; i < freqBinNumber; i++) {
	    barHeight = hFreqScale(freqBuffer[i])
	    
	    freqctx.fillRect(x,freqCanvasDim.height-analyser.minDecibels-barHeight,freqBinWidth*2.5+1,barHeight);
	    x += freqBinWidth*2.5 ;
	  }
	  x = 0;
	  timectx.fillStyle = 'rgba(0,188,212,1)';
	for(var i = 0; i < freqBinNumber; i++) {
		// console.log(i)
	    barHeight = timeBuffer[i]+200
	    
	    timectx.fillRect(x,freqCanvasDim.height-analyser.minDecibels-barHeight,freqBinWidth*2.5+1,barHeight);
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
audio.src = "a.mp3";
audio1.src = 'b.mp3';
audio.controls = true;
audio.playbackRate = 1
audio.autoplay = true;
audio1.controls = true;
audio1.autoplay = false;
document.getElementById('plop').appendChild(audio);
document.getElementById('plop').appendChild(audio1);

var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  var source1 = context.createMediaElementSource(audio1);
  source1.connect(analyser);
}

