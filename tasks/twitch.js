
import { live } from '../components/twitch.js';
import { Zach, Channels, Roles, Time, Streamer } from '../config.js';
import { createTask, send, publish, card, streamAction } from '../parser.js';
import { Database } from '../database.js';

const Twitch = {
	url: 'https://www.twitch.tv/thechessnerdlive/',
	color: 0x9047FF, emoji: ':gem:'
};

createTask({
	name: 'twitch', emoji: ':gem:', interval: Time.minutes(3),
	description: `Notifies members when <@${Zach}> is streaming.`,
	execute: async () => {
		// if streaming already: update state and don't do anything.
		// else if live: update state and send notification.
		const streaming = await live(Streamer);
		if (streaming == undefined) {
			send(Channels.dev_chat, card(
				'Twitch live detection task',
				`${Twitch.emoji} <@&${Roles.moderator}>s, __twitch__ live detection task is not working!`,
				Twitch.color
			));
		} else if (streaming == null) {
			send(Channels.dev_chat, card(
				'Twitch live detection task',
				`${Twitch.emoji} <@&${Roles.moderator}>s, time to update tokens for __twitch__!`,
				Twitch.color
			));
		} else if (await Database.get('twitch_live')) {
			Database.set('twitch_live', streaming);
			streamAction(streaming == true);
		} else if (streaming) {
			Database.set('twitch_live', true);
			try {
				const m = await send(Channels.notifications, card(
					'Zach is now live on Twitch!',
					`${Twitch.emoji} Hey @everyone, <@${Zach}> is streaming on __twitch__!` +
					`\n${Twitch.url}`,
					Twitch.color
				));
				publish(Channels.notifications, m.id);
			} catch {
				send(Channels.dev_chat, card(
					'Twitch live detection task',
					`${Twitch.emoji} <@&${Roles.moderator}>s __twitch__ detection task crashed!`,
					Twitch.color
				));
			}
		}
	}
});
