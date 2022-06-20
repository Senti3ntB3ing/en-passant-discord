
import { StreamerID } from '../config.js';
import { programmable } from '../parser.js';
import { uptime, sub_count, follow_count } from '../components/twitch.js';

programmable({
	commands: [ 'uptime' ],
	description: 'Gets the uptime of the stream.',
	execute: async () => `Zach has been streaming for ${await uptime()}.`
});

programmable({
	commands: [ 'followers' ],
	description: 'Gets the current number of followers.',
	execute: async () => `Zach has ${await follow_count(StreamerID)} followers.`
});

programmable({
	commands: [ 'subscribers', 'subs', 'subcount' ],
	description: 'Gets the current number of subscribers.',
	execute: async () => `Zach has ${await sub_count(StreamerID)} subscribers.`
});
