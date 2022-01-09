
import { Roles } from '../config.js';
import { createCommand } from '../parser.js';
import { diagram } from '../components/diagram/diagram.js';

createCommand({
	name: 'fen', emoji: '📄',
	aliases: [ 'diagram' ],
	description: 'Display a chess board diagram from **FEN**.',
	permissions: Roles.everyone,
	execute: async message => ({
		file: {
			blob: new Blob([
				await diagram(message.content.replace(/^(.*?)[ \t]+/g, ''))
			]),
			name: 'board.png',
		},
		embeds: [{
			type: 'image',
			title: 'Chess diagram from FEN position',
			color: message.content.includes('w') ? 0xFFFFFF : 0x000000,
			image: { url: 'attachment://board.png' }
		}]
	})
});
