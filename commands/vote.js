
import { Prefix, Roles, Channels } from '../config.js';
import {
	Option, command, prefix, card, error, info, success, warn,
	send, bless
} from '../parser.js';
import {
	game, playing, moves, getGame, setGame, count, hasVoted, vote
} from '../components/votechess.js';
import { Chess } from '../components/chess.js';
import { stateMessage } from '../components/diagram/diagram.js';
import { Database } from '../database.js';

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

prefix({
	name: 'game', emoji: ':clipboard:',
	description: `New <#${Channels.vote_chess}> \`${Prefix}game <id>\`.`,
	execute: async message => {
		const title = 'Vote Chess';
		if (await playing()) return error(title, 'Game already in progress!');
		let g = await game(message.arguments[0]);
		if (g == undefined)
			return error(title, 'Game id not found on __chess.com__!');
		g.moveList = moves(g.moveList);
		const board = new Chess(g.pgnHeaders.FEN);
		for (const move of g.moveList) if (board.move(move) == null)
			return error(title, `Something went wrong parsing: ${move}`);
		/// make a status message:
		const perspective = g.pgnHeaders.White == 'thechessnerd' ? 'b' : 'w';
		const status = await stateMessage(title, board, perspective);
		const sm = await send(Channels.vote_chess, status);
		setGame(message.arguments[0], sm.id, g.moveList.length); // database
	}
});

command({
	name: 'vote', emoji: ':ballot_box:',
	description: `🔖 Vote a move for vote chess.`,
	options: [{
		description: 'Move to vote for.', name: 'move',
		type: Option.String, required: true
	}],
	execute: async interaction => {
		const title = 'Vote Chess';
		const pe = info(title,
			`There is no <#${Channels.vote_chess}> game in progress right now!`
		);
		if (!(await playing())) return pe;
		const [ id, st, _ ] = await getGame();
		let g = await game(id);
		if (g == undefined)
			return error(title, 'Game id not found on __chess.com__!');
		if (g.isFinished) {
			// TODO: clean state. this will never happen anyways
			return pe;
		}
		const turn = g.turnColor.toLowerCase();
		const zach = g.pgnHeaders.White == 'thechessnerd' ? 'white' : 'black';
		if (turn == zach)
			return info(title, 'You can\'t vote when it\'s not your turn!');
		g.moveList = moves(g.moveList);
		const board = new Chess(g.pgnHeaders.FEN);
		for (const move of g.moveList) if (board.move(move) == null)
			return error(title, `Something went wrong parsing: ${move}`);
		let move = interaction.data.options[0].value.toLowerCase();
		if (move != 'draw' && move != 'resign') {
			// exf3 e.p.
			move = interaction.data.options[0].value
				.replace(/\s*e\s*\.?\s*p\s*\.?\s*$/gi, '').replace(/0/g, 'O');
			move = board.move(move);
			if (move == null) return error(title,
				'`' + interaction.data.options[0].value +
				'` is not a valid move!'
			);
			move = move.san; // standard algebraic notations
		}
		if ((await Database.get(interaction.member.id)) == null) return warn(
			title,
			'You must `/connect` your chess profile in <#' +
			Channels.bots + '> before voting!'
		);
		const voted = await hasVoted(interaction.member.id);
		vote(interaction.member.id, move);
		bless(interaction.guildId, interaction.member.id, Roles.voter);
		if (voted) return success(title,
			'Your previous vote has been changed to `' + move + '`!'
		);
		return success(title, 'You voted for the move `' + move + '`!');
	}
});

command({
	name: 'ballot', emoji: ':ballot_box:', options: [],
	description: `🗳 Count vote chess votes.`,
	execute: async () => {
		const title = 'Vote Chess Ballot';
		if (!(await playing())) return info(title,
			`There is no <#${Channels.vote_chess}> game in progress right now!`
		);
		const c = await count();
		let votes = [];
		for (const move in c) votes.push({ move, count: c[move] });
		if (votes.length == 0)
			return info(title, 'There are currently no votes.');
		votes = votes.sort((a, b) => b.count - a.count).map(
			v => '`' + v.move + '`: ' + v.count
		);
		return card(title, ':hash: ' + votes.join(' | '));
	}
});
