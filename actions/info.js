
import { programmable } from '../parser.js';
import { uptime } from '../components/twitch.js';

programmable({
	commands: [ 'uptime' ],
	description: 'Gets the uptime of the stream.',
	execute: async () => `Zach has been streaming for ${await uptime()}.`
});
