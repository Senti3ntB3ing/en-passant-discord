
import { readAll } from 'https://deno.land/std@0.150.0/streams/conversion.ts';
import { Chess } from 'https://deno.land/x/beta_chess@v1.0.1/chess.js';

import { FenURL } from '../config.js';
import { Option, command, error } from '../parser.js';

command({
	name: 'fen', emoji: ':page_with_curl:',
	description: '📋 Displays a chess board diagram from FEN.',
	options: [{
		description: 'Forsyth–Edwards Notation', name: 'fen',
		type: Option.String, required: true,
	}, {
		description: 'Perspective of the board',
		name: 'perspective', type: Option.String, required: false,
		choices: [
			{ name: `⬜️ White`, value: 'white' },
			{ name: `⬛️ Black`, value: 'black' }
		]
	}],
	execute: async interaction => {
		const title = 'Chess Diagram';
		const fen = interaction.data.options[0].value.trim();
		const game = new Chess(fen);
		if (game == null || game.fen() != fen) return error(
			'Invalid FEN Positon',
			`**FEN:** \`${fen}\`\n` +
			'https://en.wikipedia.org/wiki/Forsyth–Edwards_Notation'
		);
		let status = '';
		if (game.ended()) {
			if (game.draw()) status = '½-½ ・ Draw';
			else if (game.checkmate())
				status = game.turn == 'w' ? '0-1 ・ ⬛️ Black Won' : '1-0 ・ ⬜️ White Won';
		} else status = game.turn == 'w' ? '⬜️ White to Move' : '⬛️ Black to Move';
		let perspective = game.turn;
		if (interaction.data.options.length > 1)
			perspective = interaction.data.options[1].value[0];
		const diagram = await fetch(FenURL, {
			headers: { 'Content-Type': 'application/json' },
			method: 'GET', body: JSON.stringify({ fen, perspective })
		});
		if (diagram.status != 200) return error(
			'FEN Diagram Issue',
			`**FEN:** \`${fen}\`\n` +
			'There was an issue generating the diagram.'
		);
		const image = await readAll(diagram.body);
		return {
			file: [{ blob: new Blob([ image ]), name: 'board.png' }],
			embeds: [{
				type: 'image', title, color: game.turn == 'w' ? 0xFFFFFF : 0x000000,
				image: { url: 'attachment://board.png', height: 800, width: 800 },
				description: '**FEN: **`' + fen + '`', footer: { text: status },
			}]
		};
	}
});

