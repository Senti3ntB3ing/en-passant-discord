
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

import { getVideosAfterDate, composeURL } from '../components/youtube.js';
import { Roles, Time, Channels } from '../config.js';
import { createTask, text } from '../parser.js';
import { Database } from '../database.js';

createTask({
	name: 'youtube',
	interval: Time.minutes(30),
	execute: async bot => {
		// get date of last video:
		const date = await Database.get('youtube');
		if (date == null) return;
		// get videos:
		const videos = await getVideosAfterDate(
			Deno.env.get('YOUTUBE_KEY'),
			Deno.env.get('YOUTUBE_CHANNEL'),
			new Date(date)
		);
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
