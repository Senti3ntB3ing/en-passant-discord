
import { createBot, startBot, editBotStatus } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';
import { enableCachePlugin, enableCacheSweepers } from 'https://deno.land/x/discordeno_cache_plugin@0.0.18/mod.ts';

import { parse } from './parser.js';
import { Channels, Welcome, Actions } from './config.js';

// ==== Commands ===========================

import './commands/help.js';
import './commands/ping.js';
import './commands/links.js';
import './commands/clear.js';
import './commands/fen.js';

// =========================================

const baseBot = createBot({
	botId: Deno.env.get('ID'),
	token: Deno.env.get('TOKEN'),
	intents: [ 'Guilds', 'GuildMessages' ],
	events: {
		ready(bot) {
			console.log('en-passant is ready!');
			editBotStatus(bot, {
				activities: [{
					name: Actions[0].status,
					type: Actions[0].type,
					createdAt: Date.now()
				}],
				since: Date.now(),
				afk: false,
				status: 'online'
			});
		},
		messageCreate(bot, message) {
			parse(bot, message)
		},
		guildMemberAdd(bot, member, _) {
			const message = Welcome[Math.floor(Math.random() * Welcome.length)];
			sendMessage(bot, Channels['general'], `Welcome ${member}, ${message}`);
		}
	}
});

const bot = enableCachePlugin(baseBot);

enableCacheSweepers(bot);

await startBot(bot);
