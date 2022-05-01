
import { Roles, Channels } from '../config.js';
import { createCommand, card, error, info, success } from '../parser.js';
import { game, playing, moves, getGame, setGame, count } from '../components/votechess.js';
import { Chess } from '../components/chess.js';
import { stateMessage } from '../components/diagram/diagram.js';

import { sendMessage, addRole } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

// ==== Vote chess use case: ===================================================
// #vote-chess is always read only and only contains the current game state.
// A mod creates a new game with the specified id `!game <id>`.
// Zach gets a random color and time control is 3 days per move.
// The bot needs a clean #vote-chess and #discussion before placing a new state
// message (it also sets id, message id and move count in the database).
// The `!task move` will update the state message in #vote-chess;
// People can `!vote move` in #dicussion and they will get an error message if
// the move is invalid or a confirmation in case it was a valid move.

// command !vote move: update votes with this new move
// command !task move: force the update of the board

createCommand({
	name: 'game', emoji: ':clipboard:', hidden: true,
	description: `New <#${Channels.vote_chess}> \`!game <id>\``,
	permissions: Roles.administrator,
	execute: async message => {
		const title = 'Vote Chess Error';
		if (await playing()) return error(title, 'Game already in progress!');
		let g = await game(message.arguments[0]);
		if (g == undefined) return error(title, 'Game id not found on __chess.com__!');
		g.moveList = moves(g.moveList);
		const board = Chess(g.pgnHeaders.FEN);
		// Object.keys(g.pgnHeaders).forEach(k => board.header(k, g.pgnHeaders[k]));
		for (const move of g.moveList) if (board.move(move) == null)
			return error(title, `Something went wrong parsing: ${move}`);
		/// make a status message:
		const perspective = g.pgnHeaders.White == 'thechessnerd' ? 'b' : 'w';
		const status = await stateMessage('Vote Chess', board, perspective);
		const sm = await sendMessage(message.bot, Channels.vote_chess, status);
		setGame(message.arguments[0], sm.id, g.moveList.length); // set game in database
	}
});

createCommand({
	name: 'vote', emoji: ':ballot_box:', aliases: [ 'play' ], rate: 1,
	description: `Vote a move for <#${Channels.vote_chess}>`,
	execute: async message => {
		const title = 'Vote Chess Error';
		const pe = info(title, `There is no <#${Channels.vote_chess}> game in progress right now!`);
		if (!(await playing())) return pe;
		const [ id, st, _ ] = await getGame();
		let g = await game(id);
		if (g == undefined) return error(title, 'Game id not found on __chess.com__!');
		if (g.isFinished) {
			// TODO: clean state. this will never happen anyways, it's just a safeguard
			return pe;
		}
		const turn = g.turnColor.toLowerCase();
		const zach = g.pgnHeaders.White == 'thechessnerd' ? 'white' : 'black';
		if (turn == zach) return info(title, 'Can\'t vote when it\'s not your turn!');
		g.moveList = moves(g.moveList);
		const board = Chess(g.pgnHeaders.FEN);
		// Object.keys(g.pgnHeaders).forEach(k => board.header(k, g.pgnHeaders[k]));
		for (const move of g.moveList) if (board.move(move) == null)
			return error(title, `Something went wrong parsing: ${move}`);
		let move = message.arguments[0].toLowerCase();
		if (move != 'draw' && move != 'resign') {
			// exf3 e.p.
			move = message.arguments[0]
				.replace(/\s*e\s*\.?\s*p\s*\.?\s*$/gi, '')
				.replace('0-0-0', 'O-O-O').replace('0-0', 'O-O');
			move = board.move(move);
			if (move == null) return error(title,
				'`' + message.arguments[0] + '` is not a valid move!'
			);
			move = move.san; // standard algebraic notations
		}
		if (await hasVoted(message.author.id))
			return error(title, 'You can only vote once!');
		vote(message.author.id, move);
		// get the @voter badge to get notified.
		addRole(bot, message.guildId, message.member.id, Roles.voter);
		return success(title, 'Vote registered successfully!');
	}
});

createCommand({
	name: 'count', emoji: ':ballot_box:', rate: 1,
	description: `Count <#${Channels.vote_chess}> votes.`,
	execute: async () => {
		if (!(await playing())) return info('Vote Chess Error',
			`There is no <#${Channels.vote_chess}> game in progress right now!`
		);
		const c = await count();
		let votes = [];
		for (const [ move, count ] of c) votes.push(`\`${move}: ${count}\``);
		return card('Vote Chess Count', votes.join(' | '));
	}
});
