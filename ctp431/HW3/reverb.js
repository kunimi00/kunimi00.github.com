/*

We use two types of audio effect units, feedback delay and reverb, to enrich the synth sound. 
The delay unit is already implemented. 
Your job is adding the reverb based on convolution. 

Regarding the room impulse response, you should pick it up from http://www.openairlib.net/. 

After choosing the impulse response file, ensure that the sampling rate is 44100 Hz/sec. 
Otherwise, resample it using Audition or Audacity. 

Referring to delay.js, implement the convolution reverb in reverb.js file. 

Note that you should rewire the units such that the delay is connected to the reverb, 
and the reverb is to the DAC.

Tip for Reverb: What I mean by implementing reverb.js is creating a Reverb object in the file. 
The object should include a routine that loads the IR sample.

*/


var Reverb = function(context, parameters) {

	this.context = context;

	this.input = context.createGain();

	this.reverbSource = context.createBufferSource();

	this.dryGain = context.createGain();
	this.wetGain = context.createGain();

	this.convolver = context.createConvolver();

    this.parameters = parameters;
    this.wetGain.gain.value = parameters.reverbWetDry;
	this.dryGain.gain.value = (1-parameters.reverbWetDry);

	var ir_file = 'stalbans_a_mono.wav'

	this.loadImpuseResponse(this.convolver, ir_file);

	this.input.connect(this.convolver);
	this.input.connect(this.dryGain);
	
	this.convolver.connect(this.wetGain);

	this.wetGain.connect(this.context.destination);
    this.dryGain.connect(this.context.destination);
    this.input.connect(this.context.destination);

}

Reverb.prototype.loadImpuseResponse = function(convolverNode, ir_file) {
	console.info('loading IR file..');

	var ctx = this.context;

	var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.open('GET', ir_file, true);
	ajaxRequest.responseType = 'arraybuffer';

	ajaxRequest.onload = function() {
		ctx.decodeAudioData(this.response, function(buffer) {
			convolverNode.buffer = buffer;
		});
	};

	ajaxRequest.send();

}

Reverb.prototype.updateParams = function (params, value) {

	switch (params) {	
		case 'reverb_dry_wet':
			this.parameters.reverbWetDry = value;
			this.wetGain.gain.value = value;
			this.dryGain.gain.value = 1 - value;
			break;		
	}
}



