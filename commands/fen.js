
import { createCommand, error } from '../parser.js';
import { Chess } from '../components/chess.js';
import { stateMessage, gif } from '../components/diagram/diagram.js';

createCommand({
	name: 'fen', emoji: ':page_with_curl:',
	aliases: [ 'diagram', 'black', 'white' ], rate: 3,
	description: 'Display a chess board diagram from **FEN**.',
	execute: async message => {
		const fen = message.text, title = 'Chess diagram from FEN position';
		if (!Chess().validate_fen(fen))
			return error('Chess diagram', 'Invalid FEN string / position!');
		const game = Chess(fen), t = message.command[0];
		return await stateMessage(title, game, t != 'f' ? t : game.turn());
	}
});

createCommand({
	name: 'gif', emoji: ':page_with_curl:', aliases: [ 'pgn' ], rate: 4,
	description: 'Display a chess gif from a list of moves.',
	execute: async message => {
		let moves = message.text.replace(/`/g, '').split(/\s+/g).filter(
			move => !(/^\d+[.)]/.test(move))
		);
		if (moves.length == 0) return error('Chess gif', 'No valid moves provided!');
		let perspective = 'w';
		if (moves[0] == 'white' || moves[0] == 'black') {
			perspective = moves[0][0];
			moves.shift();
		}
		const title = 'Chess gif from moves';
		const data = await gif(moves, perspective);
		if (data == undefined) return error('Chess gif', 'Provided invalid moves!');
		return {
			file: { blob: new Blob([ data ]), name: 'board.gif', },
			embeds: [{
				type: 'rich', title,
				color: perspective == 'w' ? 0xFFFFFF : 0x000000,
				image: { url: 'attachment://board.gif' }
			}]
		};
	}
});
