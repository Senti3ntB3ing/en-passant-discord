
export async function getLichessUser(user) {
	const url = 'https://lichess.org/api/user/';
	try {
		const response = await fetch(url + user);
		if (response.status != 200) return null;
		return await response.json();
	} catch { return null; }
}

export async function getLichessRapidRating(user) {
	const lichess = await getLichessUser(user);
	if (lichess == null) return undefined;
	if (lichess.perfs == undefined ||
		lichess.perfs.rapid == undefined ||
		lichess.perfs.rapid.rating == undefined) return null;
	if (isNaN(parseInt(lichess.perfs.rapid.rating))) return 'unrated';
	return lichess.perfs.rapid.rating;
}

export async function verifyLichessUser(name, discord) {
	const lichess = await getLichessUser(name);
	if (lichess == null) return undefined;
	discord = discord.replace(/\s+/g, '');
	return !(
		lichess.profile == undefined ||
		lichess.profile.location == undefined ||
		lichess.profile.location.replace(/\s+/g, '') != discord
	);
}
