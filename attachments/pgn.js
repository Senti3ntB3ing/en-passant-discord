
import { PGNURL, Size, control, themes } from '../config.js';
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
		const history = game.history({ verbose: true }).map(
			m => (m.flags.includes('e') ? '$' : '') + // en passant
			(m.san === 'O-O' ? // castling
				(m.color === 'b' ? 'h8f8e8g8' : 'h1f1e1g1') :
				(m.san === 'O-O-O' ?
					(m.color === 'b' ? 'a8d8e8c8' : 'a1d1e1c1') : ( // normal
						m.from + m.to + (m.promotion ? '=' + ( // promotion
							m.color === 'w' ? m.promotion.toUpperCase() : m.promotion.toLowerCase()
						) : '')
					)
				)
			)
		).join(';');
		let data;
		try { data = await fetch(PGNURL + themes.random() + '/white/' + history); } catch { return; }
		console.log(data)
		if (data.status !== 200) return;
		const w = h['White'], b = h['Black'];
		let description = '';
		if (w != undefined && b != undefined)
			description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
		const t = h['TimeControl'];
		if (t != undefined && t != '') description += ` ・ **Clock:** \`${control(t)}\``;
		let status = '';
		if (game.ended()) {
			if (game.draw()) status = '½-½ ・ Draw';
			else if (game.checkmate()) status = (
				game.turn == 'w' ? '0-1 ・ ⬛️ Black Won' : '1-0 ・ ⬜️ White Won'
			);
		}
		const filename = file.filename.replace(/[^A-Za-z0-9_.\-]/g, '_')
			.replace(/\.pgn$/g, '.gif');
		return {
			file: { blob: await data.blob(), name: filename },
			embeds: [{
				type: 'rich', title, description, color: 0xFFFFFF,
				image: { url: 'attachment://' + filename }, footer: { text: status }
			}]
		};
	}
});
