
import { Roles } from '../config.js';
import { prefix, tasks, card, error, info } from '../parser.js';

prefix({
	name: 'task', emoji: ':mechanical_arm:',
	description: 'Force the execution of a task.',
	execute: message => {
		if (message.arguments.length == 0)
			return info('Task Command', 'Type `task <name>` to execute a task.');
		else if (message.arguments.length != 1)
			return error('Task Command', 'Expected a valid task name.');
		const name = message.arguments[0];
		if (name in tasks) {
			tasks[name].execute(message.bot);
			return card('Task Command', `${tasks[name].emoji} Task \`${name}\` executed successfully.`);
		} else return error('Task Command', `Task \`${name}\` not found.`);
	}
});
