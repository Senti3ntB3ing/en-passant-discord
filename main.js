
import {
	createBot, startBot, editBotStatus, sendMessage, GatewayIntents, ActivityTypes
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { enableCachePlugin, enableCacheSweepers }
from "https://deno.land/x/discordeno_cache_plugin@0.0.21/mod.ts";

import { serve } from "https://deno.land/std@0.145.0/http/server.ts";

import {
	parse, text, fetchLog, log, executeTasks, dispatch, reloadActions
} from "./parser.js";
import { Channels, Welcome, Time, Icon, TwitchIcon } from "./config.js";
import { Database } from "./database.js";

import { quote_of_the_day } from "./components/quote.js";

export const PID = Math.floor(Math.random() * 10000);
log("status", "PID " + PID);

// ==== Attachments ========================

import "./attachments/pgn.js";

// ==== Tasks ==============================

//import "./tasks/quote.js";
import "./tasks/schedule.js";
import "./tasks/youtube.js";
import "./tasks/twitch.js";
import "./tasks/reddit.js";
import "./tasks/sweep.js";
import "./tasks/welcome.js";

// ==== Commands ===========================

import "./commands/actions.js";
import "./commands/clear.js";
import "./commands/diagram.js";
import "./commands/links.js";
import "./commands/poll.js";
import "./commands/rating.js";
import "./commands/system.js";

// =========================================

export function setQuoteAction() {
	console.log("Setting quote action.");
	const quote = quote_of_the_day();
	editBotStatus(bot, {
		activities: [{
			name: 'thechessnerdlive',
			type: ActivityTypes.Watching,
			createdAt: Date.now(),
			/*assets: {
				largeImage: Icon,
				largeText: 'The Chess Nerd',
				smallImage: TwitchIcon,
				smallText: 'Watching the stream.'
			},
			buttons: [{
				label: '💜 Watch Together',
				url: 'https://www.twitch.tv/thechessnerdlive',
			}],*/
			url: 'https://www.twitch.tv/thechessnerdlive',
		}],
		since: Date.now(), afk: false, status: 'online'
	});
}

const baseBot = createBot({
	botId: Deno.env.get("ID"),
	token: Deno.env.get("TOKEN"),
	intents: (
		GatewayIntents.Guilds            |
		GatewayIntents.GuildMembers      |
		GatewayIntents.GuildMessages     |
		GatewayIntents.GuildIntegrations |
		GatewayIntents.MessageContent
	),
	events: {
		messageCreate(_bot, message) { parse(message); },
		guildMemberAdd(bot, member, _) {
			const message = Welcome[Math.floor(Math.random() * Welcome.length)];
			sendMessage(
				bot, Channels.general,
				text(`**Welcome** <@${member.id}>, ${message}`)
			).then(({ id }) => Database.push("welcome", {
				id: id.toString(), time: Date.now()
			}));
		},
		interactionCreate(_bot, interaction) { dispatch(interaction); }
	}
});

export const bot = enableCachePlugin(baseBot);
enableCacheSweepers(bot);
log("status", "en-passant ready");
setQuoteAction();

// =========================================

// web server for constant uptime:
serve(_request => {
	return new Response(fetchLog(), {
		headers: { "Content-Type": "text/plain" },
		status: 200
	});
});
log("status", "web server ready");

// tasks interval:
setInterval(executeTasks, Time.minute);

// =========================================

reloadActions();

await startBot(bot);
