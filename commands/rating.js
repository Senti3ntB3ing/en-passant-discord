
import { Prefix, Roles } from '../config.js';
import { createCommand, info, card, cards, warn, error } from '../parser.js';
import { getLichessRapidRating, verifyLichessUser } from '../components/lichess.js';

import { Database } from '../database.js';

import { addRole, removeRole } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

const colors = {
	'FIDE': 0xF1C40F,
	'lichess.org': 0xFFFFFF,
	'chess.com': 0x7FA650,
};

createCommand({
	name: 'accounts', emoji: '⭐️',
	description: 'Shows your linked online chess accounts.',
	permissions: Roles.moderator,
	execute: async message => {
		const title = 'Accounts Command';
		const member = await Database.get(message.member.id);
		if (member == null || member.accounts == undefined) return info(
			title, 'ℹ️ You must link your account to use this command.'
		);
		let list = [];
		for (let { platform, username } of member.accounts) {
			switch (platform) {
				case 'lichess.org':
					const rating = await getLichessRapidRating(username);
					if (rating === undefined) return warn(
						title, ':warning: No __lichess.org__ user found with the username `' + username + '`!'
					);
					if (rating === null) return error(
						title, '❌ Error: connection with __lichess.org__ failed!'
					);
					list.push({
						title,
						message: `⭐️ <@${message.member.id}> aka \`${username}\`, your __lichess.org__ rapid rating is \`${rating}\`!`,
						color: colors[platform]
					});
				break;
				/*case 'chess.com':
					list.push({
						title,
						message: `⭐️ Your __chess.com__ rapid rating is \`${rating}\`!`,
						color: colors[platform]
					});
				break;
				case 'FIDE': break;*/
			}
		}
		if (list.length > 0) return cards(list);
		return info(
			title, 'ℹ️ You must link your account to use this command.'
		);
	}
});

createCommand({
	name: 'unlink', emoji: '⚡️', hidden: true,
	description: 'Unlinks all of your online chess accounts.',
	permissions: Roles.everyone,
	execute: async (message, bot) => {
		const title = 'Unlink Command';
		let member = await Database.get(message.member.id);
		if (member == null) return info(
			title, 'ℹ️ You have `0` linked accounts at the moment.'
		);
		member.accounts = [];
		await Database.set(message.member.id, member);
		for (const platform in Roles.platforms) {
			const role = Roles.platforms[platform];
			if (message.member.roles.includes(role))
				await removeRole(bot, message.guildId, message.member.id, role);
		}
		return info(title, 'ℹ️ You have successfully unlinked your profile.');
	}
});

createCommand({
	name: 'lichess', emoji: ':regional_indicator_l:',
	aliases: [ 'lichess.org' ],
	description: 'Link your __lichess.org__ rapid rating.',
	permissions: Roles.everyone,
	execute: async (message, bot) => {
		const title = 'Rating Command';
		const text = message.content.replace(/^(.*?)\s+/gm, '').trim();
		const username = message.tag;
		let member = await Database.get(message.member.id);
		if (text == Prefix + 'lichess' || text == Prefix + 'lichess.org') {
			const process = info(
				'Rating Command',
				'ℹ️ Go on your __lichess.org__ settings page and add your **Discord** username (`' +
				username + '`) to the `location` field.\n' +
				'Type `!lichess your_lichess_username` to link your account.\n' +
				'If your **Discord** username contains spaces or symbols it might not work, ' +
				'but you can always ask a moderator to manually fix it for you.'
			);
			if (member == null || member.accounts == undefined) return process;
			const lichess = member.accounts.find(a => a.platform == 'lichess.org');
			if (lichess == undefined) return process;
			const rating = await getLichessRapidRating(lichess.username);
			if (rating === undefined) return warn(
				title, ':warning: No __lichess.org__ user found with the username `' + lichess.username + '`!'
			);
			if (rating === null) return error(
				title, '❌ Error: connection with __lichess.org__ failed!'
			);
			return card(
				title,
				`⭐️ <@${message.member.id}> aka \`${lichess.username}\`, your __lichess.org__ rapid rating is \`${rating}\`!`,
				colors['lichess.org']
			);
		}
		if (member == null) member = { accounts: [ ] };
		const verified = await verifyLichessUser(text);
		if (verified == undefined) return warn(
			title, ':warning: No lichess user found with the username `' + text + '`!'
		);
		if (!verified) return error(
			'Rating Command',
			'❌ Error: verification with __lichess.org__ failed!'
		);
		member.accounts.push({ platform: 'lichess.org', username: text });
		await Database.set(message.member.id, member);
		await addRole(bot, message.guildId, message.member.id, Roles.platforms['lichess.org']);
		return card(
			title,
			'✅ Successfully verified! Type `!lichess` to see your rating.',
			colors['lichess.org']
		);
	}
});
