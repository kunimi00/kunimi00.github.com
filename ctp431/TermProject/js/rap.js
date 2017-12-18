
setRap = function (){
	var measures_players = [];

	for(i=0; i<measures_buffer.length; i++) {
		var curr_player = new Tone.Player(measures_buffer[i].buffer).toMaster();
		measures_players.push(curr_player);
	}
	console.log(measures_players.length);
	console.log(full_lines_flattened.length);

	var curr_time_notation = "0 +4m"
	var abs_idx = 0;
	for(i=0; i < full_lines.length; i++) {
		curr_time_notation = '0 +4m +' + (4*i).toString() + 'm';
		if (i%2 == 1) {
			curr_time_notation = '0 +4m +' + (4*i).toString() + 'm -8n';
		}

		if (full_lines[i].length <= 8){
			for (j=0; j<full_lines[i].length; j++){
				console.log('line : ' + i);
				console.log('abs_idx : ' + abs_idx);
				console.log(full_lines_flattened[abs_idx]);
				console.log(curr_time_notation);

				measures_players[abs_idx].sync().start(curr_time_notation + '-4n');

				if (full_lines_flattened[abs_idx].length > 4){
					var next_time_notation = curr_time_notation + ' +4n +8n';
				} else {
					var next_time_notation = curr_time_notation + ' +4t';
				}
				curr_time_notation = next_time_notation;

				abs_idx++;
			}

		} else {
			for (j=0; j<full_lines[i].length; j++){
				console.log('line : ' + i);
				console.log('abs_idx : ' + abs_idx);
				console.log(full_lines_flattened[abs_idx]);
				console.log(curr_time_notation);

				measures_players[abs_idx].sync().start(curr_time_notation + '-4n');

				if (full_lines_flattened[abs_idx].length > 4){
					if (Math.random() > 0.5){
						var next_time_notation = curr_time_notation + ' +4n';
					} else {
						var next_time_notation = curr_time_notation + ' +4t';
					}
					
				} else {
					var next_time_notation = curr_time_notation + ' +8n';
				}
				curr_time_notation = next_time_notation;

				abs_idx++;


			}

		}
	}

}	

