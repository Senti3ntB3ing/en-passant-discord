
import { createTask } from "../parser.js";
import { sweep } from "../components/disappear.js";

createTask({
	name: "disappear", emoji: ":dotted_line_face:", interval: Time.minutes(3),
	description: "Sweeps disappearing messages.",
	execute: () => sweep()
});
