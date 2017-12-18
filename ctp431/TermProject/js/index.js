
// Main JS part

var ctx = new AudioContext();
var speechData;

var measures_text = [];
var measures_text_flattened = [];
var measures_rhyme = [];
var measures_rhyme_flattend = [];
var measures_buffer = [];

var full_lines = [];
var full_lines_flattened = [];

var curr_measure_voice = [];
var sentences = [];

var lyricToVoice = {}
var tmp_txt;

var lexicon = new RiLexicon();

var curr_time;



document.getElementById("generateRhymes").disabled = true;
document.getElementById("createRap").disabled = true;
document.getElementById("setupSong").disabled = true;
document.getElementById("playSong").disabled = true;
document.getElementById("stopSong").style.display = "none";
Tone.Transport.stop();

// Rap Creation Part


// function changeWidth(element, given_width){
// 	element.style.width = given_width + '%'; 
// }


prepareRap = function(){

	measures_text = [];
	measures_text_flattened = [];
	measures_wordnum = [];

	var lyrics = document.getElementById("lyrics-text").value;
	sentences = RiTa.splitSentences(lyrics);

	var all_word_cnt = 0;
	for (i=0; i<sentences.length; i++) {
		curr_tokens = RiTa.tokenize(RiTa.stripPunctuation(sentences[i]));
		all_word_cnt += curr_tokens.length;
		if (all_word_cnt > 39){
			console.log('too many words.. will be shortened to the first 40 words only.');
			break;
		} else {
			measures_text.push(curr_tokens);
			measures_wordnum.push(curr_tokens.length);
		}
	}

	console.log(measures_text);
	console.log(measures_wordnum);
	console.log("voice config loaded ");

	measures_text_flattened = [].concat.apply([], measures_text);
	console.log(measures_text_flattened.length);

	// if (measures_text_flattened.length > 39){
	// 	console.log('too many words.. will be shortened to the first 80 words only.');
	// 	measures_text_flattened = measures_text_flattened.slice(0,39);
	// }
	// console.log(measures_text_flattened.length);

	lines = [];
	var abs_idx = 0;
	for(i=0; i < measures_text.length; i++) {
		var curr_line = [];
		for (j=0; j<measures_text[i].length; j++){
			console.log(measures_text_flattened[abs_idx]);
			curr_line.push(measures_text_flattened[abs_idx]);
			abs_idx++;
		}
		lines.push(curr_line);
	}

	text_to_show ='';
	for(i=0; i < lines.length; i++){
		console.log(lines[i]);
		text_to_show += lines[i].join(' ') + '.<br><br>';
	}
	document.getElementById("preparedTextContent").innerHTML = '<br>' + text_to_show;
	document.getElementById("prepareRap").disabled = true;
	document.getElementById("generateRhymes").disabled = false;

}

generateRhymes = function(){
	document.getElementById("rhymeGeneratedContent").innerHTML = '<br> <center> <p class="blink_text">Processing rhymes.. Just a sec..! </p></center><br><br>'
	document.getElementById("generateRhymes").disabled = true;
	var rhy_int = setTimeout(getRhymes, 1000);

}

