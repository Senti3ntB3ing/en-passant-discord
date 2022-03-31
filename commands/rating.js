
import { Roles, ColorCodes } from '../config.js';
import { createCommand, success, info, card, cards, warn, error } from '../parser.js';
import { getLichessRatings, verifyLichessUser } from '../components/lichess.js';
import { getChess_comRatings, verifyChess_comUser } from '../components/chess_com.js';

import { Database } from '../database.js';

import { addRole, removeRole } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

const colors = { 'FIDE': 0xF1C40F, 'lichess.org': 0xFFFFFF, 'chess.com': 0x7FA650 };
const emojis = {
	'FIDE': ':yellow_heart:', 'lichess.org': ':white_heart:', 'chess.com': ':green_heart:',
	'bullet': ':gun:', 'rapid': ':clock:', 'blitz': ':zap:'
};

const not_linked_info = title => info(
	title, 'You must link an account to use this command.'
);

const highlight = p => (p == 'FIDE' ? '**FIDE**' : `__${p}__`);

// commands: accounts, stats, rating, lichess, chess.com, unlink, link

/// /accounts?/
/// Shows all your linked online chess account usernames.
createCommand({
	name: 'accounts', emoji: ':busts_in_silhouette:', aliases: [ 'account' ],
	description: 'Shows your linked online chess accounts.',
	execute: async message => {
		const title = 'Linked Accounts';
		let member, author;
		if (message.mentionedUserIds.length == 1) {
			author = message.mentionedUserIds[0];
			member = await Database.get(author);
		} else {
			member = await Database.get(message.member.id);
			author = message.member.id;
		}
		if (member == null || member.accounts == undefined) return not_linked_info(title);
		let list = [];
		for (let { platform, username } of member.accounts) {
			const emoji = emojis[platform];
			platform = highlight(platform);
			list.push(`${emoji} ${platform}: \`${username}\``);
		}
		if (list.length > 0) return info(
			title,
			`<@${author}> linked the following accounts:\n${list.join(' ｜ ')}`
		);
		return not_linked_info(title);
	}
});

/// /ratings?/
/// Shows all your linked online chess account rating.
createCommand({
	name: 'rating', emoji: ':star:', aliases: [ 'ratings', 'stats' ],
	description: 'Shows your linked online chess Elo ratings.',
	execute: async message => {
		const title = 'Account Ratings';
		let member, author;
		if (message.mentionedUserIds.length == 1) {
			author = message.mentionedUserIds[0];
			member = await Database.get(author);
		} else {
			member = await Database.get(message.member.id);
			author = message.member.id;
		}
		if (member == null || member.accounts == undefined) return not_linked_info(title);
		let list = [];
		for (let { platform, username } of member.accounts) {
			let ratings = null;
			switch (platform) {
				case '**FIDE**': break;
				case 'lichess.org': ratings = await getLichessRatings(username); break;
				case 'chess.com': ratings = await getChess_comRatings(username); break;
			}
			const color = colors[platform];
			const title = 'Ratings - ' + platform;
			platform = highlight(platform);
			if (ratings == null || ratings.length == 0) continue;
			list.push({
				title,
				message: `:star: <@${author}> aka \`${username}\` ${platform} ratings:\n` +
					ratings.map(r => `${emojis[r.category]} ${r.category} \`${r.rating}\``).join(' ｜ '),
				color
			});
		}
		if (list.length != 0) return cards(list);
		return not_linked_info(title);
	}
});

/// unlink <platforms> *
/// Unlinks all your linked online chess account usernames.
/// @param platforms: if provided only unlink the given platforms.
createCommand({
	name: 'unlink', emoji: ':wrench:',
	description: 'Unlinks all of your online chess accounts.',
	execute: async message => {
		const title = 'Unlink Accounts';
		let member = await Database.get(message.member.id);
		if (member == null) return info(title, 'You currently have `0` linked accounts.');
		if (message.arguments.length != 0) {
			for (let platform of message.arguments) {
				switch (platform) {
					case 'FIDE': break;
					case 'lichess.org': break;
					case 'lichess': platform += '.org'; break;
					case 'chess.com': break;
					default: return error(title, `Unknown platform: \`${platform}\`!`);
				}
				member.accounts = member.accounts.filter(a => a.platform != platform);
			}
		} else member.accounts = [];
		await Database.set(message.member.id, member);
		for (const platform in Roles.platforms) {
			const role = Roles.platforms[platform];
			if (message.member.roles.includes(role))
				await removeRole(message.bot, message.guildId, message.member.id, role);
		}
		return info(title, 'You have successfully unlinked your profile(s).');
	}
});

