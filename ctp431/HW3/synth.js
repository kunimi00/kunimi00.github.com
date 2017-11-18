	/* 
	
	A simple synth that generates tones with oscillator, filter and amplitude envelope is already implemented in the start-up code. 
	Your mission is adding two types of controllers, 
	LFO (Low Frequency Oscillator) and ENV (Envelope) to it. 

	The LFO is connected to the oscillator frequency to control pitch (i.e. vibrato), 
	and the ENV is connected to the filter cutoff-frequency to control timbre. 

	
	(1) Tip for LFO: 
	
	create an oscillator and a gain node for the LFO. 
	The oscillator controls LFO rate and the gain control LFO depth. 
	Connect the LFO gain (AudioNode) to the frequency of the main oscillator (AudioParam). 

	If you connect AndioNote to AudioParam this way, 
	the output of AudioNote is mixed to the existing value of the AudioParam. 

	That is, it adds vibrato control to the main oscillator. (For more details, refer to AudioParam notes.)


	(2) Tip for Filter Envelope: 

	the way of changing filter cut-off frequency with an envelope is exactly the same as 
	that used for changing the amplitude envelop. 

	Thus, create an object funcion prototype, say "Voice.prototype.triggerFilterEnvelope", 
	which is almost the same as "Voice.prototype.triggerAmpEnvelope" except that 
	the target parameter is filter frequency (i.e. this.filter.frequency).

	*/


// Voice class - should include LPF and LFO procedures

var Voice = function(context, frequency, amplitude, parameters, effect_node) {
	this.context = context;

	// oscillator
	// createOscillator() : method of the BaseAudioContext interface, creates an OscillatorNode
	// OscillatorNode : a source representing a periodic waveform. generates a constant tone.
	this.osc = context.createOscillator()
	
	// onended : property of the OscillatorNode interface 
	// set the event handler for the ended event, which fires when the tone has stopped playing.
	this.osc.onended = function () { 
		this.voiceState = 0;
	};


	// * LFO oscillator
	this.LFOosc = context.createOscillator();
	this.LFOoscDepth = context.createGain();

	this.LFOosc.type = "sine";
	this.LFOosc.frequency.value = parameters.lfoRate; // rate value
	this.LFOoscDepth.gain.value = parameters.lfoDepth; // depth value


	// filter 
	// createBiquadFilter() : method of the BaseAudioContext interface, creates a BiquadFilterNode
	// BiquadFilterNode : a second order filter configurable as several different common filter types.
	this.filter = context.createBiquadFilter();

	// amp envelope
	// createGain() : method of the BaseAudioContext interface, creates a GainNode
	// GainNode : used to control the overall gain (or volume) of the audio graph.
	this.ampEnv = context.createGain();

	// connect
	this.osc.connect(this.filter); // osc to filter node
	this.filter.connect(this.ampEnv); // filter node to gain node.

	//this.ampEnv.connect(context.destination);
	//this.output = this.ampEnv;
	this.ampEnv.connect(effect_node); // gain node to effect node



	this.LFOosc.connect(this.LFOoscDepth);
	// * connect LFO osc to the gain value of GainNode(of the original signal)
	// this.LFOoscDepth.connect(this.ampEnv.gain);
	// * connect LFO osc to the frequency value of the original signal
	this.LFOoscDepth.connect(this.osc.frequency);


	// preset parameters 
	this.osc.frequency.value = frequency;
	this.osc.type = 'square';

	// params for Amp envelope
	this.ampEnvLevel = amplitude;
	this.ampEnvAttackTime = parameters.ampEnvAttackTime;
	this.ampEnvDecayTime = parameters.ampEnvDecayTime;
	this.ampEnvSustainLevel = parameters.ampEnvSustainLevel;
	this.ampEnvReleaseTime = parameters.ampEnvReleaseTime;

	/* 
	params for filter node (LPF)
	The BiquadFilterNode interface represents a simple low-order filter
	 : an AudioNode that can represent different kinds of filters, tone control devices, and graphic equalizers. 
	A BiquadFilterNode always has exactly one input and one output.

	BiquadFilterNode.frequency : an a-rate AudioParam, a double representing a frequency in the current filtering algorithm measured in hertz (Hz).
	lowpassfilter -> cut-off frequency (no gain value used)

	BiquadFilterNode.detune : an a-rate AudioParam representing detuning of the frequency in cents.
	BiquadFilterNode.Q : an a-rate AudioParam, a double representing a Q factor, or quality factor.
	BiquadFilterNode.gain : (read-only) an a-rate AudioParam, a double representing the gain used in the current filtering algorithm.
	BiquadFilterNode.type : a string value defining the kind of filtering algorithm the node is implementing.
	*/

	this.filter.type = 'lowpass';

	this.filterEnvAttackTime = parameters.filterEnvAttackTime;
	this.filterEnvDecayTime = parameters.filterEnvDecayTime;
	this.filterEnvSustainLevel = parameters.filterEnvSustainLevel;
	this.filterEnvReleaseTime = parameters.filterEnvReleaseTime;

	this.filterCutoffFreq = parameters.filterCutoffFreq;
	// this.filterQ = parameters.filterQ;

	this.filter.frequency.value = parameters.filterCutoffFreq;

	// initial values
	this.ampEnv.gain.value = 0.5; // gain value of gain node
	this.voiceState = 0;	



};

