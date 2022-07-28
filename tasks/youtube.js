
import {
	getVideosAfterDate, composeURL, composeSHARE
} from '../components/youtube.js';
import { Zach, Time, Channels, Roles, card } from '../config.js';
import { createTask, send, publish, text } from '../parser.js';
import { Database } from '../database.js';

const YouTube = { color: 0xFF0000, emoji: '🔻' };

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
				Database.set('yt_video_link', composeSHARE(video.id.videoId));
				Database.set('yt_video_title', video.title);
			} catch {
				send(Channels.dev_chat, card(
					'Youtube video detection task',
					`${YouTube.emoji} <@&${Roles.developer}>s, time to update tokens for __youtube__!`,
					YouTube.color
				));
			}
		}
		Database.set('youtube', (new Date()).toISOString());
	}
});
