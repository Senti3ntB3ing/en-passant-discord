
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

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
		if (await Database.get('twitch_live')) {
			Database.set('twitch_live', await live(Twitch_Streamer));
		} else if (await live(Twitch_Streamer)) {
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
