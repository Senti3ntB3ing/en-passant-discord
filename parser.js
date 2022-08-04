
import {
	sendMessage, publishMessage, deleteMessage, deleteMessages,
	getMessages, createApplicationCommand, getApplicationCommands,
	deleteApplicationCommand, sendInteractionResponse, getGuild,
	InteractionResponseTypes, ApplicationCommandOptionTypes, editBotStatus,
	addRole, removeRole, getUser, addReaction, getOriginalInteractionResponse,
	createScheduledEvent, ScheduledEventEntityType, createChannel, ChannelTypes
} from 'https://deno.land/x/discordeno@13.0.0-rc45/mod.ts';

import { Chess } from 'https://deno.land/x/beta_chess@v1.0.1/chess.js';

import { closest } from './components/levenshtein.js';
import { live, daily } from './components/chess_com.js';
import { gif } from './components/diagram/diagram.js';

import {
	Name, Prefix, Roles, ColorCodes, ActionTypes, GuildID, ActionURL, control
} from './config.js';
import { bot, setRandomAction } from './main.js';
import { Database } from './database.js';

export let commands = [], tasks = {}, attachments = [], record = [],
	onAir = false, actions = [], programmables = [];
let lastPing = new Date();

// ==== Commands ===============================================================

function handleText(command, message, content, args) {
	message.arguments = args;
	message.bot = bot;
	message.command = content;
	message.text = message.content.replace(/^(.*?)\s+/g, '').trim();
	if (command.execute.constructor.name == 'AsyncFunction') {
		command.execute(message).then(result => {
			if (result != undefined) sendMessage(bot, message.channelId, result);
			deleteMessage(bot, message.channelId, message.id);
		});
		return;
	}
	const result = command.execute(message);
	if (result != undefined) sendMessage(bot, message.channelId, result);
	deleteMessage(bot, message.channelId, message.id);
}

function handleFile(event, message, attachment) {
	if (event.execute.constructor.name == 'AsyncFunction') {
		event.execute(message, attachment).then(result => {
			if (result != undefined) sendMessage(bot, message.channelId, result);
		});
		return;
	}
	const result = event.execute(message, attachment);
	if (result != undefined) sendMessage(bot, message.channelId, result);
}

const CHESSCOM_REGEX = /https?:\/\/(?:www\.)?chess\.com\/game\/(live|daily)\/(\d+)\/?/g;

export async function handleChesscomGame(type, id, message) {
	console.log(`in here`);
	let game = undefined;
	if (type == 'live') game = await live(id);
	else game = await daily(id);
	if (game == undefined) return;
	const board = new Chess(game.pgnHeaders.FEN);
	for (const move of game.moveList) if (board.move(move) == null) return;
	const data = await gif(board);
	const w = game.pgnHeaders.White, b = game.pgnHeaders.Black;
	let description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
	description += ` ・ \`${control(game.pgnHeaders.TimeControl)}\``;
	let status = '';
	console.log(`in here2`);
	if (game.isFinished) {
		status = game.pgnHeaders.result.replace(/1\/2/, '½').replace(/\-/, '-');
		if (game.pgnHeaders.Termination != undefined) status += (' ・ ' +
			(game.pgnHeaders.Termination || '').replace(/(.*?)\s+/g, '`$1` ')
		);
	}
	console.log(`in here3`);
	sendMessage(bot, message.channelId, {
		file: { blob: new Blob([ data ]), name: 'board.gif', },
		embeds: [{
			type: 'rich', title: 'Game Preview', description, color: 0xFFFFFF,
			image: { url: 'attachment://board.gif' },
			footer: { text: status }
		}]
	});
	console.log(`in here4`);
}

export function parse(message) {
	const c = CHESSCOM_REGEX.exec(message.content);
	if (c != null && c.length >= 3) handleChesscomGame(c[1], c[2], message);
	for (const attachment of message.attachments) {
		const filename = attachment.filename.toLowerCase();
		for (const event of attachments) {
			if (filename.endsWith('.' + event.type)) {
				handleFile(event, message, attachment);
				return;
			}
		}
	}
	if (!message.content.startsWith(Prefix)) return;
	if (!message.member.roles.includes(Roles.developer)) {
		sendMessage(bot, message.channelId, info(
			'Command Information',
			'We transitioned to slash commands.\nType `/` to get started.\n' +
			'If it doesn\'t work, try updating **Discord**.'
		));
		return;
	}
	const args = message.content.split(/\s+/g);
	const content = args.splice(0, 1)[0].substring(Prefix.length).toLowerCase();
	for (const command of commands) {
		if (command.name == content || command.aliases.includes(content)) {
			handleText(command, message, content, args);
			return;
		}
	}
	// command not found, check for typos:
	const filtered = commands.map(command => [
		command.name, command.aliases
	].flat()).flat();
	const [ i, d ] = closest(content, filtered);
	if (d <= 2) sendMessage(bot, message.channelId, info(
		'Command Information',
		`There is no command named \`${Prefix}${content}\`.\n` +
		`Did you mean \`${Prefix}${filtered[i]}\` instead?`
	));
}

