
import { Size } from '../config.js';
import { gif } from '../components/diagram/diagram.js';
import { attachment, error } from '../parser.js';
import { Chess } from 'https://deno.land/x/beta_chess@v1.0.0/chess.js';

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
		const data = await gif(game);
		let w = pgn.match(/\[White\s+["'](\w+)["']\]/i);
		if (w != null && w.length > 1) w = w[1]; else w = null;
		let b = pgn.match(/\[Black\s+["'](\w+)["']\]/i);
		if (b != null && b.length > 1) b = b[1]; else b = null;
		let description = '';
		if (w != null && b != null) description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
		let t = pgn.match(/\[TimeControl\s+["'](\w+)["']\]/i);
		if (t != null && t.length > 1) description += ` ・ \`${t[1]}s\``;
		let status = '';
		if (game.ended()) {
			if (game.draw()) status = '½-½ ・ Draw';
			else if (game.checkmate())
				status = game.turn == 'w' ? '0-1 ・ ⬛️ Black Won' : '1-0 ・ ⬜️ White Won';
		}
		return {
			file: { blob: new Blob([ data ]), name: 'board.gif', },
			embeds: [{
				type: 'rich', title, description, color: 0xFFFFFF,
				image: { url: 'attachment://board.gif' },
				footer: { text: status }
			}]
		};
	}
});
