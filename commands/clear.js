
import {
	CommandTypes, command, error, card, messages, remove
} from '../parser.js';

command({
	name: 'clear', emoji: ':wastebasket:', moderation: true,
	description: '🗑 Clear messages in a text channel.',
	options: [{
		description: 'Number of messages to delete.',
		name: 'count', type: CommandTypes.Number,
		required: true, maxValue: 100, minValue: 1,
	}],
	execute: async interaction => {
		const limit = interaction.data.options.value;
		try {
			const texts = await messages(interaction.channelId, { limit });
			await remove(interaction.channelId, texts.map(m => m.id));
		} catch {
			return error(
				'Clean Command', 'Internal error. Please try again later.',
			);
		}
		return card(
			'Clear Command',
			`:wastebasket: Successfully cleared \`${limit}\` messages.`
		);
	}
});

/*createCommand({
	name: 'clear', emoji: ':wastebasket:', hidden: true,
	aliases: [ 'clean', 'delete', 'erase' ],
	description: 'Clear messages in a text channel.',
	permissions: Roles.moderator,
	execute: async message => {
		const content = message.content.split(/[ \t]+/g)[1];
		if (content == undefined) return invalid;
		const n = parseInt(content) + 1;
		if (isNaN(n) || n < 2 || n > 100) return invalid;
		try {
			const messages = await getMessages(message.bot, message.channelId, { limit: n });
			await deleteMessages(message.bot, message.channelId, messages.map(m => m.id));
		} catch { return internal; }
		return card('Clear Command', `:wastebasket: Successfully cleared \`${n - 1}\` messages.`);
	}
});*/
