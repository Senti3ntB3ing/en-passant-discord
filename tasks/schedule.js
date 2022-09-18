
import { StreamerID, Channels, Time } from '../config.js';
import { createTask, send, error, event, cancel, reschedule }
	from '../parser.js';
import { schedule } from '../components/twitch.js';
import { Database } from '../database.js';

const weeks = Time.week_number;

createTask({
	name: 'schedule', emoji: ':calendar_spiral:', time: '12:55',
	description: 'Adds the streams to the discord events tab.',
	execute: async () => {
		const today = weeks(new Date());
		let segments = await schedule(StreamerID);
		if (segments == null || segments == undefined) {
			send(Channels.dev_chat, error('Twitch Error',
				'The __Twitch.tv__ api returned an error.'
			));
			return;
		}
		segments = segments.segments ?? [];
		segments = segments.filter(s => s.canceled_until == null).map(s => ({
			start: new Date(s.start_time),
			end: new Date(s.end_time),
			title: s.title, id: s.id.toString(),
			recurring: s.is_recurring
		})).filter(s => !s.recurring || weeks(s.start) === today);
		const shadow = (await Database.get('shadow')) ?? [];
		// compare the segments to the shadow:
		for (const segment of segments) {
			const s = shadow.find(s => s.id === segment.id);
			if (s == null || s == undefined)
				segment.event_id = await event(segment);
			else if (s.start !== segment.start || s.end !== segment.end ||
				s.title !== segment.title) reschedule(s.event_id, segment);
		}
		// check for removed segments:
		const remove = [];
		for (const s of shadow) {
			const segment = segments.find(e => e.id === s.id);
			if (segment == null || segment == undefined) {
				cancel(s.event_id); remove.push(s.event_id);
			}
		}
		// remove the removed segments from the shadow:
		Database.set('shadow', shadow.filter(
			s => !remove.includes(s.event_id)
		));
	}
});
