
import { Roles } from '../config.js';
import { createCommand, tasks } from '../parser.js';

createCommand({
	name: 'task', emoji: '⏳',
	description: 'Force the execution of a task.',
	permissions: Roles.moderator,
	execute: message => {
		if (message.arguments.length == 0)
			return info('Task Command', 'Type `task <name>` to execute a task.');
		else if (message.arguments.length != 1)
			return error('Task Command', 'Expected a valid task name.');
		const task = tasks.find(t => t.name == message.arguments[0]);
		if (task == undefined)
			return error('Task Command', `Task \`${task}\` not found.`);
		tasks.find(t => t.name == task).execute(message.bot);
	}
});
