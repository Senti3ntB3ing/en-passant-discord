
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { ColorCodes, Roles, Channels } from '../config.js';
import { createCommand, card } from '../parser.js';

const links = {
	'Instagram': {
		url: 'https://www.instagram.com/thechessnerd/',
		color: 0xFFFFFF, emoji: ':camera:'
	},
	'Youtube': {
		url: 'https://www.youtube.com/c/thechessnerd', 
		color: 0xFF0000, emoji: ':tv:'
	},
	'Twitch': {
		url: 'https://www.twitch.tv/thechessnerdlive/',
		color: 0x9047FF, emoji: ':gem:'
	},
	'Twitter': {
		url: 'https://twitter.com/thechessnerd',
		color: 0x1D9BF0, emoji: ':bird:'
	},
	'Discord': {
		url: 'https://discord.com/invite/DKHBFF22TJ/',
		color: 0x5765F3, emoji: ':speech_balloon:'
	},
	'chess.com': {
		url: 'https://www.chess.com/club/thechessnerd-exclusive-club',
		color: 0x7FA650, emoji: ':mortar_board:'
	},
	'reddit': {
		url: 'https://www.reddit.com/r/thechessnerd/',
		color: 0xFF4500, emoji: ':robot:'
	},
	'Merch': {
		url: 'https://thechessnerd.com/',
		color: 0x37777F, emoji: ':shopping_bags:'
	},
};

createCommand({
	name: 'streaming', emoji: ':arrow_forward:', hidden: true,
	aliases: [ 'stream' ],
	description: 'Streaming notification.',
	permissions: Roles.moderator,
	execute: message => { sendMessage(message.bot, Channels.notifications, card(
		'Zach is now live on Twitch!',
		`${links['Twitch'].emoji} Hey @everyone, <@${Roles.Zach}> is streaming on __twitch__!\n${links['Twitch'].url}`,
		links['Twitch'].color
	)); }
});

createCommand({
	name: 'links', emoji: ':link:', aliases: [ 'link' ],
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
		'Link to **@thechessnerd** Instagram page',
		links['Instagram'].emoji + ' ' + links['Instagram'].url,
		links['Instagram'].color
	)
});

createCommand({
	name: 'youtube', emoji: links['Youtube'].emoji,
    aliases: [ 'yt' ], hidden: true,
	description: 'Link to __thechessnerd__ Youtube channel.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to thechessnerd Youtube channel',
		links['Youtube'].emoji + ' ' + links['Youtube'].url,
		links['Youtube'].color
	)
});

createCommand({
	name: 'twitch', emoji: links['Twitch'].emoji, hidden: true,
	description: 'Link to __thechessnerd__ Twitch Live.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to thechessnerd Twitch Live',
		links['Twitch'].emoji + ' ' + links['Twitch'].url,
		links['Twitch'].color
	)
});

createCommand({
	name: 'twitter', emoji: links['Twitter'].emoji, hidden: true,
	description: 'Link to **@thechessnerd** Twitter page.',
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
	description: 'Invite link to *thechessnerd* Discord.',
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
	description: 'Link to __/r/thechessnerd__ reddit.',
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
	description: 'Link to __thechessnerd co.__ merch',
	permissions: Roles.everyone,
	execute: () => card(
		'thechessnerd co. Brand',
		links['Merch'].emoji + ' ' + links['Merch'].url,
		links['Merch'].color
	)
});
