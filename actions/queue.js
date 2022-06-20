
import { Lock } from "https://deno.land/x/unified_deno_lock@v0.1.1/mod.ts";

import { Prefix, ordinal } from '../config.js';
import { programmable } from '../parser.js';
import { Database } from '../database.js';

const queueLock = new Lock();

class Queue {

	#queue = [];

	constructor() { this.#queue = []; }

	async refresh() {
		this.#queue = [];
		this.#queue = await Database.get('queue');
		if (this.#queue == null || this.#queue == undefined) return [];
		return this.#queue;
	}
	async enqueue(element) {
		await queueLock.knock();
		queueLock.lock();
		this.refresh();
		const index = this.#queue.findIndex(e => e.user == element.user);
		if (index != -1) { queueLock.unlock(); return index; }
		this.#queue.push(element);
		const position = this.#queue.length;
		await Database.set('queue', this.#queue);
		queueLock.unlock();
		return position;
	}
	async dequeue() {
		await queueLock.knock();
		queueLock.lock();
		this.refresh();
		const element = this.#queue.shift();
		await Database.set('queue', this.#queue);
		queueLock.unlock();
		return element;
	}
	async remove(filter_lambda) {
		await queueLock.knock();
		queueLock.lock();
		this.refresh();
		this.#queue = this.#queue.filter(filter_lambda);
		await Database.set('queue', this.#queue);
		queueLock.unlock();
	}

	async clear() {
		await queueLock.knock();
		queueLock.lock();
		this.#queue = [];
		await Database.set('queue', this.#queue);
		queueLock.unlock();
	}

}

const queue = new Queue();

programmable({
	commands: [ 'join' ],
	description: 'Join the current queue.',
	execute: async data => {
		const username = data.message.match(/join\s+(\w+)/);
		if (username == null || username.length < 2)
			return `Try with ${Prefix}join <Chess.com username>.`;
		const index = await queue.enqueue({
			user: data.username, profile: username[1]
		});
		const i = ordinal(index);
		return `@${data.username} aka '${username[1]}' is ${i} in the queue.`;
	}
});

programmable({
	commands: [ 'leave' ],
	description: 'Leave the current queue.',
	execute: async data => {
		queue.remove(e => e.user == data.username);
		return `@${data.username} left the queue.`;
	}
});

programmable({
	commands: [ 'next' ], moderator: true,
	description: 'Get the next in line in the queue.',
	execute: async () => {
		const element = await queue.dequeue();
		if (element == undefined) return `There is no one in the queue.`;
		return `@${element.user} aka '${element.profile}' is next.`;
	}
});

programmable({
	commands: [ 'queue' ],
	description: 'Displays the current queue.',
	execute: async () => {
		const list = await queue.refresh();
		if (list.length == 0) return 'The queue is empty.';
		return 'Queue: ' + list.map(e => e.profile).join(', ');
	}
});

programmable({
	commands: [ 'clear' ], moderator: true,
	description: 'Clears the current queue.',
	execute: async () => {
		await queue.clear();
		return 'The queue has been cleared.';
	}
});
