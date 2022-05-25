
import { Channels, Roles } from '../config.js';
import { prefix, createHelp } from '../parser.js';

prefix({
	name: 'help', emoji: ':grey_question:',
	aliases: [ 'usage', 'commands' ], rate: 3,
	description: 'Display the list of commands.',
	execute: message => createHelp(
		message.member.roles.includes(Roles.moderator) && (
			message.channelId == Channels.mod_chat ||
			message.channelId == Channels.mad_chat ||
			message.channelId == Channels.dev_chat
		)
	)
});
