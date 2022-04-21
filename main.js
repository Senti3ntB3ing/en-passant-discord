
import { createBot, startBot, editBotStatus, sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';
import { enableCachePlugin, enableCacheSweepers } from 'https://deno.land/x/discordeno_cache_plugin@0.0.18/mod.ts';

//import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

import { parse, text, log, executeTasks } from './parser.js';
import { Time, Channels, Welcome, Actions } from './config.js';

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
import './commands/shutdown.js';
import './commands/record.js';
import './commands/backup.js';

// ==== Tasks ==============================

import './tasks/quote.js';
import './tasks/youtube.js';
import './tasks/twitch.js';
import './tasks/attempts.js';

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

const baseBot = createBot({
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
			sendMessage(bot, Channels.general, text(`**Welcome** <@${member.id}>, ${message}`));
		}
	}
});

export const bot = enableCachePlugin(baseBot);
enableCacheSweepers(bot);
log('status', 'en-passant ready');
setRandomAction();

// =========================================

/* web server for constant uptime:
serve(async _ => {
	return new Response('web server ready', {
		headers: { 'content-type': 'text/plain' },
		status: 200
	});
});
log('status', 'web server ready');*/

// start 5 minute interval for task execution
setInterval(executeTasks, Time.minutes(5));

await startBot(bot);