getRhymes = function(){
	measures_rhyme_flattend = [];
	rhyme_arr = [];
	var curr_width = 0;

	for(i=0; i<measures_text_flattened.length; i++) {
		// curr_width += Math.ceil(100. / measures_text_flattened.length);
		// if (curr_width > 100) {
		// 	curr_width = 100;
		// }
		// console.log(curr_width);
		// changeWidth(document.getElementById("rhymeProgressBar"), curr_width);

		if (measures_text_flattened[i].length > 3){
			rhyme_arr = lexicon.rhymes(measures_text_flattened[i])
			if (rhyme_arr.length > 0){
				random_idx = Math.floor(Math.random() * rhyme_arr.length);
				measures_rhyme_flattend.push(rhyme_arr[0]);
			} else{
				measures_rhyme_flattend.push(measures_text_flattened[i]);
			}
		} else {
			measures_rhyme_flattend.push(measures_text_flattened[i]);
		}		
	}


	lines = [];
	var abs_idx = 0;
	for(i=0; i < measures_text.length; i++) {
		var curr_line = [];
		for (j=0; j<measures_text[i].length; j++){
			console.log(measures_rhyme_flattend[abs_idx]);
			curr_line.push(measures_rhyme_flattend[abs_idx]);
			abs_idx++;
		}
		lines.push(curr_line);
	}

	measures_rhyme = lines;

	text_to_show ='';
	for(i=0; i < lines.length; i++){
		console.log(lines[i]);
		text_to_show += measures_text[i].join(' ') + '.<br>';
		text_to_show += '<font color="RoyalBlue">' + measures_rhyme[i].join(' ') + '.</font><br><br>';
	}
	document.getElementById("rhymeGeneratedContent").innerHTML = '<br>' + text_to_show;
	console.log(measures_text_flattened);
	console.log(measures_rhyme_flattend);

	full_lines = [];
	for(i=0; i < measures_text.length; i++) {
		full_lines.push(measures_text[i]);
		full_lines.push(measures_rhyme[i]);
	}
	full_lines_flattened = [].concat.apply([], full_lines);
	document.getElementById("createRap").disabled = false;
}



createRap = function (){ 
	ctx = new AudioContext();
	measures_buffer = [];
	curr_measure_voice = [];
	sentences = [];
	lyricToVoice = {}

	if (!meSpeak.isConfigLoaded()) {
		meSpeak.loadConfig("./lib/mespeak_config.json", function() {
			console.log("config done");
			meSpeak.loadVoice("./lib/voices/en/en.json", function() {
				console.log("mespeak voice loaded");
				generateVoiceData();
			});
		});
	} else {
		generateVoiceData();
	}
}


generateVoiceData = function(){
	function storeInArray(){
		var lyrics_speech_arr = [];
		var curr_width = 0;
		var def = new $.Deferred();
		
		measures_text_flattened = full_lines_flattened;

		(function rec(i) {
			tmp_txt = measures_text_flattened[i];
			speechData = meSpeak.speak(tmp_txt,{pitch: Math.floor(Math.random() * 20 + 60), rawdata: "ArrayBuffer", wordgap: 50, speed: 180,});

			(ctx.decodeAudioData(speechData)).then(function(result) {	
				var source = ctx.createBufferSource();
				source.buffer = result;
				source.connect(ctx.destination);

				lyrics_speech_arr.push(source);
				if (i < measures_text_flattened.length - 1 && result !== undefined){
					console.log(measures_text_flattened[i]);
					console.log(result);
					curr_width += 100. / measures_text_flattened.length;
					if (curr_width > 95) {
						curr_width = 100;
					}
					changeWidth(document.getElementById("rapProgressBar"), curr_width);
					rec(++i);
				} else {
					def.resolve(lyrics_speech_arr);
				}
			});
		})(0);

		return def.promise();
	}

	storeInArray().done(function(result){
		console.log(result);
		// result[0].start();
		measures_buffer = result;
		document.getElementById("createRap").disabled = true;
		document.getElementById("setupSong").disabled = false;
	});

}




// Song Generation Part
// time notation - BARS:QUARTERS:SIXTEENTHS

setupSong = function(){
	document.getElementById("setupSong").disabled = true;
	document.getElementById("playSong").disabled = false;

	Tone.Transport.bpm.value = 108;
	// curr_time = ctx.currentTime();
	setRhythm();
	setChords();
	setRap();
	// Tone.Transport.start(+2.0);
}

playSong = function(){
	// document.getElementById("playSong").disabled = true;
	document.getElementById("playSong").style.display = "none";
	document.getElementById("stopSong").style.display = "block";
	Tone.Transport.start();
}

stopSong = function(){
	document.getElementById("playSong").style.display = "block";
	document.getElementById("stopSong").style.display = "none";
	Tone.Transport.stop();
}









