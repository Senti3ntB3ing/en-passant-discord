
import { Roles } from '../config.js';
import {
	Permission, Option, command, success, info,
	card, cards, warn, error, bless, curse, discriminator
} from '../parser.js';
import { getLichessRatings, verifyLichessUser } from '../components/lichess.js';
import { getChess_comRatings, verifyChess_comUser } from '../components/chess_com.js';
import { countries } from '../components/countries.js';
import { Database } from '../database.js';

import { FIDE } from 'https://deno.land/x/fide_rs@v1.0.1/mod.ts';

const platforms = [ 'lichess.org', 'Chess.com', 'FIDE' ];
const names = { 'lichess.org': 'lichess.org', 'chess.com': 'Chess.com', 'fide': 'FIDE' };

const colors = { 'FIDE': 0xF1C40F, 'lichess.org': 0xFFFFFF, 'Chess.com': 0x7FA650 };
const emojis = {
	'FIDE': ':yellow_heart:', 'lichess.org': ':white_heart:',
	'chess.com': ':green_heart:', 'bullet': ':gun:', 'rapid': ':stopwatch:',
	'blitz': ':zap:', 'standard': ':clock:', 'classical': ':hourglass:'
};

const not_linked_info = title => info(
	title, 'You must link an account to use this command.'
);

const highlight = p => (p == 'FIDE' ? '**FIDE**' : `__${p}__`);

const process = (platform, mention) => info(
	names[platform] + ' Instructions',
	`Go on your ${highlight(names[platform])} settings page and add your` + 
	'**Discord** username (`' + mention + '`) to the `location` field.\n' +
	'Type `/verify` to connect your account.\n' +
	'If your username contains spaces or symbols it might not work.\n' +
	'If you need help tag a <@&' + Roles.moderator + '>.'
);

async function fideCard(author, id) {
	const user = await FIDE(id);
	if (user == undefined || user == null) return undefined;
	if (user.country != undefined) user.country = countries[user.country][1];
	user.name = user.name.replace(/^\s*(.*?),\s*(.*?)\s*$/g, '$2 $1');
	return {
		title: 'Ratings - FIDE',
		message: `:star: <@${author}> - ${user.country || '🇺🇳'} ` +
			`\`${user.name}\` **FIDE** ratings:\n` +
			(user.ratings.length > 0 ? user.ratings.map(
				r => `${emojis[r.category]} **${r.category}** \`${r.rating}\``
			).join('** ｜ **') : '`UNR` (Unrated)'),
		color: colors['FIDE']
	};
}

function ratingCard(author, id, platform, ratings) {
	platform = names[platform.toLowerCase()];
	return {
		title: `Ratings - ${platform}`,
		message: `:star: <@${author}> aka \`${id}\` ` + 
			`${highlight(platform)} ratings:\n` +
			ratings.map(
				r => `${emojis[r.category]} **${r.category}** \`${r.rating}\``
			).join('** ｜ **'),
		color: colors[platform]
	};
}

/// verify <platform> <username | id> <@mention>
/// manually verify the given account
/// in case of fide, use fide id instead of username
command({
	name: 'verify', emoji: ':white_check_mark:',
	description: '✅ Manually verify a user platform.',
	permissions: [ Permission.MODERATE_MEMBERS ],
	options: [{
		name: 'platform',
		description: 'The platform to verify',
		type: Option.String, required: true,
		choices: platforms.map(name => ({ name, value: name }))
	}, {
		name: 'username',
		description: 'The username or id of the user',
		type: Option.String, required: true,
	}, {
		name: 'member',
		description: 'The member to verify',
		type: Option.User, required: true,
	}],
	execute: async interaction => {
		const title = 'Account Verification';
		const guild = interaction.guildId;
		const platform = interaction.data.options[0].value;
		const name = interaction.data.options[1].value;
		const tag = interaction.data.options[2].value;
		let member = await Database.get(tag);
		if (member == null) member = { accounts: [ ] };
		switch (platform.toLowerCase()) {
			case 'fide':
				if (member.accounts.find(a => a.platform.toLowerCase() == 'fide') != undefined)
					return warn(title, `<@${tag}> already linked a **FIDE** account!`);
				member.accounts.push({ platform: 'fide', username: name });
				await bless(guild, tag, Roles.platforms['FIDE']);
			break;
			case 'lichess.org':
				if (member.accounts.find(a => a.platform == 'lichess.org') != undefined)
					return warn(title, `<@${tag}> already linked a __lichess.org__ account!`);
				member.accounts.push({ platform: 'lichess.org', username: name });
				await bless(guild, tag, Roles.platforms['lichess.org']);
			break;
			case 'chess.com':
				if (member.accounts.find(a => a.platform == 'chess.com') != undefined)
					return warn(title, `<@${tag}> already linked a __chess.com__ account!`);
				member.accounts.push({ platform: 'chess.com', username: name });
				await bless(guild, tag, Roles.platforms['chess.com']);
			break;
			default: return process;
		}
		await Database.set(tag, member);
		return success(title, `<@${tag}> successfully verified!`);
	}
});

