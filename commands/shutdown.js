
import { RevivalURL } from '../config.js';
import { prefix, send, info, error } from '../parser.js';
import { PID } from '../main.js';

prefix({
	name: 'shutdown', emoji: ':firecracker:', aliases: [ 'die', 'kill' ],
	description: 'Shutdown the bot.',
	execute: async command => {
		const m = command.text.match(/(\d+)/);
		if (m != null && m.length >= 2) {
			if (m[2] == PID) Deno.exit(1);
			else return;
		}
		await send(command.channelId, error(
			'Shutdown', 'The system is now offline.\n' +
			'It will be back online in a few minutes.\n' +
			'Emergency revival: ' + RevivalURL
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
