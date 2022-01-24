
import { Roles } from '../config.js';
import { createCommand, tasks, card, error, info } from '../parser.js';

createCommand({
	name: 'task', emoji: '⏳', hidden: true,
	description: 'Force the execution of a task.',
	permissions: Roles.moderator,
	execute: message => {
		if (message.arguments.length == 0)
			return info('Task Command', 'Type `task <name>` to execute a task.');
		else if (message.arguments.length != 1)
			return error('Task Command', 'Expected a valid task name.');
		const name = message.arguments[0];
		if (name in tasks) {
			tasks[name].execute(message.bot);
			return card('Task Command', `🦾 Task \`${name}\` executed successfully.`);
		} else return error('Task Command', `Task \`${name}\` not found.`);
	}
});
