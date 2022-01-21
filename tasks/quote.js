
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Roles, Time, Channels, ColorCodes, Quotes } from '../config.js';
import { startTask, createCommand } from '../parser.js';

const dayOfYear = date => {
    date = date || new Date();
    const y = date.getFullYear();
    const j1 = new Date(y, 0, 1);
    return Math.round((date - j1) / (1000 * 60 * 60 * 24) + 1);
};

const quote_of_the_day = () => {
	const now = new Date();
	const a_seed = dayOfYear(now) + now.getFullYear();
	const q_seed = now.getDay() + a_seed;
	const element = Quotes[a_seed % Quotes.length];
	return {
		author: element.author, title: element.title,
		text: element.quotes[q_seed % element.quotes.length]
	};
};

createCommand({
	name: 'quote', emoji: '📃',
	description: 'Shows the quote of the day.',
	permissions: Roles.everyone,
	execute: () => {
		const quote = quote_of_the_day();
		const footer = quote.title ? `${quote.title}  ${quote.author}` : quote.author;
		return {
			embeds: [{
				type: 'rich',
				title: 'Chess quote of the day',
				description: `> *“${quote.text}”*`,
				color: ColorCodes.success,
				footer: { text: '— ' + footer },
			}]
		};
	}
});

startTask({
	name: 'quote_of_the_day',
	interval: Time.hours(12),
	execute: bot => {
		const quote = quote_of_the_day();
		const footer = quote.title ? `${quote.title}  ${quote.author}` : quote.author;
		sendMessage(bot, Channels.general, {
			embeds: [{
				type: 'rich',
				title: 'Chess quote of the day',
				description: `> *“${quote.text}”*`,
				color: ColorCodes.success,
				footer: { text: '— ' + footer },
			}]
		});
	}
});
