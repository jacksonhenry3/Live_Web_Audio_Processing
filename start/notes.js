window.onload = function(){// consider switching to creating oscilators rather than changing the frequency
// currently a setup for a monophonic keyboard corosponding to the asdfg as majors and qwert as sharps.

// set up for audio playback
try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of web audio \n try the latest firefox or chrome");
}

// create an oscialtor, analyser and 
var oscillator    = context.createOscillator(),
	freqBinNumber = Math.pow(2,11),
	octave        = 1,
	osc 		  = oscillator,
	notes         = {
		'C0': 2*Math.PI*16.35,
		'C#0': 2*Math.PI*17.32,
		'Db0': 2*Math.PI*17.32,
		'D0': 2*Math.PI*18.35,
		'D#0': 2*Math.PI*19.45,
		'Eb0': 2*Math.PI*19.45,
		'E0': 2*Math.PI*20.60,
		'F0': 2*Math.PI*21.83,
		'F#0': 2*Math.PI*23.12,
		'Gb0': 2*Math.PI*23.12,
		'G0': 2*Math.PI*24.50,
		'G#0': 2*Math.PI*25.96,
		'Ab0': 2*Math.PI*25.96,
		'A0': 2*Math.PI*27.50,
		'A#0': 2*Math.PI*29.14,
		'Bb0': 2*Math.PI*29.14,
		'B0': 2*Math.PI*30.87,
		'C1': 2*Math.PI*32.70,
		'C#1': 2*Math.PI*34.65,
		'Db1': 2*Math.PI*34.65,
		'D1': 2*Math.PI*36.71,
		'D#1': 2*Math.PI*38.89,
		'Eb1': 2*Math.PI*38.89,
		'E1': 2*Math.PI*41.20,
		'F1': 2*Math.PI*43.65,
		'F#1': 2*Math.PI*46.25,
		'Gb1': 2*Math.PI*46.25,
		'G1': 2*Math.PI*49.00,
		'G#1': 2*Math.PI*51.91,
		'Ab1': 2*Math.PI*51.91,
		'A1': 2*Math.PI*55.00,
		'A#1': 2*Math.PI*58.27,
		'Bb1': 2*Math.PI*58.27,
		'B1': 2*Math.PI*61.74,
		'C2': 2*Math.PI*65.41,
		'C#2': 2*Math.PI*69.30,
		'Db2': 2*Math.PI*69.30,
		'D2': 2*Math.PI*73.42,
		'D#2': 2*Math.PI*77.78,
		'Eb2': 2*Math.PI*77.78,
		'E2': 2*Math.PI*82.41,
		'F2': 2*Math.PI*87.31,
		'F#2': 2*Math.PI*92.50,
		'Gb2': 2*Math.PI*92.50,
		'G2': 2*Math.PI*98.00,
		'G#2': 2*Math.PI*103.83,
		'Ab2': 2*Math.PI*103.83,
		'A2': 2*Math.PI*110.00,
		'A#2': 2*Math.PI*116.54,
		'Bb2': 2*Math.PI*116.54,
		'B2': 2*Math.PI*123.47,
		'C3': 2*Math.PI*130.81,
		'C#3': 2*Math.PI*138.59,
		'Db3': 2*Math.PI*138.59,
		'D3': 2*Math.PI*146.83,
		'D#3': 2*Math.PI*155.56,
		'Eb3': 2*Math.PI*155.56,
		'E3': 2*Math.PI*164.81,
		'F3': 2*Math.PI*174.61,
		'F#3': 2*Math.PI*185.00,
		'Gb3': 2*Math.PI*185.00,
		'G3': 2*Math.PI*196.00,
		'G#3': 2*Math.PI*207.65,
		'Ab3': 2*Math.PI*207.65,
		'A3': 2*Math.PI*220.00,
		'A#3': 2*Math.PI*233.08,
		'Bb3': 2*Math.PI*233.08,
		'B3': 2*Math.PI*246.94,
		'C4': 2*Math.PI*261.63,
		'C#4': 2*Math.PI*277.18,
		'Db4': 2*Math.PI*277.18,
		'D4': 2*Math.PI*293.66,
		'D#4': 2*Math.PI*311.13,
		'Eb4': 2*Math.PI*311.13,
		'E4': 2*Math.PI*329.63,
		'F4': 2*Math.PI*349.23,
		'F#4': 2*Math.PI*369.99,
		'Gb4': 2*Math.PI*369.99,
		'G4': 2*Math.PI*392.00,
		'G#4': 2*Math.PI*415.30,
		'Ab4': 2*Math.PI*415.30,
		'A4': 2*Math.PI*440.00,
		'A#4': 2*Math.PI*466.16,
		'Bb4': 2*Math.PI*466.16,
		'B4': 2*Math.PI*493.88,
		'C5': 2*Math.PI*523.25,
		'C#5': 2*Math.PI*554.37,
		'Db5': 2*Math.PI*554.37,
		'D5': 2*Math.PI*587.33,
		'D#5': 2*Math.PI*622.25,
		'Eb5': 2*Math.PI*622.25,
		'E5': 2*Math.PI*659.26,
		'F5': 2*Math.PI*698.46,
		'F#5': 2*Math.PI*739.99,
		'Gb5': 2*Math.PI*739.99,
		'G5': 2*Math.PI*783.99,
		'G#5': 2*Math.PI*830.61,
		'Ab5': 2*Math.PI*830.61,
		'A5': 2*Math.PI*880.00,
		'A#5': 2*Math.PI*932.33,
		'Bb5': 2*Math.PI*932.33,
		'B5': 2*Math.PI*987.77,
		'C6': 2*Math.PI*1046.50,
		'C#6': 2*Math.PI*1108.73,
		'Db6': 2*Math.PI*1108.73,
		'D6': 2*Math.PI*1174.66,
		'D#6': 2*Math.PI*1244.51,
		'Eb6': 2*Math.PI*1244.51,
		'E6': 2*Math.PI*1318.51,
		'F6': 2*Math.PI*1396.91,
		'F#6': 2*Math.PI*1479.98,
		'Gb6': 2*Math.PI*1479.98,
		'G6': 2*Math.PI*1567.98,
		'G#6': 2*Math.PI*1661.22,
		'Ab6': 2*Math.PI*1661.22,
		'A6': 2*Math.PI*1760.00,
		'A#6': 2*Math.PI*1864.66,
		'Bb6': 2*Math.PI*1864.66,
		'B6': 2*Math.PI*1975.53,
		'C7': 2*Math.PI*2093.00,
		'C#7': 2*Math.PI*2217.46,
		'Db7': 2*Math.PI*2217.46,
		'D7': 2*Math.PI*2349.32,
		'D#7': 2*Math.PI*2489.02,
		'Eb7': 2*Math.PI*2489.02,
		'E7': 2*Math.PI*2637.02,
		'F7': 2*Math.PI*2793.83,
		'F#7': 2*Math.PI*2959.96,
		'Gb7': 2*Math.PI*2959.96,
		'G7': 2*Math.PI*3135.96,
		'G#7': 2*Math.PI*3322.44,
		'Ab7': 2*Math.PI*3322.44,
		'A7': 2*Math.PI*3520.00,
		'A#7': 2*Math.PI*3729.31,
		'Bb7': 2*Math.PI*3729.31,
		'B7': 2*Math.PI*3951.07,
		'C8': 2*Math.PI*4186.01
	};

