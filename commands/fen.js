
import { Roles } from '../config.js';
import { createCommand } from '../parser.js';
import { diagram } from '../components/diagram/diagram.js';

createCommand({
	name: 'fen', emoji: '📄',
	aliases: [ 'diagram' ],
	description: 'Display a chess board diagram from **FEN**.',
	permissions: Roles.everyone,
	execute: async _ => ({
		file: {
			blob: new Blob(
				[ await diagram('rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2') ]
			),
			name: 'board.png',
		},
		embeds: [{
			type: 'image',
			title: 'Chess diagram from FEN position',
			color: 0x000000,
			image: { url: 'attachment://board.png' }
		}]
	})
});