/// /lichess(.org)?/ <mention> *
/// Links your lichess.org account to your profile.
/// If no argument is provided, shows your stats / linking process.
/// @param mentions: for each mention, display accounts.
createCommand({
	name: 'lichess', emoji: ':regional_indicator_l:',
	aliases: [ 'lichess.org' ],
	description: 'Link your __lichess.org__ account.',
	execute: async message => {
		const title = 'Account - lichess.org';
		const color = colors['lichess.org'];
		const text = message.text;
		const username = message.tag;
		let member = await Database.get(message.member.id);
		if (message.arguments.length == 0) {
			const process = info(
				'lichess.org Instructions',
				'Go on your __lichess.org__ settings page and add your **Discord** username (`' +
				username + '`) to the `location` field.\n' +
				'Type `!lichess your_lichess_username` to link your account.\n' +
				'If your **Discord** username contains spaces or symbols it might not work.'
			);
			if (member == null || member.accounts == undefined) return process;
			const lichess = member.accounts.find(a => a.platform == 'lichess.org');
			if (lichess == undefined) return process;
			const ratings = await getLichessRatings(lichess.username);
			if (ratings === undefined)
				return warn(title, 'No __lichess.org__ user found with the username `' + lichess.username + '`!');
			if (ratings.length == 0) return info(title, 'You are currently unrated on __lichess.org__.');
			return card(
				title,
				`:star: <@${message.member.id}> aka \`${lichess.username}\` __lichess.org__ ratings:\n` +
				ratings.map(r => `${emojis[r.category]} ${r.category} \`${r.rating}\``).join(' ｜ '),
				color
			);
		}
		if (member == null) member = { accounts: [ ] };
		if (member.accounts.find(a => a.platform == 'lichess.org') != undefined)
			return warn(title, 'You already linked a __lichess.org__ account!');
		const verified = await verifyLichessUser(text, username);
		if (verified == undefined)
			return warn(title, 'No lichess user found with the username `' + text + '`!');
		if (!verified) return error(title, 'Verification with __lichess.org__ failed!');
		member.accounts.push({ platform: 'lichess.org', username: text });
		await Database.set(message.member.id, member);
		await addRole(message.bot, message.guildId, message.member.id, Roles.platforms['lichess.org']);
		return success(title, 'Successfully verified! Type `!lichess` to see your rating.');
	}
});

