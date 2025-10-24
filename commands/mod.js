import { Option, command, error, card, guild, bless } from "../parser.js";

command({
    name: "mod", emoji: ":crossed_swords:",
    description: "Gives a specific person the Moderator Role",
    options: [{
        description: "Person to promote to Mod",
        name: "Username", type: Option.String,
        required: true,
    }],
    execute: async interaction => {
        const options = interaction.data.options[0].options;
        let username = options.name;
        let modId = '839596287787794502';
        try { await bless(guild, username, modId) }
        catch { return error("Mod Command", "Unable to add new moderator. Please try again later."); }
        return card(
            "Mod Command",
            `:crossed_swords: Successfully added \`${username}\` to the Moderator role.`,
            undefined, true
        );
    }
});