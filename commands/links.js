
import { Color, Roles, Links } from '../config.js';
import { createCommand } from '../parser.js';

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
			fields: Object.keys(Links).map(name => {
				return {
					name: `${Links[name].emoji} **${name}**:`,
					value: Links[name].url,
					inline: false
				};
			})
		}]
	})
});
