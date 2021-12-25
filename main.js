
import { createBot, startBot } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';
import { enableCachePlugin, enableCacheSweepers } from 'https://deno.land/x/discordeno_cache_plugin@0.0.18/mod.ts';

import { parse } from './parser.js';

import './commands/ping.js';

const baseBot = createBot({
	botId: Deno.env.get('ID'),
	token: Deno.env.get('TOKEN'),
	intents: [ 'Guilds', 'GuildMessages' ],
	events: {
		ready() {
			console.log('en-passant is ready!');
		},
		messageCreate(bot, message) {
			parse(bot, message)
		},
	}
});

const bot = enableCachePlugin(baseBot);

enableCacheSweepers(bot);

await startBot(bot);
