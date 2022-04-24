
import { Roles, Channels } from '../config.js';
import { createCommand, card, error } from '../parser.js';
import { game, playing, moves, setGame } from '../components/votechess.js';
import { Chess } from '../components/chess.js';
import { diagram } from '../components/diagram/diagram.js';

// ==== Vote chess use case: ===================================================
// #vote-chess is always read only and only contains the current game state.
// A mod creates a new game with the specified url `!game https://chess.com...`.
// Zach is random color and time control is 3 days per move.
// The bot needs a clean #vote-chess and #discussion before placing a new state
// message with the current position (also it sets message id in the database).
// Every `3 days` the bot automatically executes task `close` to close votes
// when it's our turn. It is possible to force this action with `!task close`.
// `!move` and the `close` task will update the state message in #vote-chess;
// If the bot detects a draw with `!draw` or a win, it will reset everything.
// If the state message has been deleted by accident, it makes a new one.
// People can `!vote move` in #dicussion and they will get an error message if
// the move is invalid or a confirmation in case it was a good move.
// In the vote phase there is a state message with the current votes that gets
// edited every time a vote comes. Voters are required to link one of their
// accounts to verify that they're less than 2000. Once the voting phase is over
// the message gets deleted.

// command !vote move: update votes with this new move
// command !task close: force close the voting poll and update the results

/// command !game <id>: initiate new game with id
createCommand({
	name: 'game', emoji: ':clipboard:', hidden: true,
	description: `New <#${Channels.vote_chess}> \`!game <id>\``,
	permissions: Roles.administrator,
	execute: async message => {
		const title = 'VoteChess error';
		if (await playing()) return error(title, 'Game already in progress!');
		let g = game(message.arguments[0]);
		if (g == undefined) return error(title, 'Game id not found on __chess.com__!');
		g.moveList = moves(g.moveList);
		console.log(g);
		const board = Chess(g.pgnHeaders.FEN);
		Object.keys(g.pgnHeaders).forEach(k => board.header(k, g.pgnHeaders[k]));
		for (const move of g.moveList) board.move(move);
		/// make a status message:
		let status = '';
		if (game.game_over()) {
			if (game.in_draw()) status = '½-½ ・ DRAW';
			else if (game.in_checkmate())
				status = game.turn() == 'w' ? '0-1 ・ BLACK WON' : '1-0 ・ WHITE WON';
		} else status = game.turn() == 'w' ? white_to_move : black_to_move;
		let update = {
			file: {
				blob: new Blob([ await diagram(board.board(), board.turn()) ]),
				name: 'board.png',
			},
			embeds: [{
				type: 'image',
				title: 'VoteChess position',
				color: game.turn() == 'w' ? 0xFFFFFF : 0x000000,
				image: { url: 'attachment://board.png' },
				footer: { text: status },
			}]
		};
		const id = await sendMessage(message.bot, Channels.vote_chess, update);
		setGame(message.arguments[0], id); // set game in database
	}
});

/*createCommand({
	name: 'vote', emoji: ':ballot_box:', aliases: [ 'play' ],
	description: `Vote a move to play in <#${Channels.vote_chess}>`,
	execute: message => {
		// check argument
		// check if theres a game in progress
		// check if it's the user's turn
		// check if the user has already voted
		// make sure the move is valid
		// place the vote
		// update the score (getting the messageid)
	}
});*/