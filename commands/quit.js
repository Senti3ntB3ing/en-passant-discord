
import { Roles } from '../config.js';
import { createCommand } from '../parser.js';

createCommand({
	name: 'quit', emoji: '🔌', hidden: true,
	aliases: [ 'shutdown', 'selfdestruct', 'self-destruct' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: () => { Deno.exit(1); }
});
