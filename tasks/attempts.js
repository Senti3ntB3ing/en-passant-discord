
import { Time } from '../config.js';
import { createTask, resetAttempts } from '../parser.js';

createTask({
	name: 'attempts',
	emoji: ':no_pedestrians:',
	interval: Time.minutes(5),
	description: 'Resets the anti-spam system.',
	execute: () => resetAttempts()
});
