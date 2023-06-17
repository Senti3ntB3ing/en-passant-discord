const { command, card } = require('../utils.js');

module.exports = [
	command({
		type: 'slash',
		name: 'ping',
		description: '🏓 Checks the latency of the bot.',
		on: interaction => card(
			'Ping Command',
			`:ping_pong: **Pong**. Server latency: \`${Date.now() - interaction.createdAt
			}ms\``,
		),
	}),

	command({
		type: 'slash',
		name: 'test',
		description: '🏓 Test Command.',
		setup: args => args.addStringOption(opt => opt
			.setName('top')
			.setDescription('test option')
			.setRequired(true),
		),
		on: (interaction, params) => card(
			'Test Command',
			`You typed: \`${params.getString('top')}\`.`,
		),
	}),
];

/* command({
	name: "members",
	description: "🧮 Count the number of members.",
	execute: async interaction => {
		const g = await guild(interaction.guildId);
		return card("Member Count", `:hash: The server has \`${
			g.approximateMemberCount
		}\` total members.`, undefined, true);
	}
});*/
