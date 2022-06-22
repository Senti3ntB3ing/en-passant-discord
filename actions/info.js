
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

programmable({
	commands: [ 'so', 'shoutout' ],
	description: 'Shout out to the specified streamer.',
	execute: async data => {
		const args = data.message.split(/\s+/);
		if (args.length < 2) return;
		const streamer = args[1].replace(/^@+/, '');
		return `Follow @${streamer} at twitch.tv/${streamer}`;
	}
});

programmable({
	commands: [ 'tos' ],
	description: 'Chess.com terms of service.',
	execute: async data => {
		const args = data.message.split(/\s+/);
		console.log(args);
		if (args.length < 2) return
			`Please don't suggest moves for the current position as ` +
			`it's against chess.com terms of service. Instead please ask ` +
			`Zach about a possible move after the position has passed`;
		const user = args[1].replace(/^@+/, '');
		return `@${user} please don't suggest moves for the current position ` +
			`as it's against chess.com terms of service. Instead please ask ` +
			`Zach about a possible move after the position has passed`;
	}
});

