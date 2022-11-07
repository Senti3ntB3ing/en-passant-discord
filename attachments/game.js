
import { PGNURL, control } from '../config.js';
import { send } from '../parser.js';

import { Chess as ChessBoard } from 'https://deno.land/x/beta_chess@v1.0.1/chess.js';
import { lichess } from '../components/lichessorg.js';
import { Chess } from '../components/chesscom.js';

export async function handleChesscomGame(type, id, channel, perspective = 'w') {
	let game = undefined, data;
	if (type === 'live') game = await Chess.com.live(id);
	else game = await Chess.com.daily(id);
	if (game === undefined) return;
	const board = new ChessBoard(game.pgnHeaders.FEN);
	for (const move of game.moveList) if (board.move(move) == null) return;
	try {
		data = await fetch(PGNURL, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST', body: JSON.stringify({ pgn: board.pgn(), perspective })
		});
	} catch { return; }
	if (data.status !== 200) return;
	const w = game.pgnHeaders.White, b = game.pgnHeaders.Black;
	let description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
	description += ` ・ **Clock:** \`${control(game.pgnHeaders.TimeControl)}\``;
	description += `\n**Link:** https://chess.com/game/${type}/${id}`;
	let status = '';
	if (game.isFinished) {
		status = game.pgnHeaders.Result.replace(/1\/2/, '½').replace(/\-/, '-');
		if (game.pgnHeaders.Termination != undefined)
			status += ' ・ ' + game.pgnHeaders.Termination;
	}
	const filename = `${w}_vs_${b}.gif`.replace(/[^A-Za-z0-9_.\-]/g, '_');
	send(channel, { file: { blob: await data.blob(), name: filename, },
		embeds: [{
			type: 'rich', title: 'Game Preview', description, color: 0xFFFFFF,
			image: { url: 'attachment://' + filename }, footer: { text: status }
		}]
	});
}

export async function handlelichessorgGame(id, channel, perspective = 'w') {
	const game = await lichess.org.game(id); let data;
	if (game === undefined || game.variant !== 'standard') return;
	const board = new ChessBoard();
	game.moves = game.moves.split(' ');
	for (const move of game.moves) if (board.move(move) == null) { console.log(move); return; }
	try {
		data = await fetch(PGNURL, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST', body: JSON.stringify({ pgn: board.pgn(), perspective })
		});
	} catch { return; }
	if (data.status !== 200) {console.log('err2'); return; }
	const w = 'user' in game.players.white ? game.players.white.user.name : 'Anonymous';
	const b = 'user' in game.players.black ? game.players.black.user.name : 'Anonymous';
	let description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
	let clock = 'clock' in game ? game.clock.initial : '';
	if ('increment' in game.clock) clock += game.clock.increment;
	if (clock.length > 0) description += ` ・ **Clock:** \`${control(clock)}\``;
	description += `\n**Link:** https://lichess.org/${id}`;
	if (perspective === 'b') description += `/black`;
	const filename = `${w}_vs_${b}.gif`.replace(/[^A-Za-z0-9_.\-]/g, '_');
	send(channel, { file: { blob: await data.blob(), name: filename, },
		embeds: [{
			type: 'rich', title: 'Game Preview', description, color: 0xFFFFFF,
			image: { url: 'attachment://' + filename }
		}]
	});
}