// set up the oscilator
oscillator.type = 'sin';
oscillator.frequency.value = 0;
oscillator.start(0);
oscillator.connect(analyser)

// play a note when a key is pressed
document.onkeydown = playnote

// assign keys to notes
// shift octaves with the left and right arrows
function playnote()
{
	var c = event.keyCode
		f = 0;
		
	if (c===39)
	{
		octave+=1
		octave = Math.min(octave,7)
		f = notes["C"+String(octave)]
	};
	if (c===37)
	{
		octave-=1
		octave = Math.max(octave,0)
		f = notes["C"+String(octave)]
	};
   	if (c===65)
	{
		f = notes["C"+String(octave)]
	}
	else if (c===87)
	{
		f = notes["C#"+String(octave)]
	}
	else if (c===83)
	{
		f = notes["D"+String(octave)]
	}
	else if (c===69)
	{
		f = notes["D#"+String(octave)]
	}
	else if (c===68)
	{
		f = notes["E"+String(octave)]
	}
	else if (c===70)
	{
		f = notes["F"+String(octave)]
	}
	else if (c===84)
	{
		f = notes["F#"+String(octave)]
	}
	else if (c===71)
	{
		f = notes["G"+String(octave)]
	}
	else if (c===89)
	{
		f = notes["G#"+String(octave)]
	}
	else if (c===72)
	{
		f = notes["A"+String(octave)]
	}
	else if (c===85)
	{
		f = notes["A#"+String(octave)]
	}
	else if (c===74)
	{
		f = notes["B"+String(octave)]
	}
	else if (c===75)
	{
		f = notes["C"+String(octave+1)]
	}
	else if (c===79)
	{
		f = notes["C#"+String(octave+1)]
	}
	else if (c===76)
	{
		f = notes["D"+String(octave+1)]
	}
	else if (c===80)
	{
		f = notes["D#"+String(octave+1)]
	}
	else if (c===32)
	{
		f = 0
	};

	osc.frequency.value = f
}
}