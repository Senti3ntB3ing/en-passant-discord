
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

import { live } from '../components/twitch.js';
import { Channels, Roles, Time, Twitch_Streamer } from '../config.js';
import { createTask, card } from '../parser.js';
import { Database } from '../database.js';

const Twitch = {
	url: 'https://www.twitch.tv/thechessnerdlive/',
	color: 0x9047FF, emoji: ':gem:'
};

createTask({
	name: 'twitch',
	interval: Time.minutes(5),
	execute: async bot => {
		// if streaming already: update state and don't do anything.
		// else if live: update state and send notification.
		const streaming = await live(Twitch_Streamer);
		if (streaming == undefined) {
			sendMessage(bot, Channels.dev_chat, card(
				'Twitch live detection task',
				`${Twitch.emoji} <@${Roles.moderator}>s, __twitch__ live detection task is not working!`,
				Twitch.color
			));
		} else if (streaming == null) {
			sendMessage(bot, Channels.dev_chat, card(
				'Twitch live detection task',
				`${Twitch.emoji} <@${Roles.moderator}>s, time to update tokens for __twitch__!`,
				Twitch.color
			));
		} else if (await Database.get('twitch_live')) {
			Database.set('twitch_live', streaming);
		} else if (streaming) {
			Database.set('twitch_live', true);
			sendMessage(bot, Channels.notifications, card(
				'Zach is now live on Twitch!',
				`${Twitch.emoji} Hey @everyone, <@${Roles.Zach}> is streaming on __twitch__!` +
				`\n${Twitch.url}`,
				Twitch.color
			));
		}
	}
});
