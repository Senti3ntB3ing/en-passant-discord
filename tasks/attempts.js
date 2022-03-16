
import { Time } from '../config.js';
import { createTask, resetAttempts } from '../parser.js';

createTask({
	name: 'attempts',
	interval: Time.minutes(5),
	execute: () => resetAttempts()
});
