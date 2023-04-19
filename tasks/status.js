
import { Time } from "../config.js";
import { createTask } from "../parser.js";
import { setQuoteAction } from "../main.js";

createTask({
	name: "status", emoji: "🔶", interval: Time.hours(12),
	description: "Changes the status text.",
	execute: () => setQuoteAction()
});
