
export async function getChess_comUser(user) {
	user = encodeURIComponent(user);
	const url = 'https://api.chess.com/pub/player/';
	try {
		const response = await fetch(url + user);
		if (response.status != 200) return null;
		return await response.json();
	} catch { return null; }
}

export async function getChess_comUserStats(user) {
	user = encodeURIComponent(user);
	const url = `https://api.chess.com/pub/player/${user}/stats`;
	try {
		const response = await fetch(url);
		if (response.status != 200) return null;
		return await response.json();
	} catch { return null; }
}

export async function getChess_comRatings(user) {
	const categories = [ 'bullet', 'blitz', 'rapid' ];
	let ratings = [];
	const chess_com = await getChess_comUserStats(user);
	if (chess_com == null) return undefined;
	for (const category of categories) {
		const key = 'chess_' + category;
		if (chess_com[key] == undefined ||
			chess_com[key].last == undefined ||
			chess_com[key].last.rating == undefined) continue;
		let rating = { category, rating: 'unrated' };
		if (!isNaN(parseInt(chess_com[key].last.rating)))
			rating.rating = chess_com[key].last.rating;
		ratings.push(rating);
	}
	return ratings;
}

export async function verifyChess_comUser(name, discord) {
	const chess_com = await getChess_comUser(name);
	if (chess_com == null) return undefined;
	discord = discord.replace(/\s+/g, '');
	return !(
		chess_com.location == undefined ||
		chess_com.location.replace(/\s+/g, '') != discord
	);
}
