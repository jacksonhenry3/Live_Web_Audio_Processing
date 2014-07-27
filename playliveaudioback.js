/* javascript goes here */
svg = d3.select("#a").append("svg:svg")
	.attr("width", window.innerWidth)
	.attr("height",  window.innerHeight)
	.style('background-color','#FFF');


w = (window.innerWidth+1)*2
  var context = new webkitAudioContext();
	var analyser = context.createAnalyser();
	s = Math.pow(2,8)
	analyser.fftSize = s

	binWidth= w/s
	var buffer = new Float32Array(analyser.frequencyBinCount);
	function analyze() {
		requestAnimationFrame(analyze);
		analyser.getFloatFrequencyData(buffer);
		// buffer is now filled with data
		// if there are -100 values only set your systems microphone & speakers sample rates to the same values

		window.audioBuffer = buffer        
	}

	function connectStream(stream) {
		var source = context.createMediaStreamSource(stream);
		source.connect(analyser);
		analyze();
		analyser.connect(filter)
      	filter.connect(gainNode)
      	gainNode.connect(context.destination);
	}

	function microphoneError(e) {
		alert('MicrophoneError error!', e);
	};

	if (navigator.webkitGetUserMedia) {
		navigator.webkitGetUserMedia({audio: true, video: false}, connectStream, microphoneError);
	} else {
		alert('Your browser does not support webkitGetUserMedia.');
	}

function showData()
{
		svg.selectAll("line").remove()
		svg.selectAll("line")
			.data(window.audioBuffer)
			.enter()
			.append("line")
			// .attr('class','gridLine')
			.attr("y1",function(d,i){return(window.innerHeight)})
			.attr("y2",function(d,i){return(-1*window.audioBuffer[i])*3})
			.attr("x1",function(d,i){return((i+.5)*binWidth)})
			.attr("x2",function(d,i){return((i+.5)*binWidth)})
			.attr("stroke-width",Math.ceil(binWidth)+1)
			.attr("stroke",function(d,i){return('rgb('+ Math.floor(255-d*-2)+',0,0)')});

}


oscillator = context.createOscillator();
oscillator.frequency.value = 00;

var gainNode = context.createGain();
var filter = context.createBiquadFilter();
// Create the audio graph.
oscillator.connect(filter);
filter.connect(gainNode);
// Create and specify parameters for the low-pass filter.
filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
filter.frequency.value = 440; // Set cutoff to 440 HZ





// Connect the source to the gain node.

// Connect the gain node to the destination.

// oscillator.connect(context.destination);
oscillator.start(0);

d3.select("body").style('height',window.innerHeight+'px').on("mousemove", function()
{
	var m = d3.mouse(this)
		oscillator.frequency.value = m[0];
		gainNode.gain.value = 0;	
});

data = []
for (var x = 1000 - 1; x >= 0; x--) {
	data.push({x:x,y:Math.sin(x)})
};


window.setInterval(showData,5)