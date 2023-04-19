
command({
	name: "puzzle", emoji: "🧮", options: [],
	description: "🧩 Fetch a random .",
	execute: async interaction => {
		const g = await guild(interaction.guildId);
		return card("Member Count", `:hash: The server has \`${
			g.approximateMemberCount
		}\` total members.`, undefined, true);
	}
});