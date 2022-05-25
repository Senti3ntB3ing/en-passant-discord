
import { Option, prefix, command, error, send } from '../parser.js';
import { Chess } from '../components/chess.js';
import { diagram, gif } from '../components/diagram/diagram.js';
import { Channels } from '../config.js';

command({
	name: 'fen', emoji: ':page_with_curl:',
	description: '📋 Displays a chess board diagram from FEN.',
	options: [{
		description: 'Forsyth–Edwards Notation', name: 'fen',
		type: Option.String, required: true,
	}],
	execute: async interaction => {
		const fen = interaction.data.options[0].value.trim();
		const game = new Chess(fen);
		if (game == null || game.fen() != fen)
			return error('Chess diagram', 'Invalid FEN string / position!');
		const title = 'Chess diagram from FEN position';
		let status = '';
		if (game.ended()) {
			if (game.draw()) status = '½-½ ・ DRAW';
			else if (game.checkmate())
				status = game.turn == 'w' ? '0-1 ・ BLACK WON' : '1-0 ・ WHITE WON';
		} else status = game.turn == 'w' ? '◽️ WHITE TO MOVE' : '◾️ BLACK TO MOVE';
		const data = await diagram(game.board, game.turn);
		console.log(data);
		return {
			file: [{
				blob: new Blob([ await diagram(game.board, game.turn) ]),
				name: 'board.png',
			}],
			embeds: [{
				type: 'image', title, color: game.turn == 'w' ? 0xFFFFFF : 0x000000,
				image: { url: 'attachment://board.png', height: 800, width: 800 },
				footer: { text: status },
			}]
		};
	}
});

prefix({
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
