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
	freqBinNumber = Math.pow(2,5),
	analyser      = context.createAnalyser(),
	oscillator    = context.createOscillator(),
	freqBuffer    = new Float32Array(analyser.frequencyBinCount),
	timeBuffer    = new Uint8Array(analyser.frequencyBinCount),
	freqCanvasDim,
	timeCanvasDim,
	hFreqScale,
	colorScale,
	freqBinWidth,
	timeBinWidth;

// analyser settings
analyser.fftSize = freqBinNumber;
analyser.smoothingTimeConstant = .4;

function getBinWidth () {
	freqBinWidth     = (freqCanvasDim.width*2+1)/freqBinNumber;
	timeBinWidth     = (timeCanvasDim.width*2+1)/freqBinNumber;
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

oscillator.type = 'triangle'
oscillator.frequency.value = 500;
oscillator.start(0);
// oscillator.connect(context.destination);

function showData(){
	freqSVG.selectAll("line")
		.data(window.frequencyBuffer)
		.attr("y2",function(d){return(hFreqScale(d))})
		.attr("stroke",function(d){return('rgb(0,'+ Math.floor(colorScale(d)*188)+','+ Math.floor(colorScale(d)*212)+')')});

	// timeSVG.selectAll("line")
	// 	.data(window.timeDomainBuffer)
	// 	.attr("y2",function(d){return(d)});
}

function analyze() 
{
	analyser.getFloatFrequencyData(freqBuffer);
	analyser.getByteTimeDomainData(timeBuffer);
	showData()
	requestAnimationFrame(analyze);
}

