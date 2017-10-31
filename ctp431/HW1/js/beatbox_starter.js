// get audio context from js engine of a certain browser
var context = new (window.AudioContext || window.webkitAudioContext)();

// set up audio buffers
var buffers = new Array(3); // 0 : kick, 1 : snare, 2 : hihat
// ids to aquire from html elements 
var volume_id = new Array("kickVol","snareVol","hihatVol");
var volume_label_id = new Array("kickVolLabel","snareVolLabel","hihatVolLabel");
// variables to store gain value
var gain_nodes = new Array(3);


// get audio gain data from html elements 
for (i  = 0; i < 3; i++) {
    // using audio context's gain method
    gain_nodes[i] = context.createGain();
    // get value from the element 
    var vol = document.getElementById(volume_id[i]).value;
    gain_nodes[i].gain.value = db2gain(vol);

    document.getElementById(volume_label_id[i]).innerHTML = 'Volume:  ' + vol + 'dB';
    document.getElementById("tempoLabel").innerHTML = 'Tempo:  ' + tempo; 
}

var kick = new XMLHttpRequest();
kick.open("Get","audio/kick.wav",true);   
kick.responseType = "arraybuffer";
kick.onload = function(){
    context.decodeAudioData(kick.response, function(buffer){buffers[0] = buffer;});
}
kick.send();

var snare = new XMLHttpRequest();
snare.open("Get","audio/snare.wav",true);  
snare.responseType = "arraybuffer";
snare.onload = function(){
    context.decodeAudioData(snare.response, function(buffer){buffers[1] = buffer;});
}
snare.send();

var hihat = new XMLHttpRequest();
hihat.open("Get","audio/hihat.wav",true);  
hihat.responseType = "arraybuffer";
hihat.onload = function(){
    context.decodeAudioData(hihat.response, function(buffer){buffers[2] = buffer;});
}
hihat.send();


window.onload=function(){
    window.addEventListener('keydown', function (key) {
        keyboardDown(key);
    }, false);

    window.addEventListener('keyup', function (key) {
        keyboardUp(key);
    }, false);
}


function playdrum(i) {
    source = context.createBufferSource();
    source.buffer = buffers[i];

    source.connect(gain_nodes[i]);
    gain_nodes[i].connect(context.destination);

    source.start()
}

function changegain(i,changedvalue){
    gain_nodes[i].gain.value = db2gain(changedvalue);
    document.getElementById(volume_label_id[i]).innerHTML = 'Volume:  ' + changedvalue + 'dB'; 
}

function changetempo(changedtempo){
    document.getElementById("tempoLabel").innerHTML = 'Tempo:  ' + changedtempo; 
}


function db2gain(changed_db_val) {
    // inverse function of gain to dB
    gain_val = Math.pow(10, changed_db_val/20.0)

    return gain_val
}

// keyboard mapping 
function keyboardDown(key) {
    switch (key.keyCode) {
        case 65: //'a'
            var kickpad = document.getElementById("kickPad"); 
            kickpad.className = 'active';
            simulateClick(kickpad);
            break;
        case 83: //'s'
            var snarepad = document.getElementById("snarePad"); 
            snarepad.className = 'active';
            simulateClick(snarepad);
            break;
        case 76: //'l'
            var hihatpad = document.getElementById("hihatPad"); 
            hihatpad.className = 'active';
            simulateClick(hihatpad);
            break;
    }
}

function keyboardUp(key) {
    switch (key.keyCode) {
        case 65: //'a'
            var kickpad = document.getElementById("kickPad"); 
            kickpad.className = '';
            break;
        case 83: //'s'
            var snarepad = document.getElementById("snarePad"); 
            snarepad.className = '';
            break;
        case 76: //'l'
            var hihatpad = document.getElementById("hihatPad"); 
            hihatpad.className = '';
            break;
    }
}

// simulated mousedown on buttons
function simulateClick(element) {
    var event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
}