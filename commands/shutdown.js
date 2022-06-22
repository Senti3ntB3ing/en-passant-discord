
import { prefix, send, info, error } from '../parser.js';

const PID = Math.floor(Math.random() * 10000);

prefix({
	name: 'shutdown', emoji: ':firecracker:', aliases: [ 'die' ],
	description: 'Shutdown the bot.',
	execute: async command => {
		const match = /\s+(\d+)/.test(command.message);
		if (match != null) {
			if (match[1] == PID) {
				await send(command.channelId, info(
					'Shutdown', `The process \`${PID}\` is now offline.` 
				));
				Deno.exit(1);
			}
			return;
		}
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
