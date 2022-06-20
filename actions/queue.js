
import { Prefix, ordinal } from '../config.js';
import { programmable } from '../parser.js';

class Queue {

	#queue = [];

	constructor() { this.#queue = []; }

	enqueue(element, find_lambda) {
		if (this.#queue.findIndex(find_lambda) != -1) return null;
		this.#queue.push(element);
		const position = this.#queue.length;
		return position;
	}
	dequeue() { return this.#queue.shift(); }
	remove(filter_lambda) { this.#queue = this.#queue.filter(filter_lambda); }
	clear() { this.#queue = []; }
	list() { return this.#queue; }

}

const queue = new Queue();

programmable({
	commands: [ 'join' ],
	description: 'Join the current queue.',
	execute: data => {
		const username = data.message.match(/join\s+(\w+)/);
		if (username == null || username.length < 2)
			return `Try with ${Prefix}join <Chess.com username>.`;
		const i = queue.enqueue({
			user: data.username, profile: username[1] },
			e => e.user == data.username
		);
		if (i == null) return `You are already in the queue.`;
		const j = ordinal(i);
		return `@${data.username} aka '${username[1]}' is ${j} in the queue.`;
	}
});

programmable({
	commands: [ 'leave' ],
	description: 'Leave the current queue.',
	execute: data => {
		queue.remove(e => e.user != data.username);
		return `@${data.username} left the queue.`;
	}
});

programmable({
	commands: [ 'next' ], moderator: true,
	description: 'Get the next in line in the queue.',
	execute: () => {
		const element = queue.dequeue();
		if (element == undefined) return `There is no one in the queue.`;
		return `@${element.user} aka '${element.profile}' is next.`;
	}
});

programmable({
	commands: [ 'queue' ],
	description: 'Displays the current queue.',
	execute: () => {
		const list = queue.list();
		if (list.length == 0) return 'The queue is empty.';
		return 'Queue: ' + list.map(e => e.profile).join(', ');
	}
});

programmable({
	commands: [ 'clear' ], moderator: true,
	description: 'Clears the current queue.',
	execute: () => {
		queue.clear();
		return 'The queue has been cleared.';
	}
});
