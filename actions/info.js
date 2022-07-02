
import { Streamer, StreamerID } from '../config.js';
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
	commands: [ 'so', 'shoutout' ], permissions: 'mod',
	description: 'Shout out to the specified streamer.',
	execute: data => {
		const args = data.message.split(/\s+/);
		if (args.length < 2) return;
		const streamer = args[1].replace(/^@+/, '');
		return `Follow @${streamer} at twitch.tv/${streamer}`;
	}
});

programmable({
	commands: [ 'tos' ], permissions: 'mod',
	description: 'Chess.com terms of service.',
	execute: data => {
		let user = data.message.match(/@(\w+)/);
		if (user == null || user.length < 2)
			return `Please don't suggest moves for the current position as ` +
			`it's against chess.com terms of service. Instead please ask ` +
			`Zach about a possible move after the position has passed`;
		user = user[1];
		return `@${user} please don't suggest moves for the current position ` +
			`as it's against chess.com terms of service. Instead please ask ` +
			`Zach about a possible move after the position has passed`;
	}
});

// https://api.2g.be/twitch/followage/thechessnerdlive/user?format=ymwd)
programmable({
	commands: [ 'followage' ], permissions: 'all',
	description: 'Gets your current follow age.',
	execute: async data => {
		const user = data.username;
		console.log(user);
		console.log(Streamer);
		console.log(`https://api.2g.be/twitch/followage/${Streamer}/${user}/user?format=ymwd`);
		const response = await fetch(
			`https://api.2g.be/twitch/followage/${Streamer}/${user}/user?format=ymwd`
		);
		console.log(response);
		if (response.status != 200) return;
		return '@' + (await response.text()).replace(Streamer + ' ', '');
	}
});
