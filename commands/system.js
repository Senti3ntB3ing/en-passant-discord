
import { Prefix, RevivalURL } from '../config.js';
import {
	command, send, prefix, card, error, info, tasks,
	guild, Option, snow
} from '../parser.js';
import { Database } from '../database.js';
import { PID } from '../main.js';

command({
	name: 'ping', emoji: ':ping_pong:', options: [],
	description: '🏓 Checks the latency of the bot.',
	execute: interaction => card(
		'Ping Command',
		`:ping_pong: **Pong**. Server latency: \`${
			Date.now() - snow(interaction.id)
		}ms\`, PID: \`${PID}\`.`
	),
});

command({
	name: 'members', emoji: ':hash:', options: [],
	description: '🧮 Count the number of members.',
	execute: async interaction => {
		const g = await guild(interaction.guildId);
		return card('Member Count', `:hash: The server has \`${
			g.approximateMemberCount
		}\` total members.`);
	}
});

command({
	name: 'punish', emoji: ':no_entry:', options: [{
		description: 'Member to punish',
		name: 'member', type: Option.String, required: true
	}, {
		description: 'Type of punishment',
		name: 'type', type: Option.String, required: true,
		choices: [
			{ name: '🚫 Ban', value: 'BAN' },
			{ name: '🛡️ Safety Flag', value: 'SAFE' },
			{ name: '👠 Kick', value: 'KICK' },
			{ name: '🗓️ 1W Timeout', value: '1W-T' },
			{ name: '🗞️ 1D Timeout', value: '1D-T' },
			{ name: '🕰️ 1H Timeout', value: '1H-T' },
			{ name: '🧨 10M Timeout', value: '10M-T' },
			{ name: '⏲️ 5M Timeout', value: '5M-T' },
			{ name: '⏱️ 1M Timeout', value: '1M-T' },
			{ name: '🚸 Warn', value: 'WARN' },
		]
	}, {
		description: 'Reason for punishment',
		name: 'reason', type: Option.String, required: true
	}],
	description: '⛔ Log the punishment of a member.',
	execute: async interaction => {
		const tag = interaction.data.options[0].value;
		const punishment = interaction.data.options[1].value;
		const reason = interaction.data.options[2].value;
		const audit = (await Database.get('audit')) || [];
		audit.push({ tag, punishment, reason });
		await Database.set('audit', audit);
		return card('Punish',
			`:no_entry: Punished \`${tag}\` with \`${punishment}\` for:\n> ` +
			reason + '\nhttps://ep.cristian-98.repl.co/audit/'
		);
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
			return card('Task Command', `${tasks[name].emoji} Task \`${name}\` executed successfully.`);
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