export function prefix(command) {
	if (typeof command.execute != 'function') return;
	if (command.name == undefined) return;
	if (command.aliases == undefined) command.aliases = [ ];
	commands.push(command);
}

// ==== Attachments ============================================================

export function attachment(options) {
	if (typeof options.execute != 'function') return;
	if (options.type == undefined) return;
	options.type = options.type.toLowerCase();
	attachments.push(options);
}

// ==== Tasks ==================================================================

export function createTask(task) {
	if (typeof task.execute != 'function') return;
	if (task.name == undefined) return;
	if (task.interval == undefined && task.time == undefined) return;
	if (tasks[task.name] != undefined) return;
	if (task.disabled == undefined) task.disabled = false;
	task.last_execution = new Date(Date.now() - 86400000); // yesterday
	tasks[task.name] = task;
}

export function executeTasks() {
	const now = new Date();
	lastPing = now;
	const isToday = date =>
		date.getDate() == now.getDate() &&
		date.getMonth() == now.getMonth() &&
		date.getFullYear() == now.getFullYear();
	for (const name in tasks) {
		if (tasks[name].disabled) continue;
		if (tasks[name].interval != undefined) {
			if (tasks[name].last_execution.getTime() +
				tasks[name].interval > now.getTime()) continue;
		} else if (isToday(tasks[name].last_execution)) continue;
		if (tasks[name].time != undefined) {
			const t = tasks[name].time.split(':');
			const h = parseInt(t[0]), m = parseInt(t[1]);
			const ch = now.getHours(), cm = now.getMinutes();
			if (ch < h || (ch == h && cm < m)) continue;
		}
		tasks[name].last_execution = now;
		tasks[name].execute();
		log('task', `${name} executed`);
	}
}

// ==== Cards ==================================================================

export const text = message => ({ content: message });

export const card = (title, message, color) => ({
	embeds: [{
		title: title || Name,
		color: color || ColorCodes.normal,
		description: message || ''
	}]
});

export const cards = elements => ({
	embeds: elements.map(element => ({
		type: 'rich',
		title: element.title || Name,
		color: element.color || ColorCodes.normal,
		fields: element.fields || [],
		description: element.message || ''
	}))
});

export const field = (title, subtitle, message, color) => ({
	embeds: [{
		type: 'rich',
		title: title || Name,
		color: color || ColorCodes.normal,
		fields: [{ name: subtitle, value: message, inline: false }]
	}]
});

export const error = (title, message) => ({
	embeds: [{
		title: title || Name,
		color: ColorCodes.error,
		description: ':no_entry_sign: ' + (message || 'Error!')
	}]
});

export const info = (title, message) => ({
	embeds: [{
		title: title || Name,
		color: ColorCodes.info,
		description: ':information_source: ' + (message || 'Information.')
	}]
});

export const success = (title, message) => ({
	embeds: [{
		title: title || Name,
		color: ColorCodes.success,
		description: ':white_check_mark: ' + (message || 'Success!')
	}]
});

export const warn = (title, message) => ({
	embeds: [{
		title: title || Name,
		color: ColorCodes.warn,
		description: ':children_crossing: ' + (message || 'Warning!')
	}]
});

// ==== Log ====================================================================

export function log(component, text) {
	if (record.length == 10) record.shift();
	record.push(`[${(new Date()).toLocaleTimeString('en-GB', {
		timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric'
	})} UTC] ${component}: ${text}`);
	if (component == 'status') console.log(record[record.length - 1]);
}

export function fetchLog() {
	return record.join('\n') + `\n[${lastPing.toLocaleTimeString('en-GB', {
		timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric'
	})} UTC] task: last ping received`;
}

// ==== Redirects ==============================================================

export const Option = ApplicationCommandOptionTypes;
export const guild = async g => await getGuild(bot, g, { counts: true });
export const snow = id => Number(id / 4194304n + 1420070400000n);
export const send = (channel, content) => sendMessage(bot, channel, content);
export const publish = (channel, id) => publishMessage(bot, channel, id);
export const react = async (channel, id, emoji) => await addReaction(bot, channel, id, emoji);
export const messages = async (channel, limit) => await getMessages(bot, channel, { limit });
export const remove = async (data, channel) => {
	if (Array.isArray(data)) return await deleteMessages(bot, channel, data);
	else return await deleteMessage(bot, channel, data);
};
export const clear = async (channel, limit) => {
	let m = [];
	if (limit == 1) {
		m = await getMessages(bot, channel, { limit: 2 });
		await deleteMessage(bot, channel, m[0].id);
		return;
	} else m = await getMessages(bot, channel, { limit });
	if (m.length == 0) return;
	if (m.length == 1) return await deleteMessage(bot, channel, m[0].id);
	else return await deleteMessages(bot, channel, m.map(e => e.id));
};
export const bless = async (guild, user, role) => await addRole(bot, guild, user, role);
export const curse = async (guild, user, role) => await removeRole(bot, guild, user, role);
export const discriminator = async tag => {
	const user = await getUser(bot, tag);
	return user.username + '#' + user.discriminator;
};
export const streamAction = (streaming) => {
	onAir = streaming;
	if (streaming) editBotStatus(bot, {
		activities: [{
			name: 'thechessnerdlive',
			type: ActionTypes.watching,
			createdAt: Date.now(),
			url: 'https://www.twitch.tv/thechessnerdlive',
		}],
		since: Date.now(), afk: false, status: 'online'
	});
	else setRandomAction();
};
export const event = e => {
	createScheduledEvent(bot, GuildID, {
		name: e.title, description: e.title,
		entityType: ScheduledEventEntityType.External,
		location: 'https://www.twitch.tv/thechessnerdlive/',
		scheduledStartTime: e.start.getTime(),
		scheduledEndTime: e.end.getTime(),
	});
};

