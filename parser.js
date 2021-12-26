
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Roles, Colors } from './config.js';

var commands = [];

function handle(command, bot, message) {
	let result = command.execute(message);
	if (result != undefined)
		sendMessage(bot, message.channelId, result);
}

export function parse(bot, message) {
	if (!message.content.startsWith('!')) return;
	const content = message.content.substring(1);
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
	commands.push(command);
}

export function text(message) {
	return { content: message };
}

export function card(title, message, color) {
	return {
		embed: {
			title: title,
			color: color || Colors.random(),
			description: message
		}
	};
}