/// chess.com <mention> *
/// Links your chess.com account to your profile.
/// If no argument is provided, shows your stats / linking process.
/// @param mentions: for each mention, display accounts.
createCommand({
	name: 'chess.com', emoji: ':regional_indicator_c:',
	description: 'Link your __chess.com__ account.',
	execute: async message => {
		const title = 'Account - chess.com';
		const color = colors['chess.com'];
		const text = message.text;
		const username = message.tag;
		let member = await Database.get(message.member.id);
		if (message.arguments.length == 0) {
			const process = info(
				'chess.com Instructions',
				'Go on your __chess.com__ settings page and add your **Discord** username (`' +
				username + '`) to the `location` field.\n' +
				'Type `!chess.com your_chess.com_username` to link your account.\n' +
				'If your **Discord** username contains spaces or symbols it might not work.\n' +
				'The __chess.com__ servers are slow, so if it doesn\'t work give it 15 minutes.'
			);
			if (member == null || member.accounts == undefined) return process;
			const chess_com = member.accounts.find(a => a.platform == 'chess.com');
			if (chess_com == undefined) return process;
			const ratings = await getChess_comRatings(chess_com.username);
			if (ratings === undefined)
				return warn(title, 'No __chess.com__ user found with the username `' + chess_com.username + '`!');
			if (ratings.length == 0) return info(title, 'You are currently unrated on __chess.com__.');
			return card(
				title,
				`:star: <@${message.member.id}> aka \`${chess_com.username}\` __chess.com__ ratings:\n` +
				ratings.map(r => `${emojis[r.category]} ${r.category} \`${r.rating}\``).join(' ｜ '),
				color
			);
		}
		if (member == null) member = { accounts: [ ] };
		if (member.accounts.find(a => a.platform == 'chess.com') != undefined)
			return warn(title, 'You already linked a __chess.com__ account!');
		const verified = await verifyChess_comUser(text, username);
		if (verified == undefined) return warn(title, 'No __chess.com__ user found with the username `' + text + '`!');
		if (!verified) return error(
			title,
			'Verification with __chess.com__ failed!\n' +
			'The __chess.com__ servers are slow, give it 15 minutes.'
		);
		member.accounts.push({ platform: 'chess.com', username: text });
		await Database.set(message.member.id, member);
		await addRole(message.bot, message.guildId, message.member.id, Roles.platforms['chess.com']);
		return success(title, 'Successfully verified! Type `!chess.com` to see your rating.');
	}
});

/// verify <platform> <username> <mention> 
/// Verify the given account.
createCommand({
	name: 'verify', emoji: ':white_check_mark:', hidden: true,
	description: 'Manually `!verify <platform> <username> @mention`.',
	permissions: Roles.moderator,
	execute: async message => {
		const title = 'Account Verification';
		const process = info(
			'Verification Instructions',
			'Type `!verify <platform> <username> @mention`.'
		);
		if (message.mentionedUserIds.length == 0 ||
			message.arguments.length < 3) return process;
		const platform = message.arguments[0], name = message.arguments[1];
		const tag = message.mentionedUserIds[0];
		let member = await Database.get(tag);
		if (member == null) member = { accounts: [ ] };
		switch (platform) {
			case 'lichess.org': case 'lichess':
				if (member.accounts.find(a => a.platform == 'lichess.org') != undefined)
					return warn(title, `<@${tag}> already linked a __lichess.org__ account!`);
				member.accounts.push({ platform: 'lichess.org', username: name });
				await addRole(message.bot, message.guildId, tag, Roles.platforms['lichess.org']);
			break;
			case 'chess.com':
				if (member.accounts.find(a => a.platform == 'chess.com') != undefined)
					return warn(title, `<@${tag}> already linked a __chess.com__ account!`);
				member.accounts.push({ platform: 'chess.com', username: name });
				await addRole(message.bot, message.guildId, tag, Roles.platforms['chess.com']);
			break;
			default: return process;
		}
		await Database.set(tag, member);
		return success(title, `<@${tag}> successfully verified!`);
	}
});

/// challenge
/// create a challenge url for the linked account.
createCommand({
	name: 'challenge', emoji: ':crossed_swords:', hidden: false,
	description: 'Create a challenge link.',
	execute: async message => {
		const title = 'Challenge';
		const member = await Database.get(message.member.id);
		if (member == null || member.accounts == undefined) return not_linked_info(title);
		if (Object.keys(member.accounts).length == 0) return not_linked_info(title);
		//return card(title, `Click on a link to challenge <@${message.member.id}>:` + list.join('\n'));
		return {
			embeds: [{
				type: 'rich', title,
				color: ColorCodes.normal,
				fields: member.accounts.map(account => {
					let url = '';
					switch (account.platform) {
						case 'FIDE': break;
						case 'lichess.org': url = `https://lichess.org/?user=${account.username}#friend`; break;
						case 'chess.com': url = `https://www.chess.com/live?#time=5m0s0i&game=chess&rated=rated&minrating=any&maxrating=any&color=random&member=${account.username}`; break;
					}
					return { name: `__${account.platform}__:`, value: url, inline: false };
				})
			}]
		};
	}
});
