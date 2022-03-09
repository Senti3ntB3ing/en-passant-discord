
import { Roles } from '../config.js';
import { createCommand } from '../parser.js';
import { Database } from '../database.js';

createCommand({
	name: 'backup', emoji: ':radioactive:', hidden: true,
	description: 'Backup of the entire **BOT** database.',
	permissions: Roles.moderator,
	execute: async () => ({
		file: {
			blob: new Blob([
				JSON.stringify(await Database.dictionary(), null, '\t')
			]),
			name: 'en-passant.json',
		}
	})
});
