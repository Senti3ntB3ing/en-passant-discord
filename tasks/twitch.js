
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { live } from '../components/twitch.js';
import { Roles, Time, Twitch_Name } from '../config.js';
import { createTask, card } from '../parser.js';

createTask({
	name: 'twitch',
	interval: Time.minutes(5),
	execute: async bot => {
		if (await live(Twitch_Name)) sendMessage(bot, Channels.notifications, card(
			'Zach is now live on Twitch!',
			`${links['Twitch'].emoji} Hey @everyone, <@${Roles.Zach}> is streaming on __twitch__!\n${links['Twitch'].url}`,
			links['Twitch'].color
		));
	}
});
