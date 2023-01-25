
import { Time } from '../config.js';
import { createTask } from "../parser.js";
import { sweep } from "../components/disappear.js";

createTask({
	name: "disappear", emoji: ":dotted_line_face:", interval: Time.minutes(7),
	description: "Delete disappearing messages.",
	execute: () => sweep()
});
