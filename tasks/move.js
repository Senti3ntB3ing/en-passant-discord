
import { sendMessage, deleteMessage } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

import { createTask } from '../parser.js';
import { Roles, Channels, Time } from '../config.js';
import { Chess } from '../components/chess.js';
import { playing, game, getGame, setGame, endGame, clearVotes, moves } from '../components/votechess.js';
import { stateMessage } from '../components/diagram/diagram.js';

createTask({
	name: 'move',
	interval: Time.hour,
	execute: async bot => {
		if (!(await playing())) return;
		let [ id, st, m ] = await getGame();
		let g = await game(id);
		if (g == undefined) return;
		g.moveList = moves(g.moveList);
		if (g.moveList.length == m) return;
		// someone moved, delete old status, make new one.
		try { await deleteMessage(bot, Channels.vote_chess, st); } catch { }
		const b = Chess(g.pgnHeaders.FEN);
		for (const move of g.moveList) b.move(move);
		const p = g.pgnHeaders.White == 'thechessnerd' ? 'b' : 'w';
		const t = b.turn() == 'w' ? 'white' : 'black';
		let message = `Hey <@${Roles.voter}>s, `;
		if (g.isFinished) {
			endGame();
			message += `the game is over!`;
			sendMessage(bot, Channels.vote_chess,
				await stateMessage('Vote Chess', b, p, message)
			);
			return;
		}
		clearVotes();
		const move = b.undo();
		if (p == t[0]) message += `<@${Roles.Zach}> played \`${move.san}\`.`;
		else message += `**we** played \`${move.san}\`.`;
		b.move(move);
		st = (await sendMessage(bot, Channels.vote_chess,
			await stateMessage('Vote Chess', b, p, message)
		)).id;
		setGame(id, st, g.moveList.length);
	}
});
