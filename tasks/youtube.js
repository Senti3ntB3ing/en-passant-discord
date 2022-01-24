
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { getVideosAfterDate, composeURL } from '../components/youtube.js';
import { Roles, Time, Channels, YTChannel } from '../config.js';
import { createTask, createCommand, card } from '../parser.js';
import { Database } from '../database.js';

createCommand({
	name: 'reset_date', emoji: '🖲', hidden: true,
	description: 'Reset YouTube date.',
	permissions: Roles.moderator,
	execute: () => {
		const date = (new Date()).toISOString();
		Database.set('youtube', date);
		return card('Reset Date', `🖲 Date set to: \`${date}\`.`)
	}
});

createTask({
	name: 'youtube',
	interval: Time.minutes(30),
	execute: bot => {
		// get date of last video:
		const date = Database.get('youtube');
		if (date == null) return;
		// get videos:
		const videos = getVideosAfterDate(Deno.env.get('YTKEY'), YTChannel, new Date(date));
		if (videos == null) return;
		for (const video of videos) {
			try {
				const url = composeURL(video.id.videoId);
				sendMessage(bot, Channels.notifications,
					text(`Hey @everyone, check out <@${Roles.Zach}>'s new video!\n${url}`)
				);
			} catch { }
		}
		Database.set('youtube', (new Date()).toISOString());
	}
});
