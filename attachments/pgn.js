
import { PGNURL, Size, control } from '../config.js';
import { attachment, error } from '../parser.js';

import { Chess } from 'https://deno.land/x/beta_chess@v1.0.1/chess.js';

attachment({
	type: 'pgn', emoji: ':clipboard:',
	description: 'Creates a preview of a PGN file.',
	execute: async (_, file) => {
		const title = 'Game Preview';
		if (file.size > Size.kilobytes(20)) return;
		let pgn = await fetch(file.url);
		if (pgn.status != 200)
			return error(title, 'Failed to fetch PGN file!');
		pgn = await pgn.text();
		const game = new Chess();
		if (!game.pgn(pgn)) return error(title, 'Invalid PGN file!');
		const h = game.header();
		const data = await fetch(PGNURL, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST', body: JSON.stringify({ pgn, perspective: "w" })
		});
		const w = h['White'], b = h['Black'];
		let description = '';
		if (w != undefined && b != undefined)
			description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
		const t = h['TimeControl'];
		if (t != undefined && t != '') description += ` ・ \`${control(t)}\``;
		let status = '';
		if (game.ended()) {
			if (game.draw()) status = '½-½ ・ Draw';
			else if (game.checkmate()) status = (
				game.turn == 'w' ? '0-1 ・ ⬛️ Black Won' : '1-0 ・ ⬜️ White Won'
			);
		}
		return {
			file: { blob: await data.blob(), name: 'board.gif', },
			embeds: [{
				type: 'rich', title, description, color: 0xFFFFFF,
				image: { url: 'attachment://board.gif' },
				footer: { text: status }
			}]
		};
	}
});
