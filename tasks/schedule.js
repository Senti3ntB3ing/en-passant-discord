
import { Twitch_Streamer, Channels } from '../config.js';
import { createTask, send, error, event } from '../parser.js';
import { channel, schedule } from '../components/twitch.js';
import { Database } from '../database.js';

createTask({
	name: 'schedule', emoji: ':calendar_spiral:', time: '12:55',
	description: 'Adds the streams to the discord events tab.',
	execute: async () => {
		let lastEvent = await Database.get('event');
		if (lastEvent == null || lastEvent == undefined) {
			lastEvent = new Date().toISOString();
			await Database.set('event', lastEvent);
		}
		const date_s = new Date(lastEvent);
		const date_e = new Date(lastEvent);
		date_e.setDate(date_e.getDate() + 6);
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
		if (segments.length == 0) return;
		// send the events to the discord channel:
		let lastDate = segments[0].end;
		for (const s of segments) {
			if (s.end > lastDate) lastDate = s.end;
			event(s);
		}
		// save the last event:
		await Database.set('event', lastDate.toISOString());
	}
});
