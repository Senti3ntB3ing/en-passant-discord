
import { getVideosAfterDate, composeURL } from '../components/youtube.js';
import { Zach, Time, Channels } from '../config.js';
import { createTask, send, publish, text } from '../parser.js';
import { Database } from '../database.js';

createTask({
	name: 'youtube', emoji: ':tv:', interval: Time.minutes(30),
	description: 'Notifies members when a new YT video is out.',
	execute: async () => {
		const date = await Database.get('youtube'); // get date of last video
		if (date == null) return;
		const videos = await getVideosAfterDate(
			Deno.env.get('YOUTUBE_KEY'),
			Deno.env.get('YOUTUBE_CHANNEL'),
			new Date(date)
		);
		if (videos == null) return;
		for (const video of videos) {
			try {
				const url = composeURL(video.id.videoId);
				const m = await send(Channels.notifications, text(
					`Hey @everyone, check out <@${Zach}>'s new video!\n${url}`
				));
				publish(Channels.notifications, m.id);
			} catch { }
		}
		Database.set('youtube', (new Date()).toISOString());
	}
});
