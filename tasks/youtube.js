
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { getVideosAfterDate, composeURL } from '../components/youtube.js';
import { Roles, Time, Channels, YTChannel } from '../config.js';
import { createTask } from '../parser.js';
import { Database } from '../database.js';

createTask({
	name: 'youtube',
	interval: Time.minutes(30),
	execute: bot => {
		// get date of last video:
		const date = Database.get('youtube');
		if (date == null) return;
		// get videos:
		const videos = getVideosAfterDate(Deno.env.get('YTKEY'), YTChannel, new Date(date));
		if (videos == null || videos.length == 0) return;
		for (const video of videos) {
			try {
				const url = composeURL(video.id.videoId);
				sendMessage(bot, Channels.notifications,
					text(`Hey @everyone, check out <@${Roles.Zach}>'s new video!\n${url}`)
				);
			} catch { }
		}
		Database.set('youtube', videos[0].snippet.publishedAt);
	}
});
