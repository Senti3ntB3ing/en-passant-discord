
import 'https://deno.land/x/discordeno@13.0.0-rc15/mod.ts';

export const bot = createBot({
    botId: Deno.env['ID'],
    token: Deno.env['TOKEN'],
    /* prefix: "!",
    userIDs: {
        botDevs: [ 393073920867041280, 654894296759009316 ],
        botOwners: [ 393073920867041280 ],
    },*/
    intents: [ 'Guilds', 'GuildMessages', 'GuildVoiceStates' ],
    events: { }
});
