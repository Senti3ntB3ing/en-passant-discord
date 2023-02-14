
import { Prefix, ActionURL } from '../config.js';
import { shorten } from '../components/shortener.js';
import {
	Option, command, error, card, success, addAction,
	findAction, removeAction, addAliases, actionPermissions
} from '../parser.js';

const PRFXRGX = new RegExp(Prefix, 'g');

const emoji = p => ({ 'mod': '🛂', 'sub': '💟', 'vip': '📳', 'all': '✅' }[p]);
const PERM = [
	{ name: '🛂 mod', value: 'mod' },
	{ name: '💟 sub', value: 'sub' },
	{ name: '📳 vip', value: 'vip' },
	{ name: '✅ all', value: 'all' },
];

command({
	name: 'twitch', emoji: ':gem:',
	description: '💎 Manage twitch.tv commands.',
	options: [{
		name: 'action', type: Option.SubCommand,
		description: '🆕 Make a new twitch.tv action.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the new action',
			required: true
		}, {
			name: 'reply', type: Option.String,
			description: 'Expected message reply',
			required: true
		}, {
			name: 'permissions', type: Option.String,
			description: 'Who can use this action?',
			required: false, choices: PERM,
		}]
	}, {
		name: 'remove', type: Option.SubCommand,
		description: '🚫 Remove a twitch.tv action.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the action to remove',
			required: true
		}]
	}, {
		name: 'alias', type: Option.SubCommand,
		description: '💕 Add aliases to an action.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the action',
			required: true
		}, {
			name: 'aliases', type: Option.String,
			description: 'Aliases, space separated',
			required: true
		}]
	}, {
		name: 'permissions', type: Option.SubCommand,
		description: '🚸 Sets permissions for the specified command.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the action to remove',
			required: true
		}, {
			name: 'permissions', type: Option.String,
			description: 'Who can use this action?',
			required: true, choices: PERM,
		}]
	}, {
		name: 'tools', type: Option.SubCommand,
		description: '🧰 List all the available tools.',
		options: []
	}],
	execute: async interaction => {
		const options = interaction.data.options[0].options;
		let commands, main, aliases;
		switch (interaction.data.options[0].name) {
			case 'action': {
				commands = options[0].value.split(/\s+/g)
					.map(c => c.replace(PRFXRGX, '').toLowerCase());
				if (commands.length == 0)
					return error('Twitch Actions', 'Invalid action name!');
				const text = options[1].value.replace(/(\s*)[:→](\s+)/g, ' -> ')
					.replace(/(^|\s)(https?:\/\/.+?)(\s|$)/g, (m, s, _, e) => s + shorten(m) + e);
				await addAction({
					commands, reply: text,
					permissions: options.length > 2 ? options[2].value : 'all'
				});
				return success(
					'Twitch Actions',
					'Action `' + Prefix + commands[0] + '` added with text:\n\n> ' + text
				);
			}
			case 'remove':
				main = options[0].value.replace(PRFXRGX, '').toLowerCase();
				if (!findAction(main)) return error(
					'Twitch Remove', 'Action `' + Prefix + main + '` not found!'
				);
				await removeAction(main);
				return success('Twitch Remove', 'Action `' + Prefix + main + '` removed.');
			case 'alias':
				main = options[0].value.replace(PRFXRGX, '').toLowerCase();
				if (!findAction(main)) return error(
					'Twitch Aliases', 'Action `' + Prefix + main + '` not found!'
				);
				aliases = options[1].value.split(/\s+/g)
					.map(c => c.replace(PRFXRGX, '').toLowerCase());
				await addAliases(main, aliases);
				return success(
					'Twitch Aliases', 'Aliases ' +
					aliases.map(a => '`' + Prefix + a + '`').join(', ') +
					' for `' + Prefix + main + '` added.'
				);
			case 'permissions':
				main = options[0].value.replace(PRFXRGX, '').toLowerCase();
				if (!findAction(main)) return error(
					'Twitch Permissions', 'Action `' + Prefix + main + '` not found!'
				);
				await actionPermissions(main, options[1].value);
				return success(
					'Twitch Permissions',
					'Permissions for `' + Prefix + main + '` set to ' +
					emoji(options[1].value) + ' `' + options[1].value + '`.'
				);
			case 'tools': return card('Twitch Tools',
				`:bookmark: ${ActionURL}mod/\n` +
				`:map: ${ActionURL}map/\n` + 
				`:scroll: ${ActionURL}queue/\n` +
				`:rotating_light: ${ActionURL}audit/\n` +
				`:clock: ${ActionURL}time/`
			);
		}
	}
});
