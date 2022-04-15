
import { getGuild } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

import { Roles } from '../config.js';
import { createCommand, card, fetchLog } from '../parser.js';

createCommand({
	name: 'record', emoji: ':bookmark_tabs:', hidden: true,
	aliases: [ 'log' ],
	description: 'Check the bot status.',
	permissions: Roles.moderator,
	execute: () => card('Status Log', '```elm\n' + fetchLog() + '\n```')
});

createCommand({
	name: 'count', emoji: ':hash:', hidden: true,
	aliases: [ 'members' ],
	description: 'Count the number of members.',
	permissions: Roles.moderator,
	execute: async message => {
		const guild = await getGuild(message.bot, message.guildId, { counts: true });
		return card(
			'User Count',
			`:hash: The server has \`${guild.approximateMemberCount}\` total members.`
		);
	}
});
