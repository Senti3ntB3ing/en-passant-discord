
import { Roles } from '../config.js';
import { createCommand, info, card } from '../parser.js';

function findPlatform(roles) {
	for (const platform in Roles.platforms)
		if (roles.includes(Roles.platforms[platform]))
			return platform;
	return null;
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
		const platform = findPlatform(message.member.roles);
		if (platform == null) return info(
			'Rating Command',
			'ℹ️ You must link your account to use this command.'
		);
		for (const rating in Roles.ratings) {
			if (message.member.roles.includes(Roles.ratings[rating])) {
				return card(
					'Rating Command',
					`⭐️ Your __${platform}__ rapid rating is \`${rating}\`!`,
					colors[platform]
				);
			}
		}
		return info('Rating Command', 'ℹ️ You are currently unrated in rapid.');
	}
});
