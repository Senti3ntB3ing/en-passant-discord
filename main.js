
import {
	createBot, startBot, editBotStatus, sendMessage, GatewayIntents
} from 'https://deno.land/x/discordeno@17.1.0/mod.ts';
import { enableCachePlugin, enableCacheSweepers }
from "https://deno.land/x/discordeno_cache_plugin@0.0.21/mod.ts";

import { serve } from "https://deno.land/std@0.145.0/http/server.ts";

import {
	parse, text, fetchLog, log, executeTasks, dispatch, reloadActions
} from './parser.js';
import { Channels, Welcome, Actions, Time } from './config.js';

export const PID = Math.floor(Math.random() * 10000);
log('status', 'PID ' + PID);

// ==== Attachments ========================

import './attachments/pgn.js';

// ==== Tasks ==============================

import './tasks/disappear.js';
import './tasks/quote.js';
import './tasks/schedule.js';
import './tasks/youtube.js';
import './tasks/twitch.js';
import './tasks/reddit.js';
import './tasks/sweep.js';

// ==== Commands ===========================

import './commands/actions.js';
import './commands/clear.js';
import './commands/diagram.js';
import './commands/links.js';
import './commands/poll.js';
import './commands/rating.js';
// leave last for tasks
import './commands/system.js';

// =========================================

export function setRandomAction() {
	const action = Actions.random();
	editBotStatus(bot, {
		activities: [{
			name: action.status,
			type: action.type,
			createdAt: Date.now()
		}],
		since: Date.now(),
		afk: false,
		status: 'online'
	});
}

const baseBot = createBot({
	botId: Deno.env.get('ID'),
	token: Deno.env.get('TOKEN'),
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
			sendMessage(bot, Channels.general, text(`**Welcome** <@${member.id}>, ${message}`));
		},
		interactionCreate(_bot, interaction) { dispatch(interaction); }
	}
});

export const bot = enableCachePlugin(baseBot);
enableCacheSweepers(bot);
log('status', 'en-passant ready');
setRandomAction();

// =========================================

// web server for constant uptime:
serve(_request => {
	return new Response(fetchLog(), {
		headers: { 'content-type': 'text/plain' },
		status: 200
	});
});
log('status', 'web server ready');

// tasks interval:
setInterval(executeTasks, Time.minutes(5));

// =========================================

reloadActions();

await startBot(bot);
