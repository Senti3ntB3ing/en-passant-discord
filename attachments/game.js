
import { PGNURL, control } from '../config.js';
import { send } from '../parser.js';

import { Chess as ChessBoard } from 'https://deno.land/x/beta_chess@v1.0.1/chess.js';
import { Chess } from '../components/chesscom.js';

export async function handleChesscomGame(type, id, message) {
	let game = undefined;
	if (type == 'live') game = await Chess.com.live(id);
	else game = await Chess.com.daily(id);
	if (game == undefined) return;
	const board = new ChessBoard(game.pgnHeaders.FEN);
	for (const move of game.moveList) if (board.move(move) == null) return;
	const data = await fetch(PGNURL, {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST', body: JSON.stringify({ pgn: board.pgn() })
	});
	if (data.status != 200) return;
	const w = game.pgnHeaders.White, b = game.pgnHeaders.Black;
	let description = `⬜️ **\`${w}\`** vs **\`${b}\`** ⬛️`;
	description += ` ・ \`${control(game.pgnHeaders.TimeControl)}\``;
	let status = '';
	if (game.isFinished) {
		status = game.pgnHeaders.Result.replace(/1\/2/, '½').replace(/\-/, '-');
		if (game.pgnHeaders.Termination != undefined)
			status += ' ・ ' + game.pgnHeaders.Termination;
	}
	send(message.channelId, {
		file: { blob: await data.blob(), name: 'board.gif', },
		embeds: [{
			type: 'rich', title: 'Game Preview', description, color: 0xFFFFFF,
			image: { url: 'attachment://board.gif' },
			footer: { text: status }
		}]
	});
}