/// ratings <platform>?
command({
	name: 'ratings', emoji: ':sparkles:',
	description: '✨ Displays your current ratings.',
	options: [{
		description: 'Online chess platform',
		name: 'platform', type: Option.String, required: false,
		choices: platforms.map(name => ({ name, value: name })),
	}],
	execute: async interaction => {
		const title = 'Ratings';
		const author = interaction.member.id;
		const member = await Database.get(author);
		if (member == null || member.accounts == undefined ||
			Object.keys(member.accounts).length == 0)
			return not_linked_info(title);
		let data = member.accounts;
		if (data == undefined || data.length == 0)
			return not_linked_info(title);
		if (interaction.data.options != undefined &&
			interaction.data.options.length > 0) {
			const platform = interaction.data.options[0].value.toLowerCase();
			data = data.filter(a => a.platform.toLowerCase() == platform);
		}
		const list = [];
		for (let { platform, username } of data) {
			let ratings = [];
			platform = platform.toLowerCase();
			switch (platform) {
				case 'fide':
					const card = await fideCard(author, username);
					if (card == undefined) continue;
					list.push(card);
					continue;
				break;
				case 'lichess.org':
					ratings = await getLichessRatings(username);
				break;
				case 'chess.com':
					ratings = await getChess_comRatings(username);
				break;
			}
			if (ratings == null || ratings.length == 0) continue;
			list.push(ratingCard(author, username, platform, ratings));
		}
		if (list.length != 0) return cards(list);
		return not_linked_info(title);
	}
});

/// connect <platform> <username>
command({
	name: 'connect', emoji: ':white_check_mark:',
	description: '📥 Connect your online chess accounts.',
	options: [{
		name: 'platform',
		description: 'The platform to connect',
		type: Option.String, required: true,
		choices: [
			{ name: `Chess.com`, value: 'Chess.com' },
			{ name: `lichess.org`, value: 'lichess.org' }
		]
	}, {
		name: 'username',
		description: 'Your username on that platform',
		type: Option.String, required: true,
	}],
	execute: async interaction => {
		const title = 'Connection';
		const guild = interaction.guildId;
		const platform = interaction.data.options[0].value;
		const name = interaction.data.options[1].value;
		const tag = interaction.member.id;
		const discord = await discriminator(tag);
		let member = await Database.get(tag);
		if (member == null) member = { accounts: [ ] };
		let verified = false;
		switch (platform.toLowerCase()) {
			case 'lichess.org':
				if (member.accounts.find(a => a.platform == 'lichess.org') != undefined)
					return warn(title, `You already linked a __lichess.org__ account!`);
				verified = await verifyLichessUser(name, discord);
				if (verified == undefined)
					return warn(title, 'No __lichess.org__ user found with the username `' + name + '`!');
				if (!verified) return cards([
					error(title, 'Verification with __lichess.org__ failed!'),
					process('lichess.org', tag)
				]);
				member.accounts.push({ platform: 'lichess.org', username: name });
				await bless(guild, tag, Roles.platforms['lichess.org']);
			break;
			case 'chess.com':
				if (member.accounts.find(a => a.platform == 'chess.com') != undefined)
					return warn(title, `You already linked a __chess.com__ account!`);
				verified = await verifyChess_comUser(name, discord);
				if (verified == undefined)
					return warn(title, 'No __chess.com__ user found with the username `' + name + '`!');
				if (!verified) return cards([
					error(
						title,
						'Verification with __chess.com__ failed!\n' +
						'The __chess.com__ servers are slow, give it 15 minutes.'
					), process('chess.com', tag)
				]);
				member.accounts.push({ platform: 'chess.com', username: name });
				await bless(guild, tag, Roles.platforms['chess.com']);
			break;
			default: return undefined;
		}
		await Database.set(tag, member);
		return success(title, 'Successfully verified! Type `/ratings` to see your stats.');
	}
});

/// disconnect <platform>?
command({
	name: 'disconnect', emoji: ':no_entry:',
	description: '📤 Disconnect your online chess accounts.',
	options: [{
		name: 'platform',
		description: 'The platform to disconnect',
		type: Option.String, required: false,
		choices: [
			{ name: `Chess.com`, value: 'Chess.com' },
			{ name: `lichess.org`, value: 'lichess.org' }
		]
	}],
	execute: async interaction => {
		const title = 'Disconnection';
		const guild = interaction.guildId;
		const tag = interaction.member.id;
		let member = await Database.get(tag);
		if (member == null)
			return info(title, 'You currently have `0` linked accounts.');
		if (interaction.data.options == undefined ||
			interaction.data.options.length == 0) {
			member.accounts = [];
		} else {
			const platform = interaction.data.options[0].value.toLowerCase();
			switch (platform) {
				case 'lichess.org':
					await curse(guild, tag, Roles.platforms['lichess.org']);
				case 'chess.com':
					await curse(guild, tag, Roles.platforms['chess.com']);
				break;
				default: return process;
			}
			member.accounts = member.accounts.filter(
				a => a.platform.toLowerCase() != platform
			);
		}
		await Database.set(tag, member);
		return info(title, 'You have successfully unlinked your profile(s).');
	}
});

/// challenge <lichess.org | chess.com>
command({
	name: 'challenge', emoji: ':crossed_swords:',
	description: '🔥 Creates a challenge link.',
	options: [{
		description: 'Online chess platform',
		name: 'platform', type: Option.String,
		required: true, choices: [
			{ name: `Chess.com`, value: 'Chess.com' },
			{ name: `lichess.org`, value: 'lichess.org' }
		],
	}],
	execute: async interaction => {
		const title = 'Challenge';
		const member = await Database.get(interaction.member.id);
		if (member == null || member.accounts == undefined ||
			Object.keys(member.accounts).length == 0)
			return not_linked_info(title);
		const platform = interaction.data.options[0].value.toLowerCase();
		const data = member.accounts.find(a => a.platform == platform);
		if (data == undefined) return not_linked_info(title);
		let url = '';
		switch (platform) {
			case 'chess.com':
				url = `https://www.chess.com/live?#time=5m0s0i&game=chess&` +
					`rated=rated&minrating=any&maxrating=any&` +
					`color=random&member=${data.username}`;
			break;
			case 'lichess.org':
				url = `https://lichess.org/?user=${data.username}#friend`;
			break;
		}
		return card(`${title} - ${names[platform]}`, url, colors[platform]);
	}
});
