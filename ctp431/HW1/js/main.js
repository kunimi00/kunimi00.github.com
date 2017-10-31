/*

*/


// define global variables
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var tempo = 72

var num_insts = 3
var num_notes_per_sequence = 16

var prev_note_seq = new NoteSequence(num_insts, num_notes_per_sequence);
var curr_note_seq = new NoteSequence(num_insts, num_notes_per_sequence);


// set up audio buffers
var buffers = new Array(3); // 0 : kick, 1 : snare, 2 : hihat

// ids to aquire from html elements 
var volume_id = new Array("kickVol","snareVol","hihatVol");
var volume_label_id = new Array("kickVolLabel","snareVolLabel","hihatVolLabel");

// variables to store gain value
var gain_nodes = new Array(3);
var initial_gain = -7.0


// get gain data from html elements 
for (i  = 0; i < 3; i++) {
    // using audio context's gain method
    gain_nodes[i] = audioContext.createGain();
    // get value from the element 
    var vol = document.getElementById(volume_id[i]).value;
    // var vol = initial_gain;
    gain_nodes[i].gain.value = db2gain(vol);

    document.getElementById(volume_label_id[i]).innerHTML = 'Volume:  ' + vol + 'dB';
    document.getElementById("tempoLabel").innerHTML = 'Tempo:  ' + tempo; 
}


// read the wav files and save it to buffer
var kick = new XMLHttpRequest();
kick.open("Get","audio/kick.wav",true);   
kick.responseType = "arraybuffer";
kick.onload = function(){
    audioContext.decodeAudioData(kick.response, function(buffer){buffers[0] = buffer;});
}
kick.send();


var snare = new XMLHttpRequest();
snare.open("Get","audio/snare.wav",true);  
snare.responseType = "arraybuffer";
snare.onload = function(){
    audioContext.decodeAudioData(snare.response, function(buffer){buffers[1] = buffer;});
}
snare.send()

var hihat = new XMLHttpRequest();
hihat.open("Get","audio/hihat.wav",true);  
hihat.responseType = "arraybuffer";
hihat.onload = function(){
    audioContext.decodeAudioData(hihat.response, function(buffer){buffers[2] = buffer;});
}
hihat.send();


// global function to play drum sounds.
function playdrum(i) {
    source = audioContext.createBufferSource();
    source.buffer = buffers[i];
    source.connect(gain_nodes[i]);
    gain_nodes[i].connect(audioContext.destination);

    source.start()
}

function db2gain(changed_db_val) {
    // inverse function of gain to dB
    gain_val = Math.pow(10, changed_db_val/20.0)

    return gain_val
}

function changegain(i,changedvalue){
    gain_nodes[i].gain.value = db2gain(changedvalue);
    document.getElementById(volume_label_id[i]).innerHTML = 'Volume:  ' + changedvalue + 'dB'; 
}

function changetempo(changedtempo){
    document.getElementById("tempoLabel").innerHTML = 'Tempo:  ' + changedtempo; 
    tempo = changedtempo;
}

