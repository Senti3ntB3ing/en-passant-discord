
import { Roles } from './config.js';

var commands = [];

export function parse(message) {
	if (!message.content.startsWith('!')) return;
	const content = message.content.substring(1);
	for (let command of commands) {
		if (command.name == content ||
			command.aliases.includes(content)) {
			if (command.permissions.includes(Roles.everyone)) {
				command.execute(message);
			} else {
				for (let role of message.member.roles) {
					if (command.permissions.includes(role))
						command.execute(message);
				}
			}
			break;
		}
	}
}

export function createCommand(command) {
	if (command.permissions != undefined) {
		if (typeof command.permissions != 'object') {
			command.permissions = [ command.permissions ];
		}
	}
	commands.push(command);
}
