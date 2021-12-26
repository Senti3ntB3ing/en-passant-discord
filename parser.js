
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Name, Roles, Colors } from './config.js';

var commands = [];

function handle(command, bot, message) {
	let result = command.execute(message);
	if (result != undefined)
		sendMessage(bot, message.channelId, result);
}

export function parse(bot, message) {
	if (!message.content.startsWith('!')) return;
	const content = message.content.split(/[ \t]+/g)[0].substring(1);
	for (let command of commands) {
		if (command.name == content ||
			command.aliases.includes(content)) {
			if (command.permissions.includes(Roles.everyone)) {
				hanlde(command, bot, message);
				return;
			}
			for (let role of message.member.roles) {
				if (command.permissions.includes(role)) {
					hanlde(command, bot, message);
					return;
				}
			}
		}
	}
}

export function createCommand(command) {
	if (typeof command.execute != 'function') return;
	if (command.name == undefined) return;
	if (command.aliases == undefined) command.aliases = [];
	if (command.permissions == undefined) {
		command.permissions = [ Roles.everyone];
	} else if (typeof command.permissions != 'object') {
		command.permissions = [ command.permissions ];
	}
	if (command.emoji != undefined) command.emoji += ' ';
	commands.push(command);
}

export function text(message) { return { content: message }; }

export function card(title, message, color) {
	return {
		embed: {
			title: title || Name,
			color: color || Colors.random(),
			description: message || ''
		}
	};
}

export function createHelp(title, description, color) {
	return {
		embed: {
			type: 'rich',
			title: title || Name,
			color: color || Colors.random(),
			description: description || '',
			fields: commands.map(command => {
				return {
					name: (command.emoji || '') + command.name,
					value: command.description || '',
					inline: false
				};
			})
		}
	};
}
