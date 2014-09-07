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


function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

a = document.getElementById('timeDomainPlot')
b = document.getElementById('freqDomainPlot')



// set up vars and audio nodes
var freqVCanvasDim    = {width:a.offsetWidth,height:a.offsetHeight},
    timeVCanvasDim    = {width:b.offsetWidth,height:b.offsetHeight},
	freqBinNumber = Math.pow(2,11),
	analyser      = context.createAnalyser(),
	oscillator    = context.createOscillator(),
	gainNode      = context.createGain(),
	filter        = context.createBiquadFilter();
	window.frequencyBuffer = new Float32Array(analyser.frequencyBinCount);
	window.timeDomainBuffer = new Uint8Array(analyser.frequencyBinCount);

freqBuffer           = new Float32Array(analyser.frequencyBinCount);
timeDomainBuffer           =  new Uint8Array(analyser.frequencyBinCount);


var hFreqScale = d3.scale.linear()
	.range([0,freqVCanvasDim.height])
	.domain([-15,-110])

var colorScale = d3.scale.linear()
	.range([1,0])
	.domain([-30,-100])

freqSVG = d3.select("#freqDomainPlot").append("svg:svg")
	.attr("width",freqVCanvasDim.width)
	.attr("height",  freqVCanvasDim.height);


timeSVG = d3.select("#timeDomainPlot").append("svg:svg")
	.attr("width",timeVCanvasDim.width)
	.attr("height",  timeVCanvasDim.height);
	// .style('background-color',' #E5E5E5');

// analyser settings
    analyser.fftSize = freqBinNumber;
var	freqBinWidth     = (freqVCanvasDim.width*2+1)/freqBinNumber;
	timeBinWidth     = (timeVCanvasDim.width*2+1)/freqBinNumber;
	analyser.smoothingTimeConstant = .4;

// oscillator settings
	oscillator.type = 'triangle'
	oscillator.frequency.value = 0;
	// oscillator.start(0);

// filter settings
	filter.type = 1; // Low-pass filter. See BiquadFilterNode docs
	filter.frequency.value = 500; // Set cutoff to 440 HZ

// create oscillator audio graph
	oscillator.connect(filter);

function analyze() 
{
	requestAnimationFrame(analyze);
	analyser.getFloatFrequencyData(window.frequencyBuffer);
	analyser.getByteTimeDomainData(window.timeDomainBuffer);
	showData()
}

function connectStream(stream)
{
	var source = context.createMediaStreamSource(stream);
	source.connect(filter);
	analyze();
}
	filter.connect(gainNode); 
	gainNode.connect(analyser);
	analyser.connect(context.destination);

function microphoneError(e) {
	alert('MicrophoneError error!', e);
};

d3.select("#freqDomainPlot").on("mousemove", function()
{
	var m = d3.mouse(this)
		oscillator.frequency.value = m[0]/freqVCanvasDim.width*22050;
		gainNode.gain.value = 1-m[1]/freqVCanvasDim.height;	
		gainNode.gain.value = 1
});

		freqSVG.selectAll("line").remove()
		freqSVG.selectAll("line")
			.data(window.frequencyBuffer)
			.enter()
			.append("line")
			// .attr('class','gridLine')
			.attr("y1",function(d,i){return(timeVCanvasDim.height)})
			.attr("y2",function(d,i){return(hFreqScale(-30))})
			.attr("x1",function(d,i){return((i+.5)*freqBinWidth)})
			.attr("x2",function(d,i){return((i+.5)*freqBinWidth)})
			.attr("stroke-width",Math.ceil(freqBinWidth)+.5)
			.attr("stroke",function(d,i){return('rgb(0,'+ Math.floor(255-d*-2)+','+ Math.floor(255-d*-2)+')')});

		timeSVG.selectAll("line").remove()
		timeSVG.selectAll("line")
			.data(window.timeDomainBuffer)
			.enter()
			.append("line")
			// .attr('class','gridLine')
			.attr("y1",function(d,i){return(freqVCanvasDim.height)})
			.attr("y2",function(d,i){return(hFreqScale(-70))})
			.attr("x1",function(d,i){return((i+.5)*timeBinWidth)})
			.attr("x2",function(d,i){return((i+.5)*timeBinWidth)})
			.attr("stroke-width",Math.ceil(timeBinWidth)+.5)
			.attr("stroke","#00bcd4");

function showData()
{
		freqSVG.selectAll("line")
			.data(window.frequencyBuffer)
			// .transition()
			// .ease("linear")
			// .duration(10)
			.attr("y2",function(d){return(hFreqScale(d))})
			.attr("stroke",function(d){return('rgb(0,'+ Math.floor(colorScale(d)*188)+','+ Math.floor(colorScale(d)*212)+')')});

		timeSVG.selectAll("line")
			.data(window.timeDomainBuffer)
			// .transition()
			// .ease("linear")
			// .duration(10)
			.attr("y2",function(d){return(d)});
			// .attr("stroke",function(d){return('rgb(0,'+ Math.floor(colorScale(d)*188)+','+ Math.floor(colorScale(d)*212)+')')});
}
var ratings = document.querySelector('#volume');
ratings.addEventListener('change', function() {
gainNode.gain.value  = getBaseLog(10,1-ratings.immediateValue/100);
});


var filterFreq = document.querySelector('#filterFreq');
filterFreq.addEventListener('change', function() {
filter.frequency.value  =filterFreq.immediateValue
});



// Create an <audio> element dynamically.
var audio = new Audio();
var audio1 = new Audio();
audio.src = 'http://www.amclassical.com/mp3/amclassical_piano_sonata_k_310_mvt_1.mp3';
audio1.src = 'http://www.amclassical.com/mp3/amclassical_beethoven_fur_elise.mp3';
audio.controls = true;
audio.autoplay = false;
audio1.controls = true;
audio1.autoplay = false;
document.getElementById('plop').appendChild(audio);
document.getElementById('plop').appendChild(audio1);

// var context = new webkitAudioContext();
// var analyser = context.createAnalyser();

// Wait for window.onload to fire. See crbug.com/112368

  // Our <audio> element will be the audio source.
  var source = context.createMediaElementSource(audio);
  source.connect(filter);
  var source1 = context.createMediaElementSource(audio1);
  source1.connect(filter);
  // analyser.connect(context.destination);

  // ...call requestAnimationFrame() and render the analyser's output to canvas.
}

