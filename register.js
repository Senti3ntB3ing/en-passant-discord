
import { command } from './parser.js';

command({
	name: 'ping',
	command: {
		name: 'ping',
		description: ':ping_pong: Check the latency of the bot.'
	},
	handler: () => console.log('Pong!'),
});

