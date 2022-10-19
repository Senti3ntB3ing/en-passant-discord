
import { live } from '../components/twitch.js';
import { Zach, Channels, Roles, Time, Streamer } from '../config.js';
import { createTask, send, publish, card, streamAction } from '../parser.js';
import { Database } from '../database.js';

createTask({
	name: 'twitch', emoji: ':gem:', interval: Time.minutes(3),
	description: `Notifies members when <@${Zach}> is streaming.`,
	execute: async () => {
		// if streaming already: update state and don't do anything.
		// else if live: update state and send notification.
		const streaming = await live(Streamer);
		if (streaming === undefined) {
			send(Channels.dev_chat, card(
				'Twitch live detection task',
				`💎 <@&${Roles.moderator}>s, __twitch__ live detection task is not working!`,
				0x9047FF
			));
		} else if (streaming === null) {
			send(Channels.dev_chat, card(
				'Twitch live detection task',
				`💎 <@&${Roles.moderator}>s, time to update tokens for __twitch__!`,
				0x9047FF
			));
		} else if (await Database.get('twitch_live')) {
			Database.set('twitch_live', streaming);
			streamAction(streaming == true);
		} else if (typeof streaming === 'string') {
			Database.set('twitch_live', true);
			try {
				const m = await send(Channels.notifications, card(
					'Zach is now live on Twitch!',
					`💎 Hey @everyone, <@${Zach}> is streaming on __twitch.tv__!\n**` +
					streaming + `**\nhttps://www.twitch.tv/thechessnerdlive/`, 0x9047FF
				));
				publish(Channels.notifications, m.id);
			} catch {
				send(Channels.dev_chat, card(
					'Twitch live detection task',
					`💎 <@&${Roles.moderator}>s __twitch__ detection task crashed!`,
					0x9047FF
				));
			}
		}
	}
});
