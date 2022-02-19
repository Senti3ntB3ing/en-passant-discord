
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { ColorCodes, Roles, Channels } from '../config.js';
import { createCommand, card, text } from '../parser.js';

const links = {
	'Instagram': { url: 'https://www.instagram.com/thechessnerd/', emoji: '📷', color: 0xFFFFFF },
	'Youtube': { url: 'https://www.youtube.com/c/thechessnerd', emoji: '📺', color: 0xFF0000 },
	'Twitch': { url: 'https://www.twitch.tv/thechessnerdlive', emoji: '💎', color: 0x9047FF },
	'Twitter': { url: 'https://twitter.com/thechessnerd', emoji: '🐦', color: 0x1D9BF0 },
	'Discord': { url: 'https://discord.com/invite/DKHBFF22TJ', emoji: '💬', color: 0x5765F3 },
	'chess.com': { url: 'https://www.chess.com/club/thechessnerd-exclusive-club', emoji: '🎓', color: 0x7FA650 },
	'reddit': { url: 'https://www.reddit.com/r/thechessnerd', emoji: '🤖', color: 0xFF4500 },
	'Merch': { url: 'https://thechessnerd.com/', emoji: '🛍', color: 0x37777F },
};

createCommand({
	name: 'streaming', emoji: '▶️', hidden: true,
	aliases: [ 'stream' ],
	description: 'Streaming notification.',
	permissions: Roles.moderator,
	execute: message => {
		const url = links['Twitch'].url;
		sendMessage(message.bot, Channels.notifications,
			text(`Hey @everyone, <@${Roles.Zach}> is streaming on __twitch__!\n${url}`)
		);
	}
});

createCommand({
	name: 'links', emoji: '🔗', aliases: [ 'link' ],
	description: 'List of useful links.',
	permissions: Roles.everyone,
	execute: () => ({
		embeds: [{
			type: 'rich',
			title: 'Community Links',
			color: ColorCodes.success,
			fields: Object.keys(links).map(name => {
				return {
					name: `${links[name].emoji} **${name}**:`,
					value: links[name].url,
					inline: false
				};
			})
		}]
	})
});

createCommand({
	name: 'instagram', emoji: links['Instagram'].emoji,
    aliases: [ 'insta' ], hidden: true,
	description: 'Link to @thechessnerd Instagram page.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to @thechessnerd Instagram page',
		links['Instagram'].emoji + ' ' + links['Instagram'].url,
		links['Instagram'].color
	)
});

createCommand({
	name: 'youtube', emoji: links['Youtube'].emoji,
    aliases: [ 'yt' ], hidden: true,
	description: 'Link to thechessnerd Youtube channel.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to thechessnerd Youtube channel',
		links['Youtube'].emoji + ' ' + links['Youtube'].url,
		links['Youtube'].color
	)
});

createCommand({
	name: 'twitch', emoji: links['Twitch'].emoji, hidden: true,
	description: 'Link to thechessnerd Twitch Live.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to thechessnerd Twitch Live',
		links['Twitch'].emoji + ' ' + links['Twitch'].url,
		links['Twitch'].color
	)
});

createCommand({
	name: 'twitter', emoji: links['Twitter'].emoji, hidden: true,
	description: 'Link to @thechessnerd Twitter page.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to @thechessnerd Twitter page',
		links['Twitter'].emoji + ' ' + links['Twitter'].url,
		links['Twitter'].color
	)
});

createCommand({
	name: 'discord', emoji: links['Discord'].emoji,
    aliases: [ 'invite' ], hidden: true,
	description: 'Invite link to thechessnerd Discord.',
	permissions: Roles.everyone,
	execute: () => card(
		'Invite link to thechessnerd Discord',
		links['Discord'].emoji + ' ' + links['Discord'].url,
		links['Discord'].color
	)
});

createCommand({
	name: 'club', emoji: links['chess.com'].emoji, hidden: true,
	description: 'Invite link to the **chess.com** club.',
	permissions: Roles.everyone,
	execute: () => card(
		'Invite link to the chess.com club',
		links['chess.com'].emoji + ' ' + links['chess.com'].url,
		links['chess.com'].color
	)
});

createCommand({
	name: 'reddit', emoji: links['reddit'].emoji, hidden: true,
	description: 'Link to /r/thechessnerd reddit.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to /r/thechessnerd reddit',
		links['reddit'].emoji + ' ' + links['reddit'].url,
		links['reddit'].color
	)
});

createCommand({
	name: 'merch', emoji: links['Merch'].emoji, hidden: true,
    aliases: [ 'shop', 'store', 'merchandise', 'drop' ],
	description: 'Link to thechessnerd co. merch',
	permissions: Roles.everyone,
	execute: () => card(
		'thechessnerd co. Brand',
		links['Merch'].emoji + ' ' + links['Merch'].url,
		links['Merch'].color
	)
});
