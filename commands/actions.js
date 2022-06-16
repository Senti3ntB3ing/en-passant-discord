
import { Option, command, error, card } from '../parser.js';

command({
	name: 'twitch', emoji: ':gem:',
	description: '💎 Manage twitch.tv commands.',
	options: [{
		name: 'new', type: Option.SubCommand,
		description: '🆕 Add a new twitch.tv command.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the new command',
			required: true
		}, {
			name: 'reply', type: Option.String,
			description: 'Expected message reply',
			required: true
		}]
	}, {
		name: 'remove', type: Option.SubCommand,
		description: '🚫 Remove a twitch.tv command.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the command to remove',
			required: true
		}]
	}, {
		name: 'alias', type: Option.SubCommand,
		description: '💕 Add aliases to a command.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the command',
			required: true
		}, {
			name: 'aliases', type: Option.String,
			description: 'Aliases, space separated',
			required: true
		}]
	}],
	execute: async interaction => {
		console.log(interaction.data);
	}
});
