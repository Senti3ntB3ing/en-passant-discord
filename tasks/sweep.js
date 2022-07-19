
import { Channels } from '../config.js';
import { createTask, clear } from '../parser.js';

createTask({
	name: 'sweep', emoji: ':broom:', time: '00:00',
	description: `Sweeps <#${Channels.bot_tests}>'s old messages.`,
	execute: () => clear(Channels.bot_tests, 100)
});
