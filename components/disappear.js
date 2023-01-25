
// Disappearing Messages

import { Database } from "../database.js";
import { remove, send } from "../parser.js";

export async function disappearing(channel, message, minutes = 10) {
	const disappearing = (await Database.get("disappearing")) || [];
	try {
		const m = await send(channel, message);
		disappearing.push({
			id: m.id.toString(), channel: channel.toString(),
			minutes, time: Date.now()
		});
	} catch { }
	Database.set("disappearing", disappearing);
};

export async function sweep() {
	const disappearing = (await Database.get("disappearing")) || [];
	for (const message of disappearing) {
		const { id, channel, minutes, time } = message;
		if (Date.now() - new Date(time) >= minutes * 60 * 1000) {
			try { await remove(BigInt(channel), BigInt(id)); } catch { }
			disappearing.splice(disappearing.indexOf(message), 1);
		}
	}
	Database.set("disappearing", disappearing);
}
