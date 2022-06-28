
import { Prefix } from '../config.js';
import {
	Option, command, error, info, success, addAction, findAction, removeAction,
	addAliases, actions, programmables
} from '../parser.js';

const PRFXRGX = new RegExp(Prefix, 'g');

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
			required: false, choices: [
				{ name: `mod`, value: 'mod' },
				{ name: `sub`, value: 'sub' },
				{ name: `vip`, value: 'vip' },
				{ name: `all`, value: 'all' },
			],
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
		name: 'list', type: Option.SubCommand,
		description: '🛟 List all the available actions.',
		options: []
	}],
	execute: async interaction => {
		const options = interaction.data.options[0].options;
		let commands, main, aliases;
		const emoji = p => ({ 'mod': '🛂', 'sub': '💟', 'vip': '🆒', 'all': '✅' }[p]);
		switch (interaction.data.options[0].name) {
			case 'action':
				commands = options[0].value.split(/\s+/g)
					.map(c => c.replace(PRFXRGX, '').toLowerCase());
				if (commands.length == 0)
					return error('Twitch Actions', 'Invalid action name!');
				await addAction({
					commands, reply: options[1].value,
					permissions: options.length > 2 ? options[2].value : 'all'
				});
				return success('Twitch Actions', 'Action `' + Prefix + commands[0] + '` added.');
			case 'remove':
				main = options[0].value.replace(PRFXRGX, '').toLowerCase();
				if (!findAction(main)) return error(
					'Twitch Actions', 'Action `' + Prefix + main + '` not found!'
				);
				await removeAction(main);
				return success('Twitch Actions', 'Action `' + Prefix + main + '` removed.');
			case 'alias':
				main = options[0].value.replace(PRFXRGX, '').toLowerCase();
				if (!findAction(main)) return error(
					'Twitch Actions', 'Action `' + Prefix + main + '` not found!'
				);
				aliases = options[1].value.split(/\s+/g)
					.map(c => c.replace(PRFXRGX, '').toLowerCase());
				await addAliases(main, aliases);
				return success('Twitch Actions', 'Aliases for `' + Prefix + main + '` added.');
			case 'list': {
				if (actions.length == 0)
					return info('Twitch Actions', 'No actions found!');
				const text = new Blob(['\n# Actions\n\n' +
				actions.filter(a => a.reply != undefined).sort(
					(a, b) => a.commands[0] > b.commands[0] ? 1 : -1
				).map(a => (emoji(a.permissions) + ' | ') +
					a.commands.map(e => Prefix + e).join(' | ')
					+ '\n' + a.reply
				).join('\n') + '\n\n# Programmables\n\n' + programmables.map(
					p => (emoji(p.permissions) + ' | ') + p.commands.map(
						e => Prefix + e
					).join(' | ') + '\n' + p.description
				).join('\n') + '\n\n' ]);
				return { file: { blob: text, name: 'Actions.txt', } };
			}
		}
	}
});
