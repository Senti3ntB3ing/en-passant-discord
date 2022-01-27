
import { Roles } from '../config.js';
import { createCommand, card, record } from '../parser.js';

createCommand({
	name: 'status', emoji: '⏳', hidden: true,
	aliases: [ 'log', 'record' ],
	description: 'Check the bot status.',
	permissions: Roles.moderator,
	execute: () => card('Status log', '```\n' + record.join('\n') + '\n```')
});
