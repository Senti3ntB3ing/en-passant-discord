
import { Roles } from '../config.js';
import { createCommand, error } from '../parser.js';
import { Chess } from '../components/chess.js';
import { diagram } from '../components/diagram/diagram.js';

createCommand({
	name: 'fen', emoji: '📄',
	aliases: [ 'diagram' ],
	description: 'Display a chess board diagram from **FEN**.',
	permissions: Roles.everyone,
	execute: async message => {
		const fen = message.content.replace(/^(.*?)[ \t]+/g, '');
		if (!Chess().validate_fen(fen))
			return error('Chess diagram', '❌ Error: invalid FEN string!');
		const game = Chess(fen);
		let status = '';
		if (game.game_over()) {
			if (game.in_draw()) status = '½-½ ・ draw';
			else if (game.in_checkmate())
				status = game.turn() == 'w' ? '0-1 ・ black won' : '1-0 ・ white won';
		} else status = game.turn() == 'w' ? 'white to move' : 'black to move';
		return {
			file: {
				blob: new Blob([ await diagram(game.board(), game.turn()) ]),
				name: 'board.png',
			},
			embeds: [{
				type: 'image',
				title: 'Chess diagram from FEN position',
				color: game.turn() == 'w' ? 0xFFFFFF : 0x000000,
				image: { url: 'attachment://board.png' },
				footer: { text: status },
			}]
		};
	}
});
