
import {
	sendMessage, publishMessage, editScheduledEvent, deleteScheduledEvent,
	getMessages, createGuildApplicationCommand, getGuildApplicationCommands,
	deleteGuildApplicationCommand, sendInteractionResponse, getGuild,
	InteractionResponseTypes, ApplicationCommandOptionTypes, editBotStatus,
	addRole, removeRole, getUser, addReaction, getOriginalInteractionResponse,
	createScheduledEvent, ScheduledEventEntityType, deleteMessage, deleteMessages,
	ActivityTypes
} from 'https://deno.land/x/discordeno@18.0.1/mod.ts';

import { closest } from './components/levenshtein.js';
import { handleChesscomGame, handlelichessorgGame } from './attachments/game.js';

import {
	Name, Prefix, Roles, ColorCodes, GuildID, ActionURL, Icon, TwitchIcon,
	Channels, BotID, CHESSCOM_REGEX, LICHESSORG_REGEX, Time
} from './config.js';
import { bot, setQuoteAction } from './main.js';
import { Database } from './database.js';

export const commands = [], tasks = {}, attachments = [], record = [], programmables = [];
let actions = [], lastPing = new Date();

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
	if (message.member.id === BotID) return;
	if (event.execute.constructor.name == 'AsyncFunction') {
		event.execute(message, attachment).then(result => {
			if (result != undefined) sendMessage(bot, message.channelId, result);
		});
		return;
	}
	const result = event.execute(message, attachment);
	if (result != undefined) sendMessage(bot, message.channelId, result);
}

async function handleLinks(message) {
	let game = undefined;
	const c = CHESSCOM_REGEX.exec(message.content);
	if (c !== null && c.length >= 3) game = await handleChesscomGame(c[1], c[2],
		(message.content.toLowerCase().includes('black') ? 'b' : 'w'), undefined,
		message.channelId === Channels.guess_the_elo
	);
	const l = LICHESSORG_REGEX.exec(message.content);
	if (l !== null && l.length >= 2) game = await handlelichessorgGame(l[1],
		(message.content.toLowerCase().includes('black') ? 'b' : 'w'), undefined,
		message.channelId === Channels.guess_the_elo
	);
	if (game !== undefined) sendMessage(bot, message.channelId, game);
}

export function parse(message) {
	handleLinks(message);
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
	if (!message.member.roles.includes(Roles.developer) && /!\w/.test(message.content)) {
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

export async function createTask(task) {
	if (typeof task.execute != "function") return;
	if (task.name === undefined) return;
	if (task.interval === undefined) return;
	if (tasks[task.name] !== undefined) return;
	if (task.disabled === undefined) task.disabled = false;
	task.last = (await Database.get(`tasks/${task.name}`)) || (Date.now() - Time.day);
	tasks[task.name] = task;
}

export function executeTasks() {
	lastPing = new Date();
	const now = lastPing.getTime();
	for (const name in tasks) {
		if (tasks[name].disabled) continue;
		if (tasks[name].last + tasks[name].interval > now) continue;
		Database.set(`tasks/${name}`, tasks[name].last = now);
		tasks[name].execute();
		log("task", `${name} executed`);
	}
}

// ==== Cards ==================================================================

export const text = message => ({ content: message });

export const card = (title, message, color, silent = false) => ({
	embeds: [{
		title: title || Name,
		color: color || ColorCodes.normal,
		description: message || ''
	}],
	// 64 = ephemeral message (only visible to the user)
	flags: silent ? 64 : 0
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
	}],
	// 64 = ephemeral message (only visible to the user)
	flags: 64
});

export const info = (title, message) => ({
	embeds: [{
		title: title || Name,
		color: ColorCodes.info,
		description: ':information_source: ' + (message || 'Information.')
	}],
	// 64 = ephemeral message (only visible to the user)
	flags: 64
});

export const success = (title, message) => ({
	embeds: [{
		title: title || Name,
		color: ColorCodes.success,
		description: ':white_check_mark: ' + (message || 'Success!')
	}],
	// 64 = ephemeral message (only visible to the user)
	flags: 64
});

export const warn = (title, message) => ({
	embeds: [{
		title: title || Name,
		color: ColorCodes.warn,
		description: ':children_crossing: ' + (message || 'Warning!')
	}],
	// 64 = ephemeral message (only visible to the user)
	flags: 64
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
	try {
		if (m.length == 1) return await deleteMessage(bot, channel, m[0].id);
		else return await deleteMessages(bot, channel, m.map(e => e.id));
	} catch { log('error', 'failed to clear messages'); }
};
export const bless = async (guild, user, role) => await addRole(bot, guild, user, role);
export const curse = async (guild, user, role) => await removeRole(bot, guild, user, role);
export const discriminator = async tag => {
	const user = await getUser(bot, tag);
	return user.username + '#' + user.discriminator;
};

export const event = async e => (await createScheduledEvent(bot, GuildID, {
	name: e.title, description: '',
	entityType: ScheduledEventEntityType.External,
	location: 'https://www.twitch.tv/thechessnerdlive/',
	scheduledStartTime: e.start.getTime(),
	scheduledEndTime: e.end.getTime(),
})).id.toString();

export const cancel = id => deleteScheduledEvent(bot, GuildID, BigInt(id));

export const reschedule = (id, e) =>
	editScheduledEvent(bot, GuildID, BigInt(id), {
		name: e.title, description: '',
		entityType: ScheduledEventEntityType.External,
		location: 'https://www.twitch.tv/thechessnerdlive/',
		scheduledStartTime: e.start.getTime(),
		scheduledEndTime: e.end.getTime(),
	});

// ==== Application Commands ===================================================

const appCommands = [], handlers = {};

export async function dispatch(interaction) {
	const handler = handlers[interaction.data.name];
	let response = undefined;
	if (handler.constructor.name == 'AsyncFunction') {
		response = await handler(interaction)
	} else response = handler(interaction);
	if (response === undefined) return;
	let reactions = [];
	if (response.reactions !== undefined) {
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
			try { await react(interaction.channelId, m.id, r); }
			catch { log('error', 'failed to react to message'); }
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
		if (message.arguments.length === 0) return info(
			'Application Commands',
			'Type `' +  Prefix + 'register <name>` to register the command.'
		);
		let found = false;
		try {
			// register new commands:
			for (const command of appCommands)
				if (message.arguments.includes(command.name)) {
					await createGuildApplicationCommand(bot, command, message.guildId);
					found = true;
				}
		} catch { return error('Application Commands', 'Registration error!'); }
		if (!found) return error('Application Commands', `Cannot find command \`${message.arguments[0]}\`!`);
		// send success message:
		return success('Application Commands', 'Registration completed!');
	}
});

prefix({
	name: 'forget', emoji: ':pencil:',
	description: 'Deletes application commands.',
	execute: async message => {
		if (message.arguments.length === 0) return info(
			'Application Commands',
			'Type `' +  Prefix + 'forget <name>` to delete the command.'
		);
		const old = await getGuildApplicationCommands(bot, message.guildId);
		old.forEach(async (command, id) => {
			if (message.arguments.includes(command.name))
				await deleteGuildApplicationCommand(bot, id, message.guildId);
		});
		return success('Application Commands', 'Command deleted!');
	}
});

// ==== Twitch Actions =========================================================

export async function reloadActions() {
	actions = await Database.get('actions');
	if (actions === undefined || actions === null) {
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
	fetch(ActionURL + "refresh/");
}

export async function addAction(data) {
	await reloadActions();
	const action = actions.find(a => a.commands.includes(data.commands[0]));
	if (action !== undefined) {
		if (data.reply.length > 0) action.reply = data.reply;
		action.permissions = data.permissions;
		await Database.set('actions', actions);
		fetch(ActionURL + "refresh/");
		return;
	}
	actions.push(data);
	await Database.set('actions', actions);
	fetch(ActionURL + "refresh/");
}

export async function actionPermissions(action, perm) {
	if (![ 'mod', 'sub', 'vip', 'all' ].includes(perm)) perm = 'all';
	await reloadActions();
	action = actions.find(a => a.commands.includes(action));
	if (action === undefined) return;
	action.permissions = perm;
	await Database.set('actions', actions);
	fetch(ActionURL + "refresh/");
}

export async function addAliases(name, aliases) {
	const remove_duplicates = a => [...new Set(a)];
	await reloadActions();
	for (const action of actions) if (action.commands.includes(name)) {
		action.commands = remove_duplicates(action.commands.concat(aliases));
		await Database.set('actions', actions);
		fetch(ActionURL + "refresh/");
		return;
	}
}

// Announcments ---
export async function addAnnouncement(data) {
	await reloadActions();
	const announcement = announcement.find(a => a.name.includes(data.commands[0]));
	if (announcement !== undefined) {
		if (data.reply.length > 0) action.reply = data.reply;
		action.permissions = data.permissions;
		await Database.set('announcements', announcement);
		fetch(ActionURL + "refresh/");
		return;
	}
	announcement.push(data);
	await Database.set('announcements', announcement);
	fetch(ActionURL + "refresh/");
}