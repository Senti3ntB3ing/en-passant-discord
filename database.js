
/// https://firebase.google.com/docs/database/rest/start

export class Database {

	static #url = 'https://en-passant-405713-default-rtdb.firebaseio.com/';
	static #SECRET = Deno.env.get('FIREBASE_SECRET');

	static async get(key) {
		return await fetch(this.#url + encodeURIComponent(key) + '/.json?auth=' + this.#SECRET)
			.then(e => e.text())
			.then(value => {
				if (!value) return null;
				try { value = JSON.parse(value); }
				catch { return null; }
				if (value === undefined || value === null || value.error !== undefined) return null;
				return value;
			});
	}

	static async set(key, value) {
		await fetch(this.#url + encodeURIComponent(key) + '/.json?auth=' + this.#SECRET, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(value),
		});
	}

	static async push(key, value) {
		key = encodeURIComponent(key);
		const shallow = await fetch(this.#url + key + '/.json?shallow=true&auth=' + this.#SECRET)
			.then(e => e.text())
			.then(value => {
				if (!value) return null;
				try { value = JSON.parse(value); }
				catch { return null; }
				if (value === undefined || value === null || value.error !== undefined) return null;
				return value;
			});
		if (shallow === null || shallow === undefined || Object.keys(shallow) === 0) {
			await fetch(this.#url + key + '/.json?auth=' + this.#SECRET, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify([ value ]),
			});
			return;
		}
		const length = Object.keys(shallow).length;
		await fetch(this.#url + key + '/' + length + '/.json?auth=' + this.#SECRET, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(value),
		});
	}

	static async delete(key) {
		await fetch(
			this.#url + encodeURIComponent(key) + '/.json?auth=' + this.#SECRET,
			{ method: "DELETE" }
		);
	}

	static async dictionary() {
		return await fetch(this.#url + '/.json?auth=' + this.#SECRET)
			.then(e => e.text())
			.then(value => {
				if (!value) return null;
				try { value = JSON.parse(value); }
				catch { return null; }
				if (value === undefined || value === null || value.error !== undefined) return null;
				return value;
			});
	}

}
