
import { Permission, command, card, fetchLog, guild } from '../parser.js';

command({
	name: 'record', emoji: ':bookmark_tabs:',
	description: '🗄 Check the bot status.', options: [],
	permissions: [ Permission.VIEW_AUDIT_LOG ],
	execute: () => card('Status Log', '```elm\n' + fetchLog() + '\n```')
});

command({
	name: 'members', emoji: ':hash:', options: [],
	description: '🧮 Count the number of members.',
	permissions: [ Permission.MODERATE_MEMBERS ],
	execute: async interaction => {
		const g = await guild(interaction.guildId);
		return card('Member Count', `:hash: The server has \`${
			g.approximateMemberCount
		}\` total members.`);
	}
});
