
import { command, card, fetchLog, guild, Option, discriminator } from '../parser.js';
import { Database } from '../database.js';

command({
	name: 'record', emoji: ':bookmark_tabs:',
	description: '🗄 Check the bot status.', options: [],
	execute: () => card('Status Log', '```elm\n' + fetchLog() + '\n```')
});

command({
	name: 'members', emoji: ':hash:', options: [],
	description: '🧮 Count the number of members.',
	execute: async interaction => {
		const g = await guild(interaction.guildId);
		return card('Member Count', `:hash: The server has \`${
			g.approximateMemberCount
		}\` total members.`);
	}
});

command({
	name: 'punish', emoji: ':no_entry:', options: [{
		description: 'Member to punish',
		name: 'member', type: Option.User, required: true
	}, {
		description: 'Type of punishment',
		name: 'type', type: Option.String, required: true,
		choices: [
			{ name: '🚫 Ban', value: 'BAN' },
			{ name: '🛡️ Safety Flag', value: 'SAFE' },
			{ name: '👠 Kick', value: 'KICK' },
			{ name: '🗓️ 1W Timeout', value: '1W-T' },
			{ name: '🗞️ 1D Timeout', value: '1D-T' },
			{ name: '🕰️ 1H Timeout', value: '1H-T' },
			{ name: '🧨 10M Timeout', value: '10M-T' },
			{ name: '⏲️ 5M Timeout', value: '5M-T' },
			{ name: '⏱️ 1M Timeout', value: '1M-T' },
			{ name: '🚸 Warn', value: 'WARN' },
		]
	}, {
		description: 'Reason for punishment',
		name: 'reason', type: Option.String, required: true
	}],
	description: '⛔ Log the punishment of a member.',
	execute: async interaction => {
		const tag = await discriminator(interaction.data.options[0].value);
		const punishment = interaction.data.options[1].value;
		const reason = interaction.data.options[2].value;
		const audit = (await Database.get('audit')) || [];
		audit.push({ tag, punishment, reason });
		await Database.set('audit', audit);
		return card('Punish',
			`:no_entry: Punished \`${tag}\` with \`${punishment}\` for:\n>` +
			reason + '\nhttps://en-passant-twitch.cristian-98.repl.co/audit/'
		);
	}
});
