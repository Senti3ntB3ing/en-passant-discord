
import { CommandTypes, command, card } from '../parser.js';

const links = {
	'Instagram': {
		url: 'https://www.instagram.com/thechessnerd/',
		color: 0xFFFFFF, emoji: ':milky_way:',
		description: 'Link to @thechessnerd Instagram page.',
	},
	'Youtube': {
		url: 'https://www.youtube.com/c/thechessnerd', 
		color: 0xFF0000, emoji: ':tickets:',
		description: 'Link to __thechessnerd__ Youtube channel.',
	},
	'Twitch': {
		url: 'https://www.twitch.tv/thechessnerdlive/',
		color: 0x9047FF, emoji: ':gem:',
		description: 'Link to __thechessnerd__ Twitch Live.',
	},
	'tiktok': {
		url: 'https://vm.tiktok.com/ZML7UdM8j/',
		color: 0xFE2C57, emoji: ':musical_note:',
		description: 'Link to __thechessnerd__ tiktok.',
	},
	'Twitter': {
		url: 'https://twitter.com/thechessnerd',
		color: 0x1D9BF0, emoji: ':bird:',
		description: 'Link to @thechessnerd Twitter page',
	},
	'Discord': {
		url: 'https://discord.com/invite/DKHBFF22TJ/',
		color: 0x5765F3, emoji: ':crown:',
		description: 'Invite link to *thechessnerd* Discord.',
	},
	'Chess.com': {
		url: 'https://www.chess.com/club/thechessnerd-exclusive-club',
		color: 0x7FA650, emoji: ':mortar_board:',
		description: 'Invite link to the **chess.com** club.',
	},
	'reddit': {
		url: 'https://www.reddit.com/r/thechessnerd/',
		color: 0xFF4500, emoji: ':robot:',
		description: 'Link to __/r/thechessnerd__ reddit',
	},
	'Merch': {
		url: 'https://thechessnerd.com/',
		color: 0x37777F, emoji: ':shopping_bags:',
		description: 'Link to __thechessnerd co.__ merch',
	},
};

command({
	name: 'links', emoji: ':link:',
	description: '🔗 List of useful links.',
	options: [{
		description: 'Number of messages to delete.',
		name: 'count', type: CommandTypes.String,
		required: false, choices: Object.keys(links).map(
			key => ({ name: key, value: key })
		),
	}],
	execute: interaction => {
		if (interaction.data.options != undefined &&
			interaction.data.options.length > 0) {
			const name = interaction.data.options[0].value;
			return card(
				links[name].description,
				`${links[name].emoji} ${links[name].url}`,
				links[name].color
			);
		} else return {
			embeds: [{
				type: 'rich',
				title: 'Community Links',
				color: 0xFFFFFF,
				fields: Object.keys(links).map(name => ({
					name: `${links[name].emoji} **${name}**:`,
					value: links[name].url,
					inline: false
				}))
			}]
		};
	}
});

command({
	name: 'schedule', emoji: ':calendar_spiral:', options: [],
	description: 'Link to __thechessnerd__ Twitch schedule.',
	execute: () => card(
		'Link to thechessnerd Twitch schedule',
		':calendar_spiral: ' + links['Twitch'].url + 'schedule',
		links['Twitch'].color
	)
});

/*createCommand({
	name: 'links', emoji: ':link:', aliases: [ 'link' ],
	description: 'List of useful links.',
	permissions: Roles.everyone,
	execute: () => ({
		embeds: [{
			type: 'rich',
			title: 'Community Links',
			color: ColorCodes.normal,
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
	name: 'schedule', emoji: links['Twitch'].emoji, hidden: true,
	description: 'Link to __thechessnerd__ Twitch schedule.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to thechessnerd Twitch schedule',
		':calendar_spiral: ' + links['Twitch'].url + 'schedule',
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
	name: 'club', emoji: links['Chess.com'].emoji, hidden: true,
	description: 'Invite link to the **chess.com** club.',
	permissions: Roles.everyone,
	execute: () => card(
		'Invite link to the chess.com club',
		links['Chess.com'].emoji + ' ' + links['Chess.com'].url,
		links['Chess.com'].color
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
    aliases: [ 'shop', 'store', 'drop' ],
	description: 'Link to __thechessnerd co.__ merch',
	permissions: Roles.everyone,
	execute: () => card(
		'thechessnerd co. Brand',
		links['Merch'].emoji + ' ' + links['Merch'].url,
		links['Merch'].color
	)
});

createCommand({
	name: 'tiktok', emoji: links['tiktok'].emoji, hidden: true,
	description: 'Link to __thechessnerd__ tiktok.',
	permissions: Roles.everyone,
	execute: () => card(
		'Link to thechessnerd tiktok',
		links['tiktok'].emoji + ' ' + links['tiktok'].url,
		links['tiktok'].color
	)
});
*/