
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Channels, ColorCodes, Quotes } from '../config.js';
import { Database } from '../database.js';
import { createTask } from '../parser.js';

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

createTask({
	name: 'quote',
	time: '10:00',
	execute: async bot => {
		const now = new Date();
		const isToday = date =>
			date.getDate() == now.getDate() &&
			date.getMonth() == now.getMonth() &&
			date.getFullYear() == now.getFullYear();
		const lastQuote = await Database.get('quote');
		await Database.set('quote', now.toISOString());
		if (lastQuote == null || lastQuote == undefined ||
			isToday(new Date(lastQuote))) return;
		const quote = quote_of_the_day();
		const footer = quote.title ? `${quote.title}  ${quote.author}` : quote.author;
		sendMessage(bot, Channels.general, {
			embeds: [{
				type: 'rich',
				title: 'Chess quote of the day',
				description: `> *“${quote.text}”*`,
				color: ColorCodes.normal,
				footer: { text: '— ' + footer },
			}]
		});
	}
});
