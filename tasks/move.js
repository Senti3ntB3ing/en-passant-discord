
import { Chess } from 'https://deno.land/x/beta_chess@v1.0.1/chess.js';
import { createTask, send, error, remove } from '../parser.js';
import { Zach, Roles, Channels, Time } from '../config.js';
import {
	playing, game, getGame, setGame, endGame, clearVotes, moves
} from '../components/votechess.js';
import { stateMessage } from '../components/diagram/diagram.js';

createTask({
	name: 'move', emoji: ':clock:', interval: Time.hour,
	description: `Forces a <#${Channels.vote_chess}> board update.`,
	execute: async () => {
		if (!(await playing())) return;
		let [ id, st, m ] = await getGame();
		let g = await game(id);
		if (g == undefined) return;
		g.moveList = moves(g.moveList);
		console.log(g.isFinished);
		if (g.moveList.length == m && !g.isFinished) return;
		// someone moved, delete old status, make new one.
		try { await remove(st, Channels.vote_chess); } catch { }
		const b = new Chess(g.pgnHeaders.FEN);
		for (const move of g.moveList) if (b.move(move) == null) {
			send(Channels.vote_chess,
				error('Invalid Move', JSON.stringify(move))
			);
			return;
		}
		const p = g.pgnHeaders.White == 'thechessnerd' ? 'b' : 'w';
		const t = b.turn == 'w' ? 'white' : 'black';
		let message = `Hey <@&${Roles.voter}>s, `;
		if (g.isFinished) {
			endGame();
			message += `the game is over!`;
			send(Channels.vote_chess,
				await stateMessage('Vote Chess', b, p, message)
			);
			return;
		}
		clearVotes();
		const move = b.takeback();
		if (p == t[0]) message += `<@${Zach}> played \`${move.san}\`.`;
		else message += `**we** played \`${move.san}\`.`;
		message += `\nhttps://www.chess.com/game/daily/${id}`;
		b.move(move);
		st = (await send(Channels.vote_chess,
			await stateMessage('Vote Chess', b, p, message)
		)).id;
		setGame(id, st, g.moveList.length);
	}
});
