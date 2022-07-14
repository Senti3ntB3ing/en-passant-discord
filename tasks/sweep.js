
import { Channels } from '../config.js';
import { createTask, clear } from '../parser.js';

createTask({
	name: 'sweep', emoji: ':broom:', time: '00:00',
	description: `Sweeps <#${Channels.dev_chat}>'s old messages.`,
	execute: () => clear(Channels.dev_chat, 100)
});
