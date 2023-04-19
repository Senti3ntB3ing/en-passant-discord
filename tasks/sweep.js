
import { Channels, Time } from "../config.js";
import { createTask, clear } from "../parser.js";

createTask({
	name: "sweep", emoji: ":broom:", interval: Time.day,
	description: `Sweeps <#${Channels.bot_tests}>'s old messages.`,
	execute: () => clear(Channels.bot_tests, 100)
});
