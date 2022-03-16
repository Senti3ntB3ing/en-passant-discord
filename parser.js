
import { sendMessage, addRole, removeRole } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { closest, levenshtein } from './components/levenshtein.js';

import { Name, Prefix, Roles, ColorCodes } from './config.js';
import { bot } from './main.js';

export let commands = [], primary = [], tasks = {}, record = [], lastPing = new Date();

let attempts = {};

export const resetAttempts = () => attempts = {};

function handle(command, bot, message, content, args) {
	if (message.member.roles.includes(Roles.spammer)) return;
	message.arguments = args;
	message.bot = bot;
	message.command = content;
	message.text = message.content.replace(/^(.*?)\s+/g, '').trim();
	if (!message.member.roles.includes(Roles.moderator)) {
		if (message.member.id in attempts) attempts[message.member.id]++;
		else attempts[message.member.id] = 0;
		if (attempts[message.member.id] >= 10) {
			addRole(bot, message.guildId, message.member.id, Roles.spammer);
			sendMessage(bot, message.channelId, warn(
				'Command usage limit exceeded!',
				`<@${message.member.id}> has been given the \`@spammer\` role!\n` +
				'Ask a moderator to remove it.'
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

export function parse(bot, message) {
	if (!message.content.startsWith(Prefix)) return;
	const args = message.content.split(/\s+/g);
	const content = args.splice(0, 1)[0].substring(Prefix.length).toLowerCase();
	for (const command of commands) {
		if (command.name == content ||
			command.aliases.includes(content)) {
			if (command.permissions.includes(Roles.everyone)) {
				handle(command, bot, message, content, args);
				return;
			}
			for (const role of message.member.roles) {
				if (command.permissions.includes(role)) {
					handle(command, bot, message, content, args);
					return;
				}
			}
		}
	}
	// command not found, check for typos:
	const closestCommand = closest(content, primary);
	const distance = levenshtein(closestCommand, content);
	if (distance <= 2) sendMessage(bot, message.channelId, info(
		'Command Information',
		`There is no command named \`${Prefix}${content}\`.\n` +
		`Did you mean \`${Prefix}${closestCommand}\` instead?`
	));
}

export function createCommand(command) {
	if (typeof command.execute != 'function') return;
	if (command.name == undefined) return;
	if (command.aliases == undefined) command.aliases = [ ];
	if (command.hidden == undefined) command.hidden = false;
	if (command.permissions == undefined) {
		command.permissions = [ Roles.everyone];
	} else if (typeof command.permissions != 'object') {
		command.permissions = [ command.permissions ];
	}
	commands.push(command);
	primary.push(command.name.toLowerCase());
}

export function createTask(task) {
	if (typeof task.execute != 'function') return;
	if (task.name == undefined) return;
	if (task.interval == undefined && task.time == undefined) return;
	if (tasks[task.name] != undefined) return;
	if (task.disabled == undefined) task.disabled = false;
	task.last_execution = new Date(Date.now() - 86400000); // yesterday
	tasks[task.name] = task;
}

export function stopTask(task) {
	if (tasks[task] != undefined) {
		tasks[task].disabled = true;
		log('task', `${task} stopped`);
	}
}

async function executeTasks() {
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
		tasks[name].execute(bot);
		log('task', `${name} executed`);
	}
}

export async function createTaskServer(server, callback) {
	for await (const request of server) {
		callback(request);
		if (request.url == '/task') executeTasks();
	}
}

export function text(message) { return { content: message }; }

export function card(title, message, color) {
	return {
		embeds: [{
			title: title || Name,
			color: color || ColorCodes.normal,
			description: message || ''
		}]
	};
}

export function cards(elements) {
	return {
		embeds: elements.map(element => ({
			type: 'rich',
			title: element.title || Name,
			color: element.color || ColorCodes.normal,
			fields: element.fields || [],
			description: element.message || ''
		}))
	};
}

export function field(title, subtitle, message, color) {
	return {
		embeds: [{
			type: 'rich',
			title: title || Name,
			color: color || ColorCodes.normal,
			fields: [{ name: subtitle, value: message, inline: false }]
		}]
	};
}

export function error(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.error,
			description: ':no_entry_sign: ' + (message || 'Error!')
		}]
	};
}

export function info(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.info,
			description: ':information_source: ' + (message || 'Information.')
		}]
	};
}

export function success(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.success,
			description: ':white_check_mark: ' + (message || 'Success!')
		}]
	};
}

export function warn(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCodes.warn,
			description: ':warning: ' + (message || 'Warning!')
		}]
	};
}

export function createHelp(title, mod = false) {
	return {
		embeds: [{
			type: 'rich',
			title: title || Name,
			color: ColorCodes.normal,
			fields: commands.filter(command => mod || !command.hidden).map(command => {
				let aliases = '';
				if (mod && command.aliases.length > 0)
					aliases = ' | `' + Prefix + command.aliases.join('` | `' + Prefix) + '`';
				return {
					name: `${command.emoji || ''} \`${Prefix}${command.name}\`${aliases}:`,
					value: command.description || 'No description.',
					inline: false
				};
			})
		}]
	};
}

export function log(component, text) {
	if (record.length == 20) record.shift();
	record.push(`[${(new Date()).toLocaleTimeString('en-GB', {
		timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric'
	})} UTC] ${component}: ${text}`);
	console.log(record[record.length - 1]);
}

export function fetchLog() {
	return record.join('\n') +
		`\n[${lastPing.toLocaleTimeString('en-GB', {
			timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric'
		})} UTC] task: last ping received`;
}
