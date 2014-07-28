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
	navigator.getUserMedia = navigator.webkitGetUserMedia||navigator.getUserMedia
	navigator.webkitGetUserMedia({audio: true, video: false}, connectStream, microphoneError);
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of getUserMedia \n try the latest firefox or chrome");
}

// set up vars and audio nodes
var vCanvasDim    = {width:window.innerWidth,height:window.innerHeight},
	freqBinNumber = Math.pow(2,11),
	analyser      = context.createAnalyser(),
	oscillator    = context.createOscillator(),
	gainNode      = context.createGain(),
	filter        = context.createBiquadFilter();

var hScale = d3.scale.linear()
	.range([0,vCanvasDim.height])
	.domain([-30,-110])

var colorScale = d3.scale.linear()
	.range([255,0])
	.domain([-30,-110])
	
svg = d3.select("#a").append("svg:svg")
	.attr("width", window.innerWidth)
	.attr("height",  window.innerHeight)
	.style('background-color','#FFF');

// analyser settings
    analyser.fftSize = freqBinNumber;
var	freqBinWidth     = (vCanvasDim.width*2+1)/freqBinNumber,
	buffer           = new Float32Array(analyser.frequencyBinCount);
	analyser.smoothingTimeConstant = .7

// oscillator settings
	oscillator.type = 'square'
	oscillator.frequency.value = 00;
	oscillator.start(0);

// filter settings
	filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
	filter.frequency.value = 100000; // Set cutoff to 440 HZ

// create oscillator audio graph
	oscillator.connect(filter);

function analyze() 
{
	requestAnimationFrame(analyze);
	analyser.getFloatFrequencyData(buffer);
	window.audioBuffer = buffer
	showData()
}

function connectStream(stream)
{
	var source = context.createMediaStreamSource(stream);
	source.connect(filter);
	filter.connect(gainNode); 
	gainNode.connect(analyser);
	analyser.connect(context.destination);
	analyze();
}

function microphoneError(e) {
	alert('MicrophoneError error!', e);
};

d3.select("body").style('height',window.innerHeight+'px').on("mousemove", function()
{
	var m = d3.mouse(this)
		oscillator.frequency.value =20*m[0];
		gainNode.gain.value = 1-m[1]/vCanvasDim.height;	
});

		svg.selectAll("line").remove()
		svg.selectAll("line")
			.data(window.audioBuffer)
			.enter()
			.append("line")
			// .attr('class','gridLine')
			.attr("y1",function(d,i){return(window.innerHeight)})
			.attr("y2",function(d,i){return(hScale(-30))})
			.attr("x1",function(d,i){return((i+.5)*freqBinWidth)})
			.attr("x2",function(d,i){return((i+.5)*freqBinWidth)})
			.attr("stroke-width",Math.ceil(freqBinWidth)+.5)
			.attr("stroke",function(d,i){return('rgb(0,'+ Math.floor(255-d*-2)+','+ Math.floor(255-d*-2)+')')});


function showData()
{
		svg.selectAll("line")
			.data(window.audioBuffer)
			.transition()
			.ease("linear")
			.duration(10)
			.attr("y2",function(d){return(hScale(d))})
			.attr("stroke",function(d){return('rgb(0,'+ Math.floor(colorScale(d))/1.3+','+ Math.floor(colorScale(d))+')')});
}
