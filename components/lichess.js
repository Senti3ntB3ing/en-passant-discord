
export async function getLichessUser(user) {
	const url = 'https://lichess.org/api/user/';
	try {
		const response = await fetch(url + user);
		if (response.status != 200) return null;
		return await response.json();
	} catch { return null; }
}
