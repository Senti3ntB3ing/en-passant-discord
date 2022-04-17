
export class Database {

	static #url = 'https://en-passant-339215-default-rtdb.firebaseio.com/';
	static #SECRET = Deno.env.get('FIREBASE_SECRET');

	static async get(key) {
		return await fetch(this.#url + encodeURIComponent(key) + '/.json?auth=' + this.#SECRET)
			.then(e => e.text())
			.then(value => {
				if (!value) return null;
				try { value = JSON.parse(value); }
				catch { return null; }
				if (value == undefined || value == null || value.error != undefined) return null;
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
				if (value == undefined || value == null || value.error != undefined) return null;
				return value;
			});
	}

}
