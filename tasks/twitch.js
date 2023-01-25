
import { Zach, Channels, Roles, Time, Streamer } from '../config.js';
import { createTask, send, publish, streamAction, error } from '../parser.js';
import { disappearing } from '../components/disappear.js';
import { channel } from '../components/twitch.js';

import { Database } from '../database.js';
const extract = commands => {
	commands = commands.match(/!\w+/g);
	if (commands === null) return '';
	return commands.map(c => '`' + c + '`').join(' ');
};

const notification = (title, category, timestamp) => ({
	content: `💎 Hey @everyone, <@${Zach}> is streaming on __twitch.tv__!`,
	embeds: [{
		title: title.replace(/!\w+|\|/g, '').replace(/\s+/g, ' '),
		color: 0x9047FF,
		url: "https://www.twitch.tv/thechessnerdlive/",
		author: {
			name: "thechessnerdlive",
			url: "https://www.twitch.tv/thechessnerdlive/"
		},
		footer: { text: 'Category: ' + category },	timestamp,
		description: extract(title),
	}]
});

createTask({
	name: 'twitch', emoji: ':gem:', interval: Time.minutes(3),
	description: `Notifies members when <@${Zach}> is streaming.`,
	execute: async () => {
		// if streaming already: update state and don't do anything.
		// else if live: update state and send notification.
		const streaming = await channel(Streamer);
		if (streaming === undefined || streaming === null) {
			disappearing(Channels.dev_chat, error(
				'Twitch live detection task',
				`<@&${Roles.developer}>s, time to update tokens for __twitch__!`
			));
		} else if (await Database.get('twitch_live')) {
			Database.set('twitch_live', streaming.is_live);
			streamAction(streaming, streaming.is_live);
		} else if ('is_live' in streaming && streaming.is_live) {
			Database.set('twitch_live', true);
			try {
				const m = await send(Channels.notifications, notification(
					streaming.title, streaming.game_name, streaming.started_at
				));
				publish(Channels.notifications, m.id);
			} catch {
				disappearing(Channels.dev_chat, error(
					'Twitch live detection task',
					`<@&${Roles.developer}>s __twitch__ detection task crashed!`
				));
			}
		}
	}
});
