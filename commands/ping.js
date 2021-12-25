
import { createCommand } from '../parser.js';

createCommand({
	name: 'ping',
	aliases: [ 'pong' ],
	description: 'Pong!',
	permissions: '@everyone',
	execute: (message) => {
		message.send(`Pong ${ Date.now() - message.timestamp }ms`);
	},
});
