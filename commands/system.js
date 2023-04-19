
import { RevivalURL } from "../config.js";
import {
	command, send, prefix, card, error, info, tasks,
	guild, Option, snow
} from "../parser.js";
import { PID } from "../main.js";

command({
	name: "ping", emoji: "🏓", options: [],
	description: "🏓 Checks the latency of the bot.",
	execute: interaction => card(
		"Ping Command",
		`:ping_pong: **Pong**. Server latency: \`${
			Date.now() - snow(interaction.id)
		}ms\`, PID: \`${PID}\`.`,
		undefined, true
	),
});

command({
	name: "members", emoji: "🧮", options: [],
	description: "🧮 Count the number of members.",
	execute: async interaction => {
		const g = await guild(interaction.guildId);
		return card("Member Count", `:hash: The server has \`${
			g.approximateMemberCount
		}\` total members.`, undefined, true);
	}
});

command({
	name: "task", emoji: "🦾", options: [{
		name: "name", type: Option.String,
		description: "Specific task to execute",
		required: true
	}],
	description: "🦾 Force the execution of a task.",
	execute: interaction => {
		const name = interaction.data.options[0].value.toLowerCase();
		tasks[name].execute(interaction.bot);
		return card(
			"Task Command",
			`${tasks[name].emoji} Task \`${name}\` executed successfully.`,
			undefined, true // ephemeral
		);
	}
});

prefix({
	name: "shutdown", emoji: ":firecracker:", aliases: [ "die", "kill" ],
	description: "Shutdown the bot.",
	execute: async command => {
		const m = command.text.match(/(\d+)/);
		if (m != null && m.length >= 2) {
			if (m[1] === PID) Deno.exit(1);
			else return;
		}
		await send(command.channelId, error(
			"Shutdown", "The system is now offline.\n" +
			"Emergency revival: " + RevivalURL
		));
		setTimeout(() => Deno.exit(1), 1000);
	}
});

prefix({
	name: "instances", emoji: ":construction:", aliases: [ "threads" ],
	description: "Shows the current thread instances.",
	execute: async command => {
		await send(command.channelId, info(
			"Instances", "Process ID: `" + PID + "`."
		));
	}
});
