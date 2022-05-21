
import { CommandTypes, createCommand, command, error } from '../parser.js';
import { Chess } from '../components/chess.js';
import { stateMessage, gif } from '../components/diagram/diagram.js';

/*createCommand({
	name: 'fen', emoji: ':page_with_curl:',
	aliases: [ 'diagram', 'black', 'white' ], rate: 3,
	description: 'Display a chess board diagram from **FEN**.',
	execute: async message => {
		const fen = message.text, title = 'Chess diagram from FEN position';
		if (!Chess.validate(fen))
			return error('Chess diagram', 'Invalid FEN string / position!');
		const game = new Chess(fen), t = message.command[0];
		return await stateMessage(title, game, t != 'f' ? t : game.turn);
	}
});*/

command({
	name: 'fen', emoji: ':page_with_curl:',
	description: '📋 Display a chess board diagram from **FEN**.',
	options: [{
		description: 'Forsyth–Edwards Notation.', name: 'fen',
		type: CommandTypes.String, required: true,
	}],
	execute: async interaction => {
		const fen = interaction.data.options[0].value;
		const game = new Chess(fen);
		if (game == null)
			return error('Chess diagram', 'Invalid FEN string / position!');
		return await stateMessage('Chess diagram from FEN position', game, game.turn);
	}
});

createCommand({
	name: 'gif', emoji: ':page_with_curl:', aliases: [ 'pgn' ], rate: 4,
	description: 'Display a chess gif from a list of moves.',
	execute: async message => {
		const e = error('Chess gif error', 'Provided invalid PGN!');
		let perspective = 'w', pgn;
		if (message.arguments.length == 0) return e;
		const a = message.arguments[0].toLowerCase();
		if (a == 'white' || a == 'black') {
			perspective = a[0];
			pgn = message.text.replace(/^\s*(white|black)\s*/g, '');
		} else pgn = message.text;
		const title = 'Chess gif from moves';
		const data = await gif(pgn, perspective);
		if (data == undefined) return e;
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