Voice.prototype.on = function() {
	this.osc.start();
	this.LFOosc.start();
	this.triggerAmpEnvelope();
	this.triggerFilterEnvelope();

	this.voiceState = 1;
};

Voice.prototype.triggerAmpEnvelope = function() {
	var param = this.ampEnv.gain;
	var now = this.context.currentTime;

	param.cancelScheduledValues(now);

	// attack
	param.setValueAtTime(0, now);
	param.linearRampToValueAtTime(this.ampEnvLevel, now + this.ampEnvAttackTime);

	// decay
	param.linearRampToValueAtTime(this.ampEnvLevel * this.ampEnvSustainLevel, now + this.ampEnvAttackTime + this.ampEnvDecayTime);
};

Voice.prototype.triggerFilterEnvelope = function() {
	var param = this.filter.frequency;
	var now = this.context.currentTime;

	param.cancelScheduledValues(now);

	// attack
	param.setValueAtTime(0, now);
	param.linearRampToValueAtTime(this.filterCutoffFreq, now + this.filterEnvAttackTime);

	// decay
	param.linearRampToValueAtTime(this.filterCutoffFreq * this.filterEnvSustainLevel, now + this.filterEnvAttackTime + this.filterEnvDecayTime);
};



Voice.prototype.off = function() {
	var param = this.ampEnv.gain;
	var now = this.context.currentTime;

	param.cancelScheduledValues(now);
	param.setValueAtTime(param.value, now);
	param.exponentialRampToValueAtTime(0.001, now + this.ampEnvReleaseTime);
	this.osc.stop(now + this.ampEnvReleaseTime);
	this.LFOosc.stop(now + this.ampEnvReleaseTime);
};





// Synth class

var Synth = function(context, parameters) {
	this.context = context;
	this.voices = {};
	this.parameters = parameters;
};

Synth.prototype.noteOn = function(midi_note_number, midi_note_velocity) {
	var frequency = this.midiNoteNumberToFrequency(midi_note_number);
	var amplitude = this.midiNoteVelocityToAmp(midi_note_velocity);

	this.voices[midi_note_number] = new Voice(this.context, frequency, amplitude, this.parameters, this.fx_input);
	this.voices[midi_note_number].on();
};

Synth.prototype.midiNoteNumberToFrequency = function(midi_note_number) {
	var f_ref = 440;
	var n_ref = 57;
	var a = Math.pow(2, 1/12);
	var n = midi_note_number - n_ref;
	var f = f_ref * Math.pow(a, n);

	return f;
};

Synth.prototype.midiNoteVelocityToAmp = function(midi_note_velocity) {

	var min_dB = -30.0;

	// velocity to dB
	var note_dB = midi_note_velocity/128.0*(-min_dB) + min_dB;

	// dB to velocity
	var velocity = Math.pow(10.0, note_dB/20.0);

	return velocity;

};


Synth.prototype.noteOff = function(midi_note_number) {
	this.voices[midi_note_number].off();

};


Synth.prototype.updateParams = function(params, value) {

	switch (params) {
		case 'lfo_rate': 
			this.parameters.lfoRate = value;
			break;	
		case 'lfo_depth': 
			this.parameters.lfoDepth = value;
			break;	

		case 'filter_freq': 
			this.parameters.filterCutoffFreq = value;
			break;	
		case 'filter_env_attack': 
			this.parameters.filterEnvAttackTime = value;
			break;		
		case 'filter_env_decay':
			this.parameters.filterEnvDecayTime = value;
			break;		
		case 'filter_env_sustain':
			this.parameters.filterEnvSustainLevel = value;
			break;		
		case 'filter_env_release':
			this.parameters.filterEnvReleaseTime = value;
			break;		

		case 'amp_attack_time': 
			this.parameters.ampEnvAttackTime = value;
			break;		
		case 'amp_decay_time':
			this.parameters.ampEnvDecayTime = value;
			break;		
		case 'amp_sustain_level':
			this.parameters.ampEnvSustainLevel = value;
			break;		
		case 'amp_release_time':
			this.parameters.ampEnvReleaseTime = value;
			break;		
	}
}

Synth.prototype.connect = function(node) {
	this.fx_input = node.input;
}

