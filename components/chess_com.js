
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

export async function getChess_comRapidRating(user) {
	const chess_com = await getChess_comUserStats(user);
	if (chess_com == null) return undefined;
	if (chess_com.chess_rapid == undefined ||
		chess_com.chess_rapid.last == undefined ||
		chess_com.chess_rapid.last.rating == undefined) return null;
	if (isNaN(parseInt(chess_com.chess_rapid.last.rating))) return 'unrated';
	return chess_com.chess_rapid.last.rating;
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
