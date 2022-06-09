
import { Twitch_Streamer, Channels } from '../config.js';
import { createTask, send, error, event } from '../parser.js';
import { channel, schedule } from '../components/twitch.js';
import { Database } from '../database.js';

createTask({
	name: 'schedule', emoji: ':calendar_spiral:', time: '12:55',
	description: 'Adds the streams to the discord events tab.',
	execute: async () => {
		// check if today has been fired already
		const now = new Date();
		const isToday = date =>
			date.getDate() == now.getDate() &&
			date.getMonth() == now.getMonth() &&
			date.getFullYear() == now.getFullYear();
		const lastEvent = await Database.get('event');
		await Database.set('event', now.toISOString());
		if (lastEvent == null || lastEvent == undefined ||
			isToday(new Date(lastEvent))) return;
		// fetch the events on the day 1 week from now:
		const date_s = new Date(), date_e = new Date();
		date_s.setDate(date_s.getDate() + 1);
		date_e.setDate(date_e.getDate() + 2);
		const c = await channel(Twitch_Streamer);
		if (c == null || c == undefined) {
			send(Channels.dev_chat, error('Twitch Error',
				'The __Twitch.tv__ api returned an error.'
			));
			return;
		}
		let segments = await schedule(c.id, date_s.toISOString());
		if (segments == null || segments == undefined) {
			send(Channels.dev_chat, error('Twitch Error',
				'The __Twitch.tv__ api returned an error.'
			));
			return;
		}
		segments = segments.segments.filter(s => s.canceled_until == null)
			.map(s => ({
				start: new Date(s.start_time),
				end: new Date(s.end_time), title: s.title
			})).filter(s => s.start < date_e);
		// send the events to the discord channel:
		for (const s of segments) event(s);
	}
});