// ==== Application Commands ===================================================

const appCommands = [], handlers = {};

export async function dispatch(interaction) {
	const handler = handlers[interaction.data.name];
	let response = undefined;
	if (handler.constructor.name == 'AsyncFunction') {
		response = await handler(interaction)
	} else response = handler(interaction);
	if (response == undefined) return;
	let reactions = [];
	if (response.reactions != undefined) {
		reactions = response.reactions;
		delete response.reactions;
	}
	await sendInteractionResponse(
		bot, interaction.id, interaction.token, {
			type: InteractionResponseTypes.ChannelMessageWithSource,
			data: response
		}
	);
	if (reactions.length > 0) {
		const m = await getOriginalInteractionResponse(bot, interaction.token);
		for (const r of reactions) {
			try { await react(interaction.channelId, m.id, r); } catch { }
		}
	}
}

export function command(data) {
	const command = {
		name: data.name,
		description: data.description,
		options: data.options,
		moderation: 'moderation' in data ? data.moderation : false
	};
	appCommands.push(command);
	handlers[data.name] = data.execute;
}

prefix({
	name: 'register', emoji: ':pencil:',
	description: 'Registers application commands.',
	execute: async message => {
		const id = message.text.includes('global') ? undefined : message.guildId;
		try {
			// register new commands:
			for (const command of appCommands)
				await createApplicationCommand(bot, command, id);
		} catch { return error('Application Commands', 'Registration error!'); }
		// send success message:
		return success('Application Commands', 'Registration completed!');
	}
});

prefix({
	name: 'forget', emoji: ':pencil:',
	description: 'Deletes application commands.',
	execute: async message => {
		// fetch old guild commands:
		let old = await getApplicationCommands(bot, message.guildId);
		// delete old commands:
		old.forEach(async (_, id) => {
			await deleteApplicationCommand(bot, id, message.guildId);
		});
		old = await getApplicationCommands(bot);
		old.forEach(async (_, id) => {
			await deleteApplicationCommand(bot, id);
		});
		return success('Application Commands', 'Commands deleted!');
	}
});

prefix({
	name: 'forum', emoji: ':envelope_with_arrow:',
	description: 'Make a new forum channel.',
	execute: async message => {
		await createChannel(bot, message.guildId, {
			type: ChannelTypes.GuildForum, name: 'forum'
		});
		return success('Forum', 'New forum created!');
	}
});

// ==== Twitch Actions =========================================================

export async function reloadActions() {
	actions = await Database.get('actions');
	if (actions == undefined || actions == null) {
		await Database.set('actions', []);
		actions = [];
	}
	return actions;
}

export function findAction(name) {
	for (const action of actions)
		if (action.commands.includes(name)) return true;
	return false;
}

export async function removeAction(name) {
	await reloadActions();
	actions = actions.filter(a => !a.commands.includes(name));
	await Database.set('actions', actions);
	fetch(ActionURL);
}

export async function addAction(data) {
	await reloadActions();
	const action = actions.find(a => a.commands.includes(data.commands[0]));
	if (action != undefined) {
		if (data.reply != '') action.reply = data.reply;
		action.permissions = data.permissions;
		await Database.set('actions', actions);
		return;
	}
	actions.push(data);
	await Database.set('actions', actions);
	fetch(ActionURL);
}

export async function actionPermissions(action, perm) {
	if (![ 'mod', 'sub', 'vip', 'all' ].includes(perm)) perm = 'all';
	await reloadActions();
	action = actions.find(a => a.commands.includes(action));
	if (action == undefined) return;
	action.permissions = perm;
	await Database.set('actions', actions);
	fetch(ActionURL);
}

export async function addAliases(name, aliases) {
	const remove_duplicates = a => [...new Set(a)];
	await reloadActions();
	for (const action of actions) if (action.commands.includes(name)) {
		action.commands = remove_duplicates(action.commands.concat(aliases));
		await Database.set('actions', actions);
		fetch(ActionURL);
		return;
	}
}
