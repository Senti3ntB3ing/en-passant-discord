
import { Prefix, RevivalURL } from '../config.js';
import {
	command, send, prefix, card, error, info, tasks,
	guild, Option, snow
} from '../parser.js';
import { PID } from '../main.js';

command({
	name: 'ping', emoji: ':ping_pong:', options: [],
	description: '🏓 Checks the latency of the bot.',
	execute: interaction => card(
		'Ping Command',
		`:ping_pong: **Pong**. Server latency: \`${
			Date.now() - snow(interaction.id)
		}ms\`, PID: \`${PID}\`.`,
		undefined, true
	),
});

command({
	name: 'members', emoji: ':hash:', options: [],
	description: '🧮 Count the number of members.',
	execute: async interaction => {
		const g = await guild(interaction.guildId);
		return card('Member Count', `:hash: The server has \`${
			g.approximateMemberCount
		}\` total members.`, undefined, true);
	}
});

prefix({ // TODO: make it a command?
	name: 'task', emoji: ':mechanical_arm:',
	description: 'Force the execution of a task.',
	execute: message => {
		if (message.arguments.length == 0)
			return info('Task Command', 'Type `' + Prefix + 'task <name>` to execute a task.');
		for (const name of message.arguments) {
			tasks[name].execute(message.bot);
			return info('Task Command', `${tasks[name].emoji} Task \`${name}\` executed successfully.`);
		}
		return error('Task Command', `Task \`${message.arguments[0]}\` not found.`);
	}
});

prefix({
	name: 'shutdown', emoji: ':firecracker:', aliases: [ 'die', 'kill' ],
	description: 'Shutdown the bot.',
	execute: async command => {
		const m = command.text.match(/(\d+)/);
		if (m != null && m.length >= 2) {
			if (m[1] === PID) Deno.exit(1);
			else return;
		}
		await send(command.channelId, error(
			'Shutdown', 'The system is now offline.\n' +
			'Emergency revival: ' + RevivalURL
		));
		setTimeout(() => Deno.exit(1), 1000);
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
