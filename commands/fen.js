
import { createCommand, error } from '../parser.js';
import { Chess } from '../components/chess.js';
import { stateMessage } from '../components/diagram/diagram.js';
import { Roles } from '../config.js';

createCommand({
	name: 'fen', emoji: ':page_with_curl:', permissions: Roles.moderator,
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
