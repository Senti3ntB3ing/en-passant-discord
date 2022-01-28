
import { getGuild } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Roles } from '../config.js';
import { createCommand, card, record } from '../parser.js';

createCommand({
	name: 'status', emoji: '⏳', hidden: true,
	aliases: [ 'log', 'record' ],
	description: 'Check the bot status.',
	permissions: Roles.moderator,
	execute: () => card('Status Log', '```elm\n' + record.join('\n') + '\n```')
});

createCommand({
	name: 'count', emoji: '#️⃣', hidden: true,
	description: 'Count the number of members.',
	permissions: Roles.moderator,
	execute: async message => {
		const guild = await getGuild(
			message.bot, message.guildId, { counts: true }
		);
		return card(
			'User Count',
			`#️⃣ The server has \`${guild.approximateMemberCount}\` total members.`
		);
	}
});
