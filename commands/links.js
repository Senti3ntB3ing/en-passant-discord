
import { Color, Roles } from '../config.js';
import { createCommand } from '../parser.js';

const links = {
	'Instagram': { url: 'https://www.instagram.com/thechessnerd/', emoji: '📷' },
	'Youtube': { url: 'https://www.youtube.com/c/thechessnerd', emoji: '📺' },
	'Twitch': { url: 'https://www.twitch.tv/thechessnerdlive', emoji: '💎' },
	'Twitter': { url: 'https://twitter.com/thechessnerd', emoji: '🐦' },
	'Discord': { url: 'https://discord.com/invite/DKHBFF22TJ', emoji: '💬' },
	'chess.com': { url: 'https://www.chess.com/club/thechessnerd-exclusive-club', emoji: '🎓' },
	'reddit': { url: 'https://www.reddit.com/r/thechessnerd', emoji: '🤖' },
	'Merch': { url: 'https://thechessnerd.com/', emoji: '🛍' },
};

createCommand({
	name: 'links', emoji: '🔗',
    aliases: [ 'link' ],
	description: 'List of useful links.',
	permissions: Roles.everyone,
	execute: _ => ({
		embeds: [{
			type: 'rich',
			title: 'Community Links',
			color: Color.aqua,
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
    aliases: [ 'insta' ],
	description: 'Link to @thechessnerd Instagram page.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Link to @thechessnerd Instagram page',
		links['Instagram'].emoji + ' ' + links['Instagram'].url,
		Color.acqua
	)
});

createCommand({
	name: 'youtube', emoji: links['Youtube'].emoji,
    aliases: [ 'yt' ],
	description: 'Link to thechessnerd Youtube channel.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Link to thechessnerd Youtube channel',
		links['Youtube'].emoji + ' ' + links['Youtube'].url,
		Color.red
	)
});

createCommand({
	name: 'twitch', emoji: links['Twitch'].emoji,
	description: 'Link to thechessnerd Twitch Live.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Link to thechessnerd Twitch Live',
		links['Twitch'].emoji + ' ' + links['Twitch'].url,
		Color.purple
	)
});

createCommand({
	name: 'twitter', emoji: links['Twitter'].emoji,
	description: 'Link to @thechessnerd Twitter page.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Link to @thechessnerd Twitter page',
		links['Twitter'].emoji + ' ' + links['Twitter'].url,
		Color.blue
	)
});

createCommand({
	name: 'discord', emoji: links['Discord'].emoji,
    aliases: [ 'invite' ],
	description: 'Invite link to thechessnerd Discord.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Invite link to thechessnerd Discord',
		links['Discord'].emoji + ' ' + links['Discord'].url,
		Color.blue
	)
});

createCommand({
	name: 'club', emoji: links['chess.com'].emoji,
	description: 'Invite link to the **chess.com** club.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Invite link to the chess.com club',
		links['chess.com'].emoji + ' ' + links['chess.com'].url,
		Color.green
	)
});

createCommand({
	name: 'reddit', emoji: links['reddit'].emoji,
	description: 'Link to /r/thechessnerd reddit.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Link to /r/thechessnerd reddit',
		links['reddit'].emoji + ' ' + links['reddit'].url,
		Color.acqua
	)
});

createCommand({
	name: 'merch', emoji: links['Merch'].emoji,
    aliases: [ 'shop', 'store', 'merchandise' ],
	description: 'Link to thechessnerd co. merch',
	permissions: Roles.everyone,
	execute: _ => card(
		'thechessnerd co. Brand',
		links['Merch'].emoji + ' ' + links['Merch'].url,
		Color.acqua
	)
});
