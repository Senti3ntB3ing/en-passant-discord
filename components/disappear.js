
// Disappearing Messages

import { Database } from "../database.js";
import { remove, send } from "../parser.js";

export async function disappearing(channel, message) {
	const disappearing = (await Database.get("disappearing")) || [];
	try {
		const m = await send(channel, message);
		disappearing.push({ id: m.id.toString(), channel: channel.toString() });
	} catch { }
	Database.set("disappearing", disappearing);
};

export async function sweep() {
	const disappearing = (await Database.get("disappearing")) || [];
	for (const message of disappearing) {
		const { id, channel } = message;
		try { await remove(BigInt(id), BigInt(channel)); } catch { }
		disappearing.splice(disappearing.indexOf(message), 1);
	}
	Database.set("disappearing", disappearing);
}
