
import { Prefix, Roles } from '../config.js';
import { createCommand, info, card, warn, error } from '../parser.js';
import { getLichessUser } from '../components/lichess.js';

import { getUser, addRole } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

function findPlatform(roles) {
	for (const platform in Roles.platforms)
		if (roles.includes(Roles.platforms[platform]))
			return platform;
	return null;
}

function normalize(rating) {
	if (rating == null || rating == undefined) return null;
	rating = Math.floor(rating / 100) * 100;
	if (rating < 100) return 'UNR';
	else if (rating > 3000) return '3000';
	else return rating.toString();
}

const colors = {
	'FIDE': 0xF1C40F,
	'lichess.org': 0xABABAC,
	'chess.com': 0x7FA650,
};

createCommand({
	name: 'rating', emoji: '⭐️',
	aliases: [ 'elo' ],
	description: 'Shows your online rapid Elo rating.',
	permissions: Roles.everyone,
	execute: message => {
		let platform = findPlatform(message.member.roles);
		if (platform == null) return info(
			'Rating Command',
			'ℹ️ You must link your account to use this command.'
		);
		const color = colors[platform];
		if (platform == 'FIDE') platform = '**FIDE**';
		else platform = `__${platform}__`;
		for (const rating in Roles.ratings) {
			if (message.member.roles.includes(Roles.ratings[rating])) {
				return card(
					'Rating Command',
					`⭐️ Your ${platform} rapid rating is \`${rating}\`!`,
					color
				);
			}
		}
		return info('Rating Command', 'ℹ️ You are currently unrated in rapid.');
	}
});

createCommand({
	name: 'lichess', emoji: ':regional_indicator_l:',
	aliases: [ 'lichess.org' ],
	description: 'Link your __lichess.org__ rapid rating.',
	permissions: Roles.everyone,
	execute: async (message, bot) => {
		let platform = findPlatform(message.member.roles);
		if (platform != null && platform != 'lichess.org') return warn(
			'Rating Command',
			':warning: Your rating is already linked with __' + platform + '__.\n' +
			'If you want to use a different platform `!unlink` this one first.'
		);
		const text = message.content.replace(/^(.*?)\s+/gm, '').trim();
		const user = await getUser(bot, message.authorId);
		const username = user.username + '#' + user.discriminator;
		if (text == Prefix + 'lichess' || text == Prefix + 'lichess.org') return info(
			'Rating Command',
			'ℹ️ Go on your __lichess.org__ settings page and add your **Discord** username (`' +
			username + '`) to the `location` field.\n' +
			'Type `!lichess your_lichess_username` to link your account.\n' +
			'If your **Discord** username contains spaces or symbols it might not work, ' +
			'but you can always ask a moderator to manually fix it for you.'
		);
		const lichess = await getLichessUser(text);
		if (lichess == null) return warn(
			'Rating Command',
			':warning: No lichess user found with the username `' + text + '`!'
		);
		if (lichess.profile == undefined ||
			lichess.profile.location == undefined ||
			lichess.profile.location.replace(/\s+/g, '') != username.replace(/\s+/g, '') ||
			lichess.perfs == undefined ||
			lichess.perfs.rapid == undefined ||
			lichess.perfs.rapid.rating == undefined) return error(
			'Rating Command',
			'❌ Error: connection with __lichess.org__ failed!'
		);
		const rating = normalize(parseInt(lichess.perfs.rapid.rating));
		await addRole(bot, message.guildId, message.member.id, Roles.ratings[rating]);
	}
});
