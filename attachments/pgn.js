
import { Size } from '../config.js';
import { gif } from '../components/diagram/diagram.js';
import { createAttachment, error } from '../parser.js';

createAttachment({
	type: 'pgn', emoji: ':clipboard:',
	description: 'Creates a preview of a PGN file.',
	execute: async (_, attachment) => {
		if (attachment.size > Size.kilobytes(20)) return;
		let pgn = await fetch(attachment.url);
		if (pgn.status != 200)
			return error('PGN preview', 'Failed to fetch PGN file!');
		pgn = await pgn.text();
		const data = await gif(pgn);
		if (data == undefined) return error('PGN preview', 'Invalid PGN file!');
		return {
			file: { blob: new Blob([ data ]), name: 'board.gif', },
			embeds: [{
				type: 'rich', title: 'PGN preview',
				color: 0xFFFFFF,
				image: { url: 'attachment://board.gif' }
			}]
		};
	}
});
