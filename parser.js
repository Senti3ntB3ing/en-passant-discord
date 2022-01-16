
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { closest, levenshtein } from './components/levenshtein.js';

import { Name, Prefix, Roles, ColorCodes } from './config.js';
import { bot } from './main.js';

var commands = [ ], primary = [ ], tasks = { };

function handle(command, bot, message) {
	if (command.execute.constructor.name == 'AsyncFunction') {
		command.execute(message, bot).then(result => {
			if (result != undefined) sendMessage(bot, message.channelId, result);
		});
		return;
	}
	const result = command.execute(message, bot);
	if (result != undefined) sendMessage(bot, message.channelId, result);
}

export function parse(bot, message) {
	if (!message.content.startsWith(Prefix)) return;
	const content = message.content.split(/[ \t]+/g)[0].substring(1).toLowerCase();
	for (const command of commands) {
		if (command.name == content ||
			command.aliases.includes(content)) {
			if (command.permissions.includes(Roles.everyone)) {
				handle(command, bot, message);
				return;
			}
			for (const role of message.member.roles) {
				if (command.permissions.includes(role)) {
					handle(command, bot, message);
					return;
				}
			}
		}
	}
	// command not found, check for typos:
	const closestCommand = closest(content, primary);
	const distance = levenshtein(closestCommand, content);
	if (distance <= 2) sendMessage(bot, message.channelId, info(
		'Command Information',
		`ℹ️ There is no command named \`${Prefix}${content}\`.\n` +
		`Did you mean \`${Prefix}${closestCommand}\` instead?`
	));
}

export function createCommand(command) {
	if (typeof command.execute != 'function') return;
	if (command.name == undefined) return;
	if (command.aliases == undefined) command.aliases = [ ];
	if (command.hidden == undefined) command.hidden = false;
	if (command.permissions == undefined) {
		command.permissions = [ Roles.everyone];
	} else if (typeof command.permissions != 'object') {
		command.permissions = [ command.permissions ];
	}
	commands.push(command);
	primary.push(command.name.toLowerCase());
}

export function startTask(task) {
	if (typeof task.execute != 'function') return;
	if (task.name == undefined) return;
	if (typeof task.interval != 'number') return;
	if (task.interval <= 0) return;
	if (tasks[task.name] != undefined) return;
	tasks[task.name] = setInterval(task.execute, task.interval, bot);
}

export function stopTask(task) {
	if (tasks[task] != undefined) {
		clearInterval(tasks[task]);
		tasks.delete(task);
	}
}

export function text(message) { return { content: message }; }

export function card(title, message, color) {
	return {
		embeds: [{
			title: title || Name,
			color: color || ColorCodes.random(),
			description: message || ''
		}]
	};
}

export function error(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.error,
			description: message || ''
		}]
	};
}

export function info(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.info,
			description: message || ''
		}]
	};
}

export function success(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.success,
			description: message || ''
		}]
	};
}

export function warn(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.warn,
			description: message || ''
		}]
	};
}

export function createHelp(title, color) {
	return {
		embeds: [{
			type: 'rich',
			title: title || Name,
			color: color || ColorCodes.random(),
			fields: commands.filter(command => !command.hidden).map(command => {
				return {
					name: `${command.emoji || ''} \`${Prefix}${command.name}\`:`,
					value: command.description || '',
					inline: false
				};
			})
		}]
	};
}
