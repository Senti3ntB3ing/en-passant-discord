
import { Channels, Time } from "../config.js";
import { createTask, remove } from "../parser.js";
import { Database } from "../database.js";

/// auto-delete welcome messages after 15 minutes

createTask({
	name: "welcome", emoji: ":broom:", interval: Time.minutes(5),
	description: "Remove overdue welcome messages.",
	execute: async () => {
		// databse fetch key "welcome" and delete all messages:
		const messages = (await Database.get("welcome")) || [];
		for (let i = 0; i < messages.length; i++) {
			const { id, time } = messages[i];
			if (time + Time.minutes(15) < Date.now()) {
				try { remove(BigInt(id), Channels.general); }
				catch { log("error", "failed to remove welcome message"); }
				messages.splice(i, 1);
				i--;
			}
		}
		Database.set("welcome", messages);
	}
});
