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
	freqDim,
	timeDim;

function getCanvasSizes(){
    freqDim = {width:timePlot.offsetWidth,height:timePlot.offsetHeight},
    timeDim = {width:freqPlot.offsetWidth,height:freqPlot.offsetHeight};
}

getCanvasSizes()
window.onresize = function()
{	getCanvasSizes()
	canvasResize(freqCanvas,freqDim)
	canvasResize(timeCanvas,timeDim)
	console.log(timeDim.height)

}

freqCanvas = d3.select("#freqDomainPlot").append("canvas")
	.attr('id',"freqCanvas")
	.attr("width",freqDim.width)
	.attr("height",  freqDim.height);


timeCanvas = d3.select("#timeDomainPlot").append("canvas")
	.attr("width",timeDim.width)
	.attr("height",  timeDim.height);

function canvasResize(canvas,dims)
{
	canvas.attr("width",dims.width)
		  .attr("height",dims.height)
}

var freqctx = freqCanvas[0][0].getContext("2d"),
	timectx = timeCanvas[0][0].getContext("2d");

timectx.rect(188, 50, 200, 100);
timectx.fillStyle = 'yellow';
timectx.fill();



oscillator.type = 'triangle'
oscillator.frequency.value = 400;
oscillator.start(0);
oscillator.connect(context.destination);