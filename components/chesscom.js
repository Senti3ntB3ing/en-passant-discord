
export class Chess {

	static com = {

		profile: async user => {
			user = encodeURIComponent(user);
			const url = 'https://api.chess.com/pub/player/';
			try {
				const response = await fetch(url + user);
				if (response.status != 200) return null;
				return await response.json();
			} catch { return null; }
		},

		stats: async user => {
			user = encodeURIComponent(user);
			const url = `https://api.chess.com/pub/player/${user}/stats`;
			try {
				const response = await fetch(url);
				if (response.status != 200) return null;
				return await response.json();
			} catch { return null; }
		},

		ratings: async user => {
			const categories = [ 'rapid', 'blitz', 'bullet' ];
			const ratings = [];
			const chess_com = await Chess.com.stats(user);
			if (chess_com == null) return undefined;
			for (const category of categories) {
				const key = 'chess_' + category;
				if (chess_com[key] == undefined ||
					chess_com[key].last == undefined ||
					chess_com[key].last.rating == undefined) continue;
				const rating = { category, rating: 'unrated' };
				if (!isNaN(parseInt(chess_com[key].last.rating)))
					rating.rating = chess_com[key].last.rating;
				ratings.push(rating);
			}
			return ratings;
		},

		best: async user => {
			const categories = [ 'rapid', 'blitz', 'bullet' ];
			const ratings = [];
			const chess_com = await Chess.com.stats(user);
			if (chess_com == null) return undefined;
			for (const category of categories) {
				const key = 'chess_' + category;
				if (chess_com[key] == undefined ||
					chess_com[key].best == undefined ||
					chess_com[key].best.rating == undefined) continue;
				const rating = { category, rating: 'unrated' };
				if (!isNaN(parseInt(chess_com[key].best.rating)))
					rating.rating = chess_com[key].best.rating;
				ratings.push(rating);
			}
			return ratings;
		},

		puzzles: async user => {
			const ratings = [];
			const chess_com = await Chess.com.stats(user);
			if (chess_com == null) return undefined;
			if (chess_com['tactics'] != undefined &&
				chess_com['tactics'].highest != undefined &&
				chess_com['tactics'].highest.rating != undefined &&
				!isNaN(parseInt(chess_com['tactics'].highest.rating))) ratings.push({
					category: 'tactics', rating: chess_com['tactics'].highest.rating
			});
			if (chess_com['puzzle_rush'] != undefined &&
				chess_com['puzzle_rush'].best != undefined &&
				chess_com['puzzle_rush'].best.score != undefined &&
				!isNaN(parseInt(chess_com['puzzle_rush'].best.score))) ratings.push({
					category: 'puzzle rush', rating: chess_com['puzzle_rush'].best.score
			});
			return ratings;
		},

		exists: async user => {
			user = encodeURIComponent(user);
			const url = `https://api.chess.com/pub/player/${user}/stats`;
			try {
				const response = await fetch(url);
				return (response.status == 200);
			} catch { return false; }
		},

		/// gets daily game from chess.com given its
		/// id returns undefined in case of error.
		daily: async id => {
			const API_BASE_URL = 'https://www.chess.com/callback/daily/game/';
			let g = undefined;
			try {
				g = await fetch(API_BASE_URL + id).then(
					r => r.status == 200 ? r.json() : undefined
				);
			} catch { return undefined; }
			if (g == undefined) return undefined;
			g.game.moveList = moves(g.game.moveList);
			return g.game;
		},

		/// gets live game from chess.com given its
		/// id returns undefined in case of error.
		live: async id => {
			const API_BASE_URL = 'https://www.chess.com/callback/live/game/';
			let g = undefined;
			try {
				g = await fetch(API_BASE_URL + id).then(
					r => r.status == 200 ? r.json() : undefined
				);
			} catch { return undefined; }
			if (g == undefined) return undefined;
			g.game.moveList = moves(g.game.moveList);
			return g.game;
		}

	};

}

// MOVES:

// https://github.com/andyruwruw/chess-web-api/issues/10#issuecomment-779735204
const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?';
const FILES = 'abcdefgh';

// https://github.com/andyruwruw/chess-web-api/issues/11#issuecomment-783687021
const PROMOTIONS = '#@$_[]^()~{}';
const PIECES = 'brnq';

/// decodes a move into algebraic notation or pawn promotion.
/// - move: string of two characters.
function decode(move) {
	let index = S.indexOf(move[0]);
	const f1 = FILES[index % 8], r1 = Math.floor(index / 8) + 1;
	index = S.indexOf(move[1]);
	let p, f2, r2;
	if (index == -1) {
		index = PROMOTIONS.indexOf(move[1]);
		p = PIECES[Math.floor(index / 3)];
		f2 = FILES.indexOf(f1);
		const l = index % 3 == 1, r = index % 3 == 2;
		if (l) f2--; else if (r) f2++; // capture left or right
		f2 = FILES[f2];
		if (r1 == 2) r2 = 1; else r2 = 8;
	} else { f2 = FILES[index % 8]; r2 = Math.floor(index / 8) + 1; }
	return { from: `${f1}${r1}`, to: `${f2}${r2}`, promotion: p };
}

/// decodes a list of moves from a string.
function moves(m) {
	const list = [];
	for (let i = 0; i < m.length; i += 2) {
		const move = decode(m.substring(i, i + 2));
		list.push(move);
	}
	return list;
}
