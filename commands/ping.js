
import * as Discord from 'https://deno.land/x/discordeno@13.0.0-rc15/mod.ts';

createCommand({
	name: 'ping',
	description: 'Pong!',
	botChannelPermissions: [ 'SEND_MESSAGES' ],
	execute: (message) => {
		message.send(`Pong ${ Date.now() - message.timestamp }ms`);
	},
});
