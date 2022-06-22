
import { prefix, send, info, error } from '../parser.js';
import { PID } from '../main.js';

prefix({
	name: 'shutdown', emoji: ':firecracker:', aliases: [ 'die' ],
	description: 'Shutdown the bot.',
	execute: async command => {
		await send(command.channelId, error(
			'Shutdown', 'The system is now offline.\n' +
			'The bot will be restarted automatically in `3m`.\n' +
			'If absolutely necessary you can restart it with this link:\n' +
			'https://en-passant.deno.dev/'
		));
		Deno.exit(1);
	}
});

prefix({
	name: 'instances', emoji: ':construction:', aliases: [ 'threads' ],
	description: 'Shows the current thread instances.',
	execute: async command => {
		await send(command.channelId, info(
			'Instances', 'Process ID: `' + PID + '`.'
		));
	}
});
