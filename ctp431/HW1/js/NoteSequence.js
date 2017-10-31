
function NoteSequence(num_insts, num_notes_per_sequence){
	
	this.num_insts = num_insts;
	this.num_notes_per_sequence = num_notes_per_sequence;
	
	// initialize note array
	this.note_arr = new Array();
	for (i=0; i<this.num_insts; i++) {		
		this.note_arr[i] = new Array();
	 	for (j=0; j<this.num_notes_per_sequence; j++) {
	  		this.note_arr[i][j]=0;
	 	}
	}
}

