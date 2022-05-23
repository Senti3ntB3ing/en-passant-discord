
import { Option, command, card } from '../parser.js';

const links = {
	'Instagram': {
		url: 'https://www.instagram.com/thechessnerd/',
		color: 0xFFFFFF, emoji: '🌌',
		description: 'Link to @thechessnerd Instagram page',
	},
	'Youtube': {
		url: 'https://www.youtube.com/c/thechessnerd', 
		color: 0xFF0000, emoji: '🔻',
		description: 'Link to __thechessnerd__ Youtube channel',
	},
	'Twitch': {
		url: 'https://www.twitch.tv/thechessnerdlive/',
		color: 0x9047FF, emoji: '💎',
		description: 'Link to __thechessnerd__ Twitch Live',
	},
	'tiktok': {
		url: 'https://vm.tiktok.com/ZML7UdM8j/',
		color: 0xFE2C57, emoji: '🎵',
		description: 'Link to __thechessnerd__ tiktok',
	},
	'Twitter': {
		url: 'https://twitter.com/thechessnerd',
		color: 0x1D9BF0, emoji: '🐦',
		description: 'Link to @thechessnerd Twitter page',
	},
	'Discord': {
		url: 'https://discord.com/invite/DKHBFF22TJ/',
		color: 0x5765F3, emoji: '👑',
		description: 'Invite link to *thechessnerd* Discord',
	},
	'Chess.com': {
		url: 'https://www.chess.com/club/thechessnerd-exclusive-club',
		color: 0x7FA650, emoji: '🧩',
		description: 'Invite link to the **chess.com** club',
	},
	'reddit': {
		url: 'https://www.reddit.com/r/thechessnerd/',
		color: 0xFF4500, emoji: '🤖',
		description: 'Link to __/r/thechessnerd__ reddit',
	},
	'Drop': {
		url: 'https://thechessnerd.com/',
		color: 0x37777F, emoji: '🛍',
		description: 'Link to __thechessnerd co.__ merch drops',
	},
};

command({
	name: 'links', emoji: ':link:',
	description: '🔗 List of useful links.',
	options: [{
		description: 'Specific platform link to display.',
		name: 'platform', type: Option.String,
		required: false, choices: Object.keys(links).map(
			name => ({ name: `${links[name].emoji} ${name}`, value: name })
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
				title: '@thechessnerd Community Links',
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
	description: '🗓 Link to __thechessnerd__ Twitch schedule.',
	execute: () => card(
		'Link to thechessnerd Twitch schedule',
		':calendar_spiral: ' + links['Twitch'].url + 'schedule',
		links['Twitch'].color
	)
});

command({
	name: 'invite', emoji: ':tickets:', options: [],
	description: '🎫 Invite link to __thechessnerd__ Discord.',
	execute: () => card(
		'Invite link to __thechessnerd__ Discord.',
		':tickets: ' + links['Discord'].url,
		links['Discord'].color
	)
});
