
import { PGNURL, control, Themes } from '../config.js';

import { Chess as ChessBoard } from 'https://deno.land/x/beta_chess@v1.0.1/chess.js';
import { lichess } from '../components/lichessorg.js';
import { Chess } from '../components/chesscom.js';

export async function handleChesscomGame(type, id, perspective = 'w', theme, elo = false) {
	let game = undefined, data;
	if (type === 'live') game = await Chess.com.live(id);
	else game = await Chess.com.daily(id);
	if (game === undefined) return undefined;
	const board = new ChessBoard();
	let moves = '';
	for (let move of game.moveList) {
		if ((move = board.move(move)) == null) return undefined;
		if (move.san.startsWith('O-O')) {
			moves += (board.turn === 'w' ? 'h8f8e8g8' : 'h1f1e1g1') + ';';
			continue;
		} else if (move.san.startsWith('O-O-O')) {
			moves += (board.turn === 'w' ? 'a8d8e8c8' : 'a1d1e1c1') + ';';
			continue;
		} else if (move.flags.includes('e')) moves += '$'; // en-passant
		moves += move.from + move.to;
		if (move.promotion) moves += '=' + (
			move.color === 'w' ? move.promotion.toUpperCase() : move.promotion.toLowerCase()
		);
		moves += ';';
	}
	perspective = perspective == 'w' ? 'white' : 'black';
	try { data = await fetch(PGNURL + (theme || Themes.random()) + '/' + perspective + '/' + moves); }
	catch { return undefined; }
	if (data.status !== 200) return undefined;
	const w = game.pgnHeaders.White, b = game.pgnHeaders.Black;
	let description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
	description += ` ・ **Clock:** \`${control(game.pgnHeaders.TimeControl)}\``;
	if (elo) description += `\n**Elo:** ||\`⬜️ ${game.pgnHeaders.WhiteElo} | ${game.pgnHeaders.BlackElo} ⬛️\`||`;
	description += `\n**Link:** https://chess.com/game/${type}/${id}`;
	let status = '';
	if (game.isFinished) {
		status = game.pgnHeaders.Result.replace(/1\/2/, '½').replace(/\-/, '-');
		if (game.pgnHeaders.Termination != undefined)
			status += ' ・ ' + game.pgnHeaders.Termination;
	}
	const filename = `${w}_vs_${b}.gif`.replace(/[^A-Za-z0-9_.\-]/g, '_');
	return { file: { blob: await data.blob(), name: filename },
		embeds: [{
			type: 'rich', title: 'Game Preview', description, color: 0xFFFFFF,
			image: { url: 'attachment://' + filename }, footer: { text: status }
		}]
	};
}

export async function handlelichessorgGame(id, perspective = 'w', theme, elo = false) {
	const game = await lichess.org.game(id); let data;
	if (game === undefined || game.variant !== 'standard') return undefined;
	const board = new ChessBoard();
	game.moves = game.moves.split(' ');
	let moves = '';
	for (let move of game.moves) {
		if ((move = board.move(move)) == null) return undefined;
		if (move.san.startsWith('O-O')) {
			moves += (board.turn === 'w' ? 'h8f8e8g8' : 'h1f1e1g1') + ';';
			continue;
		} else if (move.san.startsWith('O-O-O')) {
			moves += (board.turn === 'w' ? 'a8d8e8c8' : 'a1d1e1c1') + ';';
			continue;
		} else if (move.flags.includes('e')) moves += '$'; // en-passant
		moves += move.from + move.to;
		if (move.promotion) moves += '=' + (
			move.color === 'w' ? move.promotion.toUpperCase() : move.promotion.toLowerCase()
		);
		moves += ';';
	}
	perspective = perspective == 'w' ? 'white' : 'black';
	try { data = await fetch(PGNURL + (theme || Themes.random()) + '/' + perspective + '/' + moves); }
	catch { return undefined; }
	if (data.status !== 200) return undefined;
	const w = 'user' in game.players.white ? game.players.white.user.name : 'Anonymous';
	const b = 'user' in game.players.black ? game.players.black.user.name : 'Anonymous';
	let description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
	let clock = 'clock' in game ? game.clock.initial : '';
	if ('increment' in game.clock) clock += game.clock.increment;
	if (clock.length > 0) description += ` ・ **Clock:** \`${control(clock)}\``;
	if (elo) description += `\n**Elo:** ||\`⬜️ ${game.players.white.rating} | ${game.players.black.rating} ⬛️\`||`;
	description += `\n**Link:** https://lichess.org/${id}`;
	if (perspective === 'b') description += `/black`;
	const filename = `${w}_vs_${b}.gif`.replace(/[^A-Za-z0-9_.\-]/g, '_');
	return { file: { blob: await data.blob(), name: filename },
		embeds: [{
			type: 'rich', title: 'Game Preview', description, color: 0xFFFFFF,
			image: { url: 'attachment://' + filename }
		}]
	};
}

export async function handlePGNGame(pgn, perspective = 'w', theme) {
	const game = new ChessBoard();
	if (!game.pgn(pgn)) return undefined;
	const h = game.header();
	const moves = game.history({ verbose: true }).map(
		m => (m.flags.includes('e') ? '$' : '') + // en passant
		(m.san.startsWith('O-O') ? // castling
			(m.color === 'b' ? 'h8f8e8g8' : 'h1f1e1g1') :
			(m.san.startsWith('O-O-O') ?
				(m.color === 'b' ? 'a8d8e8c8' : 'a1d1e1c1') : ( // normal
					m.from + m.to + (m.promotion ? '=' + ( // promotion
						m.color === 'w' ? m.promotion.toUpperCase() : m.promotion.toLowerCase()
					) : '')
				)
			)
		)
	).join(';');
	perspective = perspective == 'w' ? 'white' : 'black';
	let data;
	try { data = await fetch(PGNURL + (theme || Themes.random()) + '/' + perspective + '/' + moves); }
	catch { return undefined; }
	if (data.status !== 200) return undefined;
	const w = h['White'] || "Anonymous", b = h['Black'] || "Anonymous";
	let description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
	const t = h['TimeControl'];
	if (t != undefined && t != '') description += ` ・ **Clock:** \`${control(t)}\``;
	let status = '';
	if (game.ended()) {
		if (game.draw()) status = '½-½ ・ Draw';
		else if (game.checkmate()) status = (
			game.turn == 'w' ? '0-1 ・ ⬛️ Black Won' : '1-0 ・ ⬜️ White Won'
		);
	}
	const filename = `${w}_vs_${b}`.replace(/[^A-Za-z0-9_.\-]/g, '_');
	return {
		file: [
			{ blob: await data.blob(), name: filename + '.gif' },
			{ blob: new Blob([ pgn ], { type: 'text/plain' }), name: filename + '.pgn' },
		],
		embeds: [{
			type: 'rich', title: 'Game Preview', description, color: 0xFFFFFF,
			image: { url: 'attachment://' + filename + '.gif' }, footer: { text: status }
		}]
	};
}
