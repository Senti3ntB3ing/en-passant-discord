import { Option, command, error, card, guild, bless } from "../parser.js";
import { Roles } from "../config.js";

command({
    name: "mod", emoji: ":crossed_swords:",
    description: "Gives a specific person the Moderator Role",
    moderation: true,
    options: [{
        description: "Person to promote to Mod",
        name: "user", type: Option.User,
        required: true
    }],
    execute: async interaction => {
        const options = interaction.data.options[0].options;
        let username = options.name;
        
        try { await bless(guild, username, Roles.moderator); }
        catch { return error("Mod Command", "Unable to add new moderator. Please try again later."); }
        return card(
            "Mod Command",
            `:crossed_swords: Successfully added \`${username}\` to the Moderator role.`,
            undefined, true
        );
    }
});