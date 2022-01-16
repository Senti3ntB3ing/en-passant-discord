
import { createBot, startBot, editBotStatus } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';
import { enableCachePlugin, enableCacheSweepers } from 'https://deno.land/x/discordeno_cache_plugin@0.0.18/mod.ts';

import { serve } from "https://deno.land/std@0.98.0/http/server.ts";

import { parse } from './parser.js';
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
	intents: [ 'Guilds', 'GuildMessages' ],
	events: {
		ready(_) {
			console.log('en-passant is ready!');
			setRandomAction();
		},
		messageCreate(bot, message) {
			parse(bot, message);
			if (Math.random() <= 0.2) setRandomAction();
		},
		guildMemberAdd(bot, member, _) {
			const message = Welcome[Math.floor(Math.random() * Welcome.length)];
			sendMessage(bot, Channels['general'], `Welcome ${member}, ${message}`);
		}
	}
});

export const bot = enableCachePlugin(baseBot);

enableCacheSweepers(bot);

// web server for ping:
const server = serve({ port: 8080 });
(async () => {
	for await (const request of server) request.respond(
		{ status: 200, body: 'Web server ready!' }
	);
})();

await startBot(bot);
