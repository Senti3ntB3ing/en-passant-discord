
import { Time } from '../config.js';
import { createTask, resetAttempts } from '../parser.js';

createTask({
	name: 'attempts',
	interval: Time.minutes(10),
	execute: () => resetAttempts()
});
