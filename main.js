
import * as Discord from 'https://deno.land/x/discordeno@13.0.0-rc15/mod.ts';

Discord.log.info('Loading Environment');

import './bot.js';
import './commands/ping.js';

Discord.log.info('Bot Loaded');
