
import { live } from '../components/twitch.js';
import { Zach, Channels, Roles, Time, Streamer } from '../config.js';
import { createTask, send, publish, card, streamAction } from '../parser.js';
import { Database } from '../database.js';

const notification = title => ({
	content: `💎 Hey @everyone, <@${Zach}> is streaming on __twitch.tv__!`,
	embeds: [{
		title: "thechessnerdlive", color: 0x9047FF,
		description: `**${title}**\nhttps://www.twitch.tv/thechessnerdlive/`
	}]
});

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
			const cast = streaming !== false;
			Database.set('twitch_live', cast);
			streamAction(cast);
		} else if (typeof streaming === 'string') {
			Database.set('twitch_live', true);
			try {
				const m = await send(Channels.notifications, notification(streaming));
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
