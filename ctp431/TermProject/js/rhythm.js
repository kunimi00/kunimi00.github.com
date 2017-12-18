
setRhythm = function (){
	/*
	 KICK
	 */
	var kick = new Tone.MembraneSynth({
		"envelope" : {
			"sustain" : 0,
			"attack" : 0.02,
			"decay" : 0.8
		},
		"octaves" : 10
	}).toMaster();

	var kickPart = new Tone.Loop(function(time){
		kick.triggerAttackRelease("C2", "8n", time);
	}, "2n").start(0);
	

	/*
	 SNARE
	 */
	var snare = new Tone.NoiseSynth({
		"volume" : -5,
		"envelope" : {
			"attack" : 0.001,
			"decay" : 0.2,
			"sustain" : 0
		},
		"filterEnvelope" : {
			"attack" : 0.001,
			"decay" : 0.1,
			"sustain" : 0
		}
	}).toMaster();

	var snarePart = new Tone.Loop(function(time){
		snare.triggerAttack(time);
	}, "2n").start("0 +4n");

	/*
	 BASS
	 */
	var bass = new Tone.MonoSynth({
		"volume" : -10,
		"envelope" : {
			"attack" : 0.1,
			"decay" : 0.3,
			"release" : 2,
		},
		"filterEnvelope" : {
			"attack" : 0.001,
			"decay" : 0.01,
			"sustain" : 0.5,
			"baseFrequency" : 200,
			"octaves" : 2.6
		}
	}).toMaster();

	var bassPart = new Tone.Sequence(function(time, note){
		bass.triggerAttackRelease(note, "16n", time);
	}, ["C2", ["A#2", ["A2", "G#2"]], "G2", ["D2", "G1"]]).start(0);

	bassPart.probability = 0.9;

}





/*

function rhythm_bossanova() {

  var kit = new Tone.MultiPlayer({
			urls:{
			  "kick" : "/samples/505/kick.mp3",
			  "snare" : "/samples/505/snare.mp3",
				"hh" : "/samples/505/hh.mp3",
				"hho" : "/samples/505/hho.mp3",
				"rim" : "/samples/505/rim.wav",
				"ride" : "/samples/505/ride.wav",
			}
	});

  kitPart = new Tone.Part(function(time, value){
	  //start at time, offset sample 0, play for 8n, no repitching, gain
	  kit.start(value, time, 0, "8n", 0, 1);
	   
	},  [
		  ["0:0:0", "kick"],
		  ["0:0:3", "kick"],
		  ["0:0:4", "kick"],
		  ["0:0:7", "kick"],
		  ["0:0:8", "kick"],
		  ["0:0:11", "kick"],
		  ["0:0:12", "kick"],
		  ["0:0:15", "kick"],
		   
		  ["0:0:0", "rim"],
		  ["0:0:3", "rim"],
		  ["0:0:6", "rim"],
		  ["0:0:10", "rim"],
		  ["0:0:13", "rim"],
		   
		  ["0:0:0", "ride"],
		  ["0:0:1", "ride"],
		  ["0:0:2", "ride"],
		  ["0:0:3", "ride"],
		  ["0:0:4", "ride"],
		  ["0:0:5", "ride"],
		  ["0:0:6", "ride"],
		  ["0:0:7", "ride"],
		  ["0:0:8", "ride"],
		  ["0:0:9", "ride"],
		  ["0:0:10", "ride"],
		  ["0:0:11", "ride"],
		  ["0:0:12", "ride"],
		  ["0:0:13", "ride"],
		  ["0:0:14", "ride"],
		  ["0:0:15", "ride"],
		   
		  // ["0:0:1", "hh"],
		  ["0:0:2", "hh"],
		  // ["0:0:3", "hh"],
		   
		  ["0:1:0", "hh"],
		  // ["0:1:1", "hh"],
		  ["0:1:2", "hh"],
		  // ["0:1:3", "hh"],
		   
		  ["0:2:0", "hh"],
		  // ["0:2:1", "hh"],
		  ["0:2:2", "hh"],
		  // ["0:2:3", "hh"],
		   
		  ["0:3:0", "hh"],
		  // ["0:3:1", "hh"],
		  ["0:3:2", "hh"],
		  // ["0:3:3", "hh"]
		]);
		 
  // kitPart.start();
  // kitPart.loop = true;
  // Tone.Transport.start();
   
}

*/
