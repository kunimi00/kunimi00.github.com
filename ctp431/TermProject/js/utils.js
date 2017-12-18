
// Util functions

midiToHz = function(midi) {
	return (440 / 32) * (Math.pow(2,((midi - 9) / 12)));
}

changeWidth = function(element, given_width){
	element.style.width = given_width + '%'; 
}

function add_reverb(instrument) {

	var effect1;

	// create effects
	var effect1 = new Tone.Freeverb();
	effect1JSON = {
		"roomSize": 0.4,
		"dampening": 1000,
	    "wet": 0.2
	};
	effect1.set(effect1JSON);

	// make connections
	instrument.connect(effect1);
	effect1.connect(Tone.Master);

	return instrument;

}