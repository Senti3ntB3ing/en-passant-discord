
import {
	sendMessage, publishMessage, editMember, deleteMessage, deleteMessages,
	getMessages, createApplicationCommand, getApplicationCommands, deleteApplicationCommand
} from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

import { closest } from './components/levenshtein.js';

import { Name, Prefix, Roles, Time, ColorCodes } from './config.js';
import { bot } from './main.js';

export let commands = [], tasks = {}, attachments = [], record = [];
let attempts = {}, lastPing = new Date();

export const resetAttempts = () => attempts = {};

// ==== Commands ===============================================================

function handleText(command, message, content, args) {
	message.arguments = args;
	message.bot = bot;
	message.command = content;
	message.text = message.content.replace(/^(.*?)\s+/g, '').trim();
	if (!message.member.roles.includes(Roles.moderator)) {
		if (!(message.member.id in attempts)) attempts[message.member.id] = 0;
		else attempts[message.member.id] += command.rate;
		if (attempts[message.member.id] >= 10) {
			editMember(bot, message.guildId, message.member.id, {
				communicationDisabledUntil: Time.minutes(10) + Date.now()
			});
			sendMessage(bot, message.channelId, warn(
				'Command usage limit exceeded!',
				`<@${message.member.id}> has been given a \`10m\` **TIMEOUT** for spamming!`
			));
			return;
		}
	}
	if (command.execute.constructor.name == 'AsyncFunction') {
		command.execute(message).then(result => {
			if (result != undefined) sendMessage(bot, message.channelId, result);
		});
		return;
	}
	const result = command.execute(message);
	if (result != undefined) sendMessage(bot, message.channelId, result);
}

async function handleFile(event, message, attachment) {
	if (event.execute.constructor.name == 'AsyncFunction') {
		event.execute(message, attachment).then(result => {
			if (result != undefined) sendMessage(bot, message.channelId, result);
		});
		return;
	}
	const result = event.execute(message, attachment);
	if (result != undefined) sendMessage(bot, message.channelId, result);
}

export function parse(message) {
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
	const args = message.content.split(/\s+/g);
	const content = args.splice(0, 1)[0].substring(Prefix.length).toLowerCase();
	for (const command of commands) {
		if (command.name == content ||
			command.aliases.includes(content)) {
			if (command.permissions.includes(Roles.everyone)) {
				handleText(command, message, content, args);
				return;
			}
			for (const role of message.member.roles) {
				if (command.permissions.includes(role)) {
					handleText(command, message, content, args);
					return;
				}
			}
		}
	}
	// command not found, check for typos:
	const filtered = commands.filter(command => !command.hidden)
		.map(command => [ command.name, command.aliases ].flat()).flat();
	const [ i, d ] = closest(content, filtered);
	if (d <= 2) sendMessage(bot, message.channelId, info(
		'Command Information',
		`There is no command named \`${Prefix}${content}\`.\n` +
		`Did you mean \`${Prefix}${filtered[i]}\` instead?`
	));
}

export function createCommand(command) {
	if (typeof command.execute != 'function') return;
	if (command.name == undefined) return;
	if (command.aliases == undefined) command.aliases = [ ];
	if (command.hidden == undefined) command.hidden = false;
	if (command.rate == undefined) command.rate = 1;
	if (command.permissions == undefined) {
		command.permissions = [ Roles.everyone];
	} else if (typeof command.permissions != 'object') {
		command.permissions = [ command.permissions ];
	}
	if (command.permissions.includes(Roles.moderator))
		command.permissions.push(Roles.nerd);
	commands.push(command);
}

// ==== Attachments ============================================================

export function createAttachment(attachment) {
	if (typeof attachment.execute != 'function') return;
	if (attachment.type == undefined) return;
	attachment.type = attachment.type.toLowerCase();
	attachments.push(attachment);
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

export async function executeTasks() {
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
		description: ':warning: ' + (message || 'Warning!')
	}]
});

// ==== Help ===================================================================

export function createHelp(mod = false) {
	let fields = commands.filter(command => mod || !command.hidden).map(command => {
		let aliases = '';
		if (mod && command.aliases.length > 0)
			aliases = ' | `' + Prefix + command.aliases.join('` | `' + Prefix) + '`';
		return {
			name: `${command.emoji || ''} \`${Prefix}${command.name}\`${aliases}:`,
			value: command.description || 'No description.',
			inline: false
		};
	});
	let embeds = [];
	for (let i = 0; i < fields.length; i += 25) {
		const end = (i + 25) > fields.length ? fields.length : (i + 25);
		embeds.push({
			type: 'rich',
			title: 'List of Commands',
			color: ColorCodes.normal,
			fields: fields.slice(i, end)
		});
	}
	if (mod) {
		embeds.push({
			type: 'rich',
			title: 'List of Tasks',
			color: ColorCodes.normal,
			fields: Object.keys(tasks).map(task => ({
				name: (tasks[task].emoji || ':mechanical_arm:') +
					' `' + task + '` [' + (tasks[task].time ||
					Time.value(tasks[task].interval)) + ']:',
				value: tasks[task].description || 'No description.',
				inline: false
			}))
		});
		embeds.push({
			type: 'rich',
			title: 'List of Attachment Events',
			color: ColorCodes.normal,
			fields: attachments.map(attachment => ({
				name: (attachment.emoji || ':paperclip:') +
					' `.' + attachment.type + ' files:',
				value: attachment.description || 'No description.',
				inline: false
			}))
		});
	}
	return { embeds };
}

// ==== Log ====================================================================

export function log(component, text) {
	if (record.length == 20) record.shift();
	record.push(`[${(new Date()).toLocaleTimeString('en-GB', {
		timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric'
	})} UTC] ${component}: ${text}`);
	console.log(record[record.length - 1]);
}

export function fetchLog() {
	return record.join('\n') + `\n[${lastPing.toLocaleTimeString('en-GB', {
		timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric'
	})} UTC] task: last ping received`;
}

// ==== Redirects ==============================================================

export const send = (channel, content) => sendMessage(bot, channel, content);
export const publish = (channel, id) => publishMessage(bot, channel, id);
export const remove = (data, channel, bulk = false) => {
	if (bulk) return deleteMessages(bot, channel, data);
	else return deleteMessage(bot, channel, data);
};


// ==== Application Commands ===================================================

const appCommands = [], handlers = {};

export function dispatch(interaction) {
	console.log(interaction);
}

export function command(command) {
	appCommands.push(command.command);
	handlers[command.command.name] = command.handler;
}

createCommand({
	name: 'register', emoji: ':pencil:', hidden: true,
	description: 'Registers application commands.',
	permissions: [ Roles.moderator ],
	execute: async message => {
		console.log(message.guild_id);
		try {
			// fetch old guild commands:
			const old = await getApplicationCommands(bot, message.guild_id);
			// delete old commands:
			old.forEach((_, id) => {
				deleteApplicationCommand(bot, id, message.guild_id);
			});
			// register new commands:
			for (const command of appCommands)
				createApplicationCommand(bot, command, message.guild_id);
		} catch { return error('Application Commands', 'Registration error!'); }
		// send success message:
		return success('Application Commands', 'Registration completed!');
	}
});
