const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	command({ name, description, on, setup, type }) {
		return {
			type,
			data: (setup || (i => i))(new SlashCommandBuilder()
				.setName(name)
				.setDescription(description)),
			async execute(interaction) {
				let response;
				if (on.constructor.name === 'AsyncFunction') response = await on(interaction);
				else response = on(interaction);
				if (response === undefined) return;
				await interaction.reply(response);
			},
		};
	},
	card(title, description, color) {
		return {
			embeds: [new EmbedBuilder()
				.setTitle(title)
				.setDescription(description)
				.setColor(color || 0x1ABC9C),
			],
		};
	},
};
