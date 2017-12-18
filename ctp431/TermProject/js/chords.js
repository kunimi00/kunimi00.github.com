
setChords = function (){

	/**
	 *  PIANO
	 */
	var piano = new Tone.PolySynth(4, Tone.Synth, {
		"volume" : -13,
		"oscillator" : {
			"partials" : [1, 2, 1],
		},
		"portamento" : 0.05
	}).toMaster()

	piano = add_reverb(piano);

	var cChord = ["C4", "D#4", "G4", "A#4"];
	var dChord = ["D4", "F#4", "A4", "C5"];
	var gChord = ["A#3", "D4", "F4", "A4"];

	var pianoPart = new Tone.Part(function(time, chord){
		piano.triggerAttackRelease(chord, "8n", time);
	}, [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]).start(0 +4m);

	pianoPart.loop = true;
	pianoPart.loopEnd = "1m";
	pianoPart.humanize = true;

}







var CHORD_FORM_MAJ7 = [0,4,7,11];
var CHORD_FORM_MIN7 = [0,3,7,10];
var CHORD_FORM_DOM7 = [0,4,7,10];

var NATURAL_MINOR_SCALE = [0,2,3,5,7,8,10,12];
var HARMONIC_MINOR_SCALE = [0,2,3,5,7,8,11,12];
var MELODIC_MINOR_SCALE = [0,2,3,5,7,9,11,12];

var MIDI_NUM_NAMES = ["C_1", "C#_1", "D_1", "D#_1", "E_1", "F_1", "F#_1", "G_1", "G#_1", "A_1", "A#_1", "B_1",
					"C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0",
					"C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
					"C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
					"C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
					"C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
					"C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
					"C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
					"C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
					"C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8",
					"C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9"];


function generateChordArray(rootArray, chord_formula_arr, time_interval_arr) {
	
	var midi_idx;
	var currChord = [];
	var currTimeAndChord = [];
	var chordArray = [];
	var toneTime = Tone.Time("32n");

	for(let i=0; i<chord_formula_arr.length; i++) {
		for(let j=0; j<chord_formula_arr[i].length; j++) {
			midi_idx = chord_formula_arr[i][j] + Number(rootArray[i]);
			currChord.push(MIDI_NUM_NAMES[midi_idx]);
		}
		
		// create add time and chord together
		currTimeAndChord.push(toneTime.toNotation());
		currTimeAndChord.push(currChord);

		chordArray.push(currTimeAndChord);

		// now calc the time value for next time
		toneTime = toneTime.add(time_interval_arr[i]);

		// clear the arrays;
		currChord = [];
		currTimeAndChord = [];
	}

	return chordArray;
}

function generateMelodyArray(){

}






