
import { createBot, startBot, editBotStatus } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';
import { enableCachePlugin, enableCacheSweepers } from 'https://deno.land/x/discordeno_cache_plugin@0.0.18/mod.ts';

import { serve } from "https://deno.land/std@0.98.0/http/server.ts";

import { parse, createTaskServer } from './parser.js';
import { Channels, Welcome, Actions } from './config.js';

// ==== Commands ===========================

import './commands/help.js';
import './commands/ping.js';
import './commands/poll.js';
import './commands/links.js';
import './commands/clear.js';
import './commands/fen.js';
import './commands/rating.js';
import './commands/fruit.js';
import './commands/task.js';

// ==== Tasks ==============================

import './tasks/quote.js';

// =========================================

function setRandomAction() {
	const action = Actions[
		Math.floor(Math.random() * Actions.length)
	];
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

export const baseBot = createBot({
	botId: Deno.env.get('ID'),
	token: Deno.env.get('TOKEN'),
	intents: [ 'Guilds', 'GuildMessages', 'GuildMembers' ],
	events: {
		messageCreate(bot, message) {
			parse(bot, message);
			if (Math.random() <= 0.2) setRandomAction();
		},
		guildMemberAdd(bot, member, _) {
			const message = Welcome[Math.floor(Math.random() * Welcome.length)];
			sendMessage(bot, Channels.general, `Welcome ${member}, ${message}`);
		}
	}
});

export const bot = enableCachePlugin(baseBot);
enableCacheSweepers(bot);
console.log('status: en-passant ready');
setRandomAction();

// =========================================

// web server for task execution and ping:
const server = serve({ port: 8080 });
console.log('status: web server ready');
createTaskServer(server, async request => request.respond(
	{ status: 200, body: 'Web server running!' }
));

await startBot(bot);
