
import { createCommand, error } from '../parser.js';
import { Chess } from '../components/chess.js';
import { diagram } from '../components/diagram/diagram.js';

createCommand({
	name: 'fen', emoji: ':page_with_curl:',
	aliases: [ 'diagram', 'black', 'white' ],
	description: 'Display a chess board diagram from **FEN**.',
	execute: async message => {
		const white_to_move = ':white_medium_small_square: WHITE TO MOVE';
		const black_to_move = ':black_medium_small_square: BLACK TO MOVE';
		const fen = message.text;
		if (!Chess().validate_fen(fen))
			return error('Chess diagram', 'Invalid FEN string / position!');
		const game = Chess(fen);
		let status = '';
		if (game.game_over()) {
			if (game.in_draw()) status = '½-½ ・ DRAW';
			else if (game.in_checkmate())
				status = game.turn() == 'w' ? '0-1 ・ BLACK WON' : '1-0 ・ WHITE WON';
		} else status = game.turn() == 'w' ? white_to_move : black_to_move;
		let turn = game.turn();
		if (message.command[0] == 'w') turn = 'w';
		else if (message.command[0] == 'b') turn = 'b';
		return {
			file: {
				blob: new Blob([ await diagram(game.board(), turn)]),
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
