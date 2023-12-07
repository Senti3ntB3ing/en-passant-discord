
import { Zach, Channels, Roles, Streamer, Time } from "../config.js";
import { createTask, send, publish, error, info, log } from "../parser.js";
import { buildUrl, channel, validate, connect } from "../components/twitch.js";
import { Database } from "../database.js";

function extract(commands) {
	commands = commands.match(/!\w+/g);
	if (commands === null) return "";
	return commands.map(c => '`' + c + '`').join(' ');
}

function is_tourney(title) {
	title = title.toLowerCase();
	return title.includes("tourn") ||
		title.includes("arena") ||
		title.includes("swiss") ||
		title.includes("robin");
}

const notification = (title, category, timestamp) => ({
	content: `💎 Hey guys, <@${Zach}> is streaming ` + (
		is_tourney(title) ? `a <@&${Roles.tournament}> ` : ""
	) + `on <@&${Roles.twitch}>!`,
	embeds: [{
		title: title.replace(/\|/g, '').replace(/\s+/g, ' '),
		color: 0x9047FF,
		url: "https://www.twitch.tv/thechessnerdlive/",
		author: {
			name: "thechessnerdlive",
			url: "https://www.twitch.tv/thechessnerdlive/",
			iconUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/c75cc644-e4ca-4e83-8244-4db8fc84c570-profile_image-70x70.png"
		},
		footer: { text: "Category: " + category },	timestamp,
		description: extract(title),
	}]
});

createTask({
	name: "twitch", emoji: "💎", interval: Time.minute,
	description: `Notifies members when <@${Zach}> is streaming.`,
	execute: async () => {
		// if streaming already: update state and don't do anything.
		// else if live: update state and send notification.
		const streaming = await channel(Streamer);
		if (streaming === undefined || streaming === null) {
			if(!validate()){
				send(Channels.bot_tests, error(
					"Twitch live detection task",
					`<@&${Roles.developer}>s, time to update tokens for __twitch__!`
				));
			} else {
				log(buildUrl);
				send(Channels.bot_tests, info(
					"Twitch live detection task",
					`<@&${Roles.developer}>s, Token has been validated! Try running the __twitch__ task again!`
				));
			}
		} else if (await Database.get("twitch_live")) {
			Database.set("twitch_live", streaming.is_live);
				connect();
		} else if ("is_live" in streaming && streaming.is_live) {
			Database.set("twitch_live", true);
			if(connect()){
				send(Channels.bot_tests, info(
					"Twitch live detection task",
					`<@&${Roles.developer}>s, Bot is now connected to twitch chat!`
				));
			} else {
				send(Channels.bot_tests, error(
					"Twitch live detection task",
					`<@&${Roles.developer}>s, Bot failed to connect to twitch chat!`
				));
			}
			try {
				const m = await send(Channels.notifications, notification(
					streaming.title, streaming.game_name, streaming.started_at
				));
				publish(Channels.notifications, m.id);
				connect();
			} catch {
				send(Channels.bot_tests, error(
					"Twitch live detection task",
					`<@&${Roles.developer}>s __twitch__ detection task crashed!`
				));
			}
		}
	}
});
