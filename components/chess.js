/*
 * Copyright (c) 2021, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *		this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *		this list of conditions and the following disclaimer in the documentation
 *		and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

 export const Chess = function(fen) {

	const BLACK = 'b';
	const WHITE = 'w';
	const EMPTY = - 1;

	const PAWN   = 'p';
	const KNIGHT = 'n';
	const BISHOP = 'b';
	const ROOK   = 'r';
	const QUEEN  = 'q';
	const KING   = 'k';

	const SYMBOLS = 'pnbrqkPNBRQK';

	const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

	const TERMINATION_MARKERS = [ '1-0', '0-1', '1/2-1/2', '*' ];

	const PAWN_OFFSETS = {
		b: [ 16, 32, 17, 15 ],
		w: [ -16, -32, -17, -15 ],
	};

	const PIECE_OFFSETS = {
		n: [ -18, -33, -31, -14, 18, 33, 31, 14 ],
		b: [ -17, -15, 17, 15 ],
		r: [ -16, 1, 16, -1 ],
		q: [ -17, -16, -15, 1, 17, 16, 15, -1 ],
		k: [ -17, -16, -15, 1, 17, 16, 15, -1 ],
	};

	const ATTACKS = [
		20,  0,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0,  0, 20,  0,
		 0, 20,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0, 20,  0,  0,
		 0,  0, 20,  0,  0,  0,  0, 24,  0,  0,  0,  0, 20,  0,  0,  0,
		 0,  0,  0, 20,  0,  0,  0, 24,  0,  0,  0, 20,  0,  0,  0,  0,
		 0,  0,  0,  0, 20,  0,  0, 24,  0,  0, 20,  0,  0,  0,  0,  0,
		 0,  0,  0,  0,  0, 20,  2, 24,  2, 20,  0,  0,  0,  0,  0,  0,
		 0,  0,  0,  0,  0,  2, 53, 56, 53,  2,  0,  0,  0,  0,  0,  0,
		24, 24, 24, 24, 24, 24, 56,  0, 56, 24, 24, 24, 24, 24, 24,  0,
		 0,  0,  0,  0,  0,  2, 53, 56, 53,  2,  0,  0,  0,  0,  0,  0,
		 0,  0,  0,  0,  0, 20,  2, 24,  2, 20,  0,  0,  0,  0,  0,  0,
		 0,  0,  0,  0, 20,  0,  0, 24,  0,  0, 20,  0,  0,  0,  0,  0,
		 0,  0,  0, 20,  0,  0,  0, 24,  0,  0,  0, 20,  0,  0,  0,  0,
		 0,  0, 20,  0,  0,  0,  0, 24,  0,  0,  0,  0, 20,  0,  0,  0,
		 0, 20,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0, 20,  0,  0,
		20,  0,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0,  0, 20
	];

	const RAYS = [
		17,   0,   0,   0,   0,   0,   0,  16,   0,   0,   0,   0,   0,   0,  15,  0,
		 0,  17,   0,   0,   0,   0,   0,  16,   0,   0,   0,   0,   0,  15,   0,  0,
		 0,   0,  17,   0,   0,   0,   0,  16,   0,   0,   0,   0,  15,   0,   0,  0,
		 0,   0,   0,  17,   0,   0,   0,  16,   0,   0,   0,  15,   0,   0,   0,  0,
		 0,   0,   0,   0,  17,   0,   0,  16,   0,   0,  15,   0,   0,   0,   0,  0,
		 0,   0,   0,   0,   0,  17,   0,  16,   0,  15,   0,   0,   0,   0,   0,  0,
		 0,   0,   0,   0,   0,   0,  17,  16,  15,   0,   0,   0,   0,   0,   0,  0,
		 1,   1,   1,   1,   1,   1,   1,   0,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  0,
		 0,   0,   0,   0,   0,   0, -15, -16, -17,   0,   0,   0,   0,   0,   0,  0,
		 0,   0,   0,   0,   0, -15,   0, -16,   0, -17,   0,   0,   0,   0,   0,  0,
		 0,   0,   0,   0, -15,   0,   0, -16,   0,   0, -17,   0,   0,   0,   0,  0,
		 0,   0,   0, -15,   0,   0,   0, -16,   0,   0,   0, -17,   0,   0,   0,  0,
		 0,   0, -15,   0,   0,   0,   0, -16,   0,   0,   0,   0, -17,   0,   0,  0,
		 0, -15,   0,   0,   0,   0,   0, -16,   0,   0,   0,   0,   0, -17,   0,  0,
	   -15,   0,   0,   0,   0,   0,   0, -16,   0,   0,   0,   0,   0,   0, -17
	];

	const SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

	const FLAGS = {
		      NORMAL: 'n',
		     CAPTURE: 'c',
		    BIG_PAWN: 'b',
		  EP_CAPTURE: 'e',
		   PROMOTION: 'p',
		KSIDE_CASTLE: 'k',
		QSIDE_CASTLE: 'q',
	};

	const BITS = {
		      NORMAL: 1,
		     CAPTURE: 2,
		    BIG_PAWN: 4,
		  EP_CAPTURE: 8,
		   PROMOTION: 16,
		KSIDE_CASTLE: 32,
		QSIDE_CASTLE: 64,
	};

	const RANK_1 = 7;
	const RANK_2 = 6;
	const RANK_3 = 5;
	const RANK_4 = 4;
	const RANK_5 = 3;
	const RANK_6 = 2;
	const RANK_7 = 1;
	const RANK_8 = 0;

	const SQUARES = {
		a8: 0x00, b8: 0x01, c8: 0x02, d8: 0x03, e8: 0x04, f8: 0x05, g8: 0x06, h8: 0x07,
		a7: 0x10, b7: 0x11, c7: 0x12, d7: 0x13, e7: 0x14, f7: 0x15, g7: 0x16, h7: 0x17,
		a6: 0x20, b6: 0x21, c6: 0x22, d6: 0x23, e6: 0x24, f6: 0x25, g6: 0x26, h6: 0x27,
		a5: 0x30, b5: 0x31, c5: 0x32, d5: 0x33, e5: 0x34, f5: 0x35, g5: 0x36, h5: 0x37,
		a4: 0x40, b4: 0x41, c4: 0x42, d4: 0x43, e4: 0x44, f4: 0x45, g4: 0x46, h4: 0x47,
		a3: 0x50, b3: 0x51, c3: 0x52, d3: 0x53, e3: 0x54, f3: 0x55, g3: 0x56, h3: 0x57,
		a2: 0x60, b2: 0x61, c2: 0x62, d2: 0x63, e2: 0x64, f2: 0x65, g2: 0x66, h2: 0x67,
		a1: 0x70, b1: 0x71, c1: 0x72, d1: 0x73, e1: 0x74, f1: 0x75, g1: 0x76, h1: 0x77
	};

	var ROOKS = {
		w: [
			{
				square: SQUARES.a1,
				flag: BITS.QSIDE_CASTLE
			},
			{
				square: SQUARES.h1,
				flag: BITS.KSIDE_CASTLE
			},
		],
		b: [
			{
				square: SQUARES.a8,
				flag: BITS.QSIDE_CASTLE
			},
			{
				square: SQUARES.h8,
				flag: BITS.KSIDE_CASTLE
			},
		],
	};

	var board = new Array(128);
	var kings = { w: EMPTY, b: EMPTY };
	var turn = WHITE;
	var castling = { w: 0, b: 0 };
	var ep_square = EMPTY;
	var half_moves = 0;
	var move_number = 1;
	var history = [ ];
	var header = { };
	var comments = { };

	if (typeof fen === 'undefined') load(DEFAULT_POSITION);
	else load(fen);

	function clear(keep_headers) {
		if (typeof keep_headers === 'undefined') keep_headers = false;
		board = new Array(128);
		kings = { w: EMPTY, b: EMPTY };
		turn = WHITE;
		castling = { w: 0, b: 0 };
		ep_square = EMPTY;
		half_moves = 0;
		move_number = 1;
		history = [ ];
		if (!keep_headers) header = { };
		comments = { };
		update_setup(generate_fen());
	}

	function prune_comments() {
		let reversed_history = [ ];
		let current_comments = { };
		const copy_comment = function(fen) {
			if (fen in comments) current_comments[fen] = comments[fen];
		}
		while (history.length > 0) reversed_history.push(undo_move());
		copy_comment(generate_fen());
		while (reversed_history.length > 0) {
			make_move(reversed_history.pop());
			copy_comment(generate_fen());
		}
		comments = current_comments;
	}

	function reset() { load(DEFAULT_POSITION); }

	function load(fen, keep_headers) {
		if (typeof keep_headers === 'undefined') keep_headers = false;
		const tokens = fen.split(/\s+/);
		const position = tokens[0];
		let square = 0;
		if (!validate_fen(fen)) return false;
		clear(keep_headers);
		for (let i = 0; i < position.length; i++) {
			const piece = position.charAt(i);
			if (piece === '/') square += 8;
			else if (is_digit(piece)) square += parseInt(piece, 10);
			else {
				put({
					type: piece.toLowerCase(),
					color: (piece < 'a' ? WHITE : BLACK)
				}, algebraic(square));
				square++;
			}
		}
		turn = tokens[1];
		if (tokens[2].indexOf('K') > -1) castling.w |= BITS.KSIDE_CASTLE;
		if (tokens[2].indexOf('Q') > -1) castling.w |= BITS.QSIDE_CASTLE;
		if (tokens[2].indexOf('k') > -1) castling.b |= BITS.KSIDE_CASTLE;
		if (tokens[2].indexOf('q') > -1) castling.b |= BITS.QSIDE_CASTLE;
		ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
		half_moves = parseInt(tokens[4], 10);
		move_number = parseInt(tokens[5], 10);
		update_setup(generate_fen());
		return true;
	}

	// This function validates the fen from a syntax standpoint.
	function validate_fen(fen) {
		const tokens = fen.split(/\s+/);
		// 1st criterion: 6 space-seperated fields.
		if (tokens.length !== 6) return false;
		// 2nd criterion: move number field is a integer value > 0.
		if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) return false;
		// 3rd criterion: half move counter is an integer >= 0.
		if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) return false;
		// 4th criterion: 4th field is a valid e.p. string.
		if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) return false;
		// 5th criterion: 3th field is a valid castle string.
		if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) return false;
		// 6th criterion: 2nd field is 'ww (white) or 'b' (black).
		if (!/^(w|b)$/.test(tokens[1])) return false;
		// 7th criterion: 1st field contains 8 rows.
		const rows = tokens[0].split('/');
		if (rows.length !== 8) return false;
		// 8th criterion: every row is valid.
		for (let i = 0; i < rows.length; i++) {
			// check for right sum of fields AND not two numbers in succession:
			let sum_fields = 0
			let previous_was_number = false
			for (let k = 0; k < rows[i].length; k++) {
				if (!isNaN(rows[i][k])) {
					if (previous_was_number) return false;
					sum_fields += parseInt(rows[i][k], 10);
					previous_was_number = true;
				} else {
					if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) return false;
					sum_fields += 1;
					previous_was_number = false;
				}
			}
			if (sum_fields !== 8) return false;
		}

		if (
			(tokens[3][1] == '3' && tokens[1] == 'w') ||
			(tokens[3][1] == '6' && tokens[1] == 'b')
		) return false;

		return true;
	}

	function generate_fen() {
		let empty = 0;
		let fen = '';
		for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
			if (board[i] == null) empty++;
			else {
				if (empty > 0) {
					fen += empty;
					empty = 0;
				}
				const color = board[i].color;
				const piece = board[i].type;
				fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
			}
			if ((i + 1) & 0x88) {
				if (empty > 0) fen += empty;
				if (i !== SQUARES.h1) fen += '/';
				empty = 0;
				i += 8;
			}
		}
		let cflags = '';
		if (castling[WHITE] & BITS.KSIDE_CASTLE) cflags += 'K';
		if (castling[WHITE] & BITS.QSIDE_CASTLE) cflags += 'Q';
		if (castling[BLACK] & BITS.KSIDE_CASTLE) cflags += 'k';
		if (castling[BLACK] & BITS.QSIDE_CASTLE) cflags += 'q';
		// do we have an empty castling flag?
		cflags = cflags || '-';
		const epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);
		return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
	}

	function set_header(args) {
		for (let i = 0; i < args.length; i += 2)
			if (typeof args[i] === 'string' && typeof args[i + 1] === 'string')
				header[args[i]] = args[i + 1];
		return header;
	}

	// Called when the initial board setup is changed with put() or remove().
	// Modifies the SetUp and FEN properties of the header object.
	// If the FEN is equal to the default position, the SetUp and FEN are deleted.
	// The setup is only updated if history length == 0, ie moves haven't been made.
	function update_setup(fen) {
		if (history.length > 0) return;
		if (fen !== DEFAULT_POSITION) {
			header['SetUp'] = '1';
			header['FEN'] = fen;
		} else {
			delete header['SetUp'];
			delete header['FEN'];
		}
	}

	function get(square) {
		const piece = board[SQUARES[square]];
		return piece ? { type: piece.type, color: piece.color } : null;
	}

	function put(piece, square) {
		// check for valid piece object:
		if (!('type' in piece && 'color' in piece)) return false;
		// check for piece:
		if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) return false;
		// check for valid square:
		if (!(square in SQUARES)) return false;
		const sq = SQUARES[square];
		// don't let the user place more than one king:
		if (
			piece.type == KING &&
			!(kings[piece.color] == EMPTY || kings[piece.color] == sq)
		) return false;
		board[sq] = { type: piece.type, color: piece.color };
		if (piece.type === KING) kings[piece.color] = sq;
		update_setup(generate_fen());
		return true;
	}

	function remove(square) {
		const piece = get(square);
		board[SQUARES[square]] = null;
		if (piece && piece.type === KING) kings[piece.color] = EMPTY;
		update_setup(generate_fen());
		return piece;
	}

	function build_move(board, from, to, flags, promotion) {
		let move = {
			color: turn,
			from: from,
			to: to,
			flags: flags,
			piece: board[from].type,
		};
		if (promotion) {
			move.flags |= BITS.PROMOTION;
			move.promotion = promotion;
		}
		if (board[to]) move.captured = board[to].type;
		else if (flags & BITS.EP_CAPTURE) move.captured = PAWN;
		return move;
	}

	function generate_moves(options) {

		let moves = [ ];

		function add_move(board, moves, from, to, flags) {
			// if pawn promotion:
			if (
				board[from].type === PAWN &&
				(rank(to) === RANK_8 || rank(to) === RANK_1)
			) {
				const pieces = [ QUEEN, ROOK, BISHOP, KNIGHT ];
				for (const piece of pieces)
					moves.push(build_move(board, from, to, flags, piece));
			} else moves.push(build_move(board, from, to, flags));
		}

		const us = turn;
		const them = swap_color(us);
		const second_rank = { b: RANK_7, w: RANK_2 };

		let first_sq = SQUARES.a8;
		let last_sq = SQUARES.h1;
		let single_square = false;

		// do we want legal moves?
		const legal =
			typeof options !== 'undefined' &&
			'legal' in options ? options.legal : true;

		const piece_type =
			typeof options !== 'undefined' &&
			'piece' in options &&
			typeof options.piece === 'string' ?
			options.piece.toLowerCase() : true;

		// are we generating moves for a single square?
		if (typeof options !== 'undefined' && 'square' in options) {
			if (options.square in SQUARES) {
				first_sq = last_sq = SQUARES[options.square];
				single_square = true;
			} else return [ ]; // invalid square!
		}
		for (let i = first_sq; i <= last_sq; i++) {
			// did we run off the end of the board?
			if (i & 0x88) { i += 7; continue; }
			const piece = board[i];
			if (piece == null || piece.color !== us) continue;
			if (piece.type === PAWN && (piece_type === true || piece_type === PAWN)) {
				// single square, non-capturing:
				let square = i + PAWN_OFFSETS[us][0];
				if (board[square] == null) {
					add_move(board, moves, i, square, BITS.NORMAL);
					// double square:
					square = i + PAWN_OFFSETS[us][1];
					if (second_rank[us] === rank(i) && board[square] == null)
						add_move(board, moves, i, square, BITS.BIG_PAWN);
				}
				// pawn captures:
				for (let j = 2; j < 4; j++) {
					square = i + PAWN_OFFSETS[us][j];
					if (square & 0x88) continue;
					if (board[square] != null && board[square].color === them)
						add_move(board, moves, i, square, BITS.CAPTURE);
					else if (square === ep_square)
						add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
				}
			} else if (piece_type === true || piece_type === piece.type) {
				for (let j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
					const offset = PIECE_OFFSETS[piece.type][j];
					let square = i;
					while (true) {
						square += offset;
						if (square & 0x88) break;
						if (board[square] == null)
							add_move(board, moves, i, square, BITS.NORMAL);
						else {
							if (board[square].color === us) break;
							add_move(board, moves, i, square, BITS.CAPTURE);
							break;
						}
						// break, if knight or king:
						if (piece.type === 'n' || piece.type === 'k') break;
					}
				}
			}
		}
		// check for castling if:
		//   a. We're generating all moves.
		//   b. We're doing single square move generation on the king's square.
		if (piece_type === true || piece_type === KING) {
			if (!single_square || last_sq === kings[us]) {
				const castling_from = kings[us];
				// king-side castling:
				if (castling[us] & BITS.KSIDE_CASTLE) {
					const castling_to = castling_from + 2;
					if (
						board[castling_from + 1] == null &&
						board[castling_to] == null &&
						!attacked(them, kings[us]) &&
						!attacked(them, castling_from + 1) &&
						!attacked(them, castling_to)
					) add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
				}
				// queen-side castling:
				if (castling[us] & BITS.QSIDE_CASTLE) {
					const castling_to = castling_from - 2;
					if (
						board[castling_from - 1] == null &&
						board[castling_from - 2] == null &&
						board[castling_from - 3] == null &&
						!attacked(them, kings[us]) &&
						!attacked(them, castling_from - 1) &&
						!attacked(them, castling_to)
					) add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
				}
			}
		}
		// return all pseudo-legal moves.
		// this includes moves that allow the king to be captured.
		if (!legal) return moves;
		// filter out illegal moves:
		let legal_moves = [ ];
		for (const move of moves) {
			make_move(move);
			if (!king_attacked(us)) legal_moves.push(move);
			undo_move();
		}
		return legal_moves;
	}

	// Convert a move from 0x88 coordinates to Standard Algebraic Notation (SAN)
	// { sloppy: boolean } Use the sloppy SAN generator to work around over
	//                     disambiguation bugs in Fritz and Chessbase. See below:
	// r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
	// 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned.
	// 4. ... Ne7 is technically the valid SAN.
	function move_to_san(move, moves) {
		let output = '';
		if (move.flags & BITS.KSIDE_CASTLE) output = 'O-O';
		else if (move.flags & BITS.QSIDE_CASTLE) output = 'O-O-O';
		else {
			if (move.piece !== PAWN) {
				const disambiguator = get_disambiguator(move, moves);
				output += move.piece.toUpperCase() + disambiguator;
			}
			if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
				if (move.piece === PAWN) output += algebraic(move.from)[0];
				output += 'x';
			}
			output += algebraic(move.to);
			if (move.flags & BITS.PROMOTION)
				output += '=' + move.promotion.toUpperCase();
		}
		make_move(move);
		if (in_check()) {
			if (in_checkmate()) output += '#';
			else output += '+';
		}
		undo_move();
		return output;
	}

	// Parses all of the decorators out of a SAN string.
	function stripped_san(move) {
		return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
	}

	function attacked(color, square) {
		for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
			// did we run off the end of the board?
			if (i & 0x88) { i += 7; continue;}
			// if empty square or wrong color:
			if (board[i] == null || board[i].color !== color) continue;
			const piece = board[i];
			const difference = i - square;
			const index = difference + 119;
			if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
				if (piece.type === PAWN) {
					if (difference > 0) {
						if (piece.color === WHITE) return true;
					} else {
						if (piece.color === BLACK) return true;
					}
					continue;
				}
				// if the piece is a knight or a king:
				if (piece.type === 'n' || piece.type === 'k') return true;
				const offset = RAYS[index];
				let j = i + offset;
				let blocked = false;
				while (j !== square) {
					if (board[j] != null) {
						blocked = true;
						break;
					}
					j += offset;
				}
				if (!blocked) return true;
			}
		}
		return false;
	}

	function king_attacked(color) {
		return attacked(swap_color(color), kings[color]);
	}

	function in_check() {
		return king_attacked(turn);
	}

	function in_checkmate() {
		return in_check() && generate_moves().length === 0;
	}

	function in_stalemate() {
		return !in_check() && generate_moves().length === 0;
	}

	function insufficient_material() {
		let pieces = { };
		let bishops = [ ];
		let num_pieces = 0;
		let sq_color = 0;
		for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
			sq_color = (sq_color + 1) % 2;
			if (i & 0x88) { i += 7; continue; }
			const piece = board[i];
			if (piece) {
				pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
				if (piece.type === BISHOP) bishops.push(sq_color);
				num_pieces++;
			}
		}
		// k vs. k:
		if (num_pieces === 2) return true;
		else if (
			// k vs. kn .... or .... k vs. kb:
			num_pieces === 3 &&
			(pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
		) return true;
		else if (num_pieces === pieces[BISHOP] + 2) {
			// kb vs. kb where any number of bishops are all on the same color:
			let sum = 0;
			for (const bishop of bishops) sum += bishop;
			if (sum === 0 || sum === len) return true;
		}
		return false;
	}

	function in_threefold_repetition() {
		// TODO: while this function is fine for casual use, a better
		//       implementation would use a Zobrist key (instead of FEN).
		//       The Zobrist key would be maintained in the make_move / undo_move
		//       functions, avoiding the costly process that we do below.
		let moves = [ ];
		let positions = { };
		let repetition = false;
		while (true) {
			const move = undo_move();
			if (!move) break;
			moves.push(move);
		}
		while (true) {
			// remove the last two fields in the FEN string:
			const fen = generate_fen().split(' ').slice(0, 4).join(' ');
			// has the position occurred three or more times?
			positions[fen] = fen in positions ? positions[fen] + 1 : 1;
			if (positions[fen] >= 3) repetition = true;
			if (!moves.length) break;
			make_move(moves.pop());
		}
		return repetition;
	}

	function push(move) {
		history.push({
			move: move,
			kings: {
				b: kings.b,
				w: kings.w
			},
			turn: turn,
			castling: {
				b: castling.b,
				w: castling.w
			},
			ep_square: ep_square,
			half_moves: half_moves,
			move_number: move_number,
		});
	}

	function make_move(move) {
		const us = turn;
		const them = swap_color(us);
		push(move);
		board[move.to] = board[move.from];
		board[move.from] = null;
		// if e.p. capture, remove the captured pawn:
		if (move.flags & BITS.EP_CAPTURE) {
			if (turn === BLACK) board[move.to - 16] = null;
			else board[move.to + 16] = null;
		}
		// if pawn promotion, replace with new piece:
		if (move.flags & BITS.PROMOTION)
			board[move.to] = { type: move.promotion, color: us };
		// if we moved the king:
		if (board[move.to].type === KING) {
			kings[board[move.to].color] = move.to;
			// if we castled, move the rook next to the king:
			if (move.flags & BITS.KSIDE_CASTLE) {
				const castling_to = move.to - 1;
				const castling_from = move.to + 1;
				board[castling_to] = board[castling_from];
				board[castling_from] = null;
			} else if (move.flags & BITS.QSIDE_CASTLE) {
				const castling_to = move.to + 1;
				const castling_from = move.to - 2;
				board[castling_to] = board[castling_from];
				board[castling_from] = null;
			}
			castling[us] = ''; // turn off castling.
		}
		// turn off castling if we move a rook:
		if (castling[us]) {
			for (let i = 0, len = ROOKS[us].length; i < len; i++) {
				if (
					move.from === ROOKS[us][i].square &&
					castling[us] & ROOKS[us][i].flag
				) {
					castling[us] ^= ROOKS[us][i].flag;
					break;
				}
			}
		}
		// turn off castling if we capture a rook:
		if (castling[them]) {
			for (let i = 0, len = ROOKS[them].length; i < len; i++) {
				if (
					move.to === ROOKS[them][i].square &&
					castling[them] & ROOKS[them][i].flag
				) {
					castling[them] ^= ROOKS[them][i].flag;
					break;
				}
			}
		}
		// if "big" pawn move, update the en passant square:
		if (move.flags & BITS.BIG_PAWN) {
			if (turn === 'b') ep_square = move.to - 16;
			else ep_square = move.to + 16;
		} else ep_square = EMPTY;
		// reset the 50 move counter if a pawn is moved or a piece is captured:
		if (move.piece === PAWN) half_moves = 0;
		else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) half_moves = 0;
		else half_moves++;
		if (turn === BLACK) move_number++;
		turn = swap_color(turn);
	}

	function undo_move() {
		const old = history.pop();
		if (old == null) return null;
		const move = old.move;
		kings = old.kings;
		turn = old.turn;
		castling = old.castling;
		ep_square = old.ep_square;
		half_moves = old.half_moves;
		move_number = old.move_number;
		const us = turn;
		const them = swap_color(turn);
		board[move.from] = board[move.to];
		board[move.from].type = move.piece; // to undo any promotions
		board[move.to] = null;
		if (move.flags & BITS.CAPTURE)
			board[move.to] = { type: move.captured, color: them };
		else if (move.flags & BITS.EP_CAPTURE) {
			const index = move.to + (us === BLACK ? - 16 : 16);
			board[index] = { type: PAWN, color: them };
		}
		if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
			let castling_to, castling_from;
			if (move.flags & BITS.KSIDE_CASTLE) {
				castling_to = move.to + 1;
				castling_from = move.to - 1;
			} else if (move.flags & BITS.QSIDE_CASTLE) {
				castling_to = move.to - 2;
				castling_from = move.to + 1;
			}
			board[castling_to] = board[castling_from];
			board[castling_from] = null;
		}
		return move;
	}

	// Uniquely identify ambiguous moves.
	function get_disambiguator(move, moves) {
		const from = move.from;
		const to = move.to;
		const piece = move.piece;
		let ambiguities = 0;
		let same_rank = 0;
		let same_file = 0;
		for (let i = 0, len = moves.length; i < len; i++) {
			const ambig_from = moves[i].from;
			const ambig_to = moves[i].to;
			const ambig_piece = moves[i].piece;
			// if a move of the same piece type ends on the same to square,
			// we'll need to add a disambiguator to the algebraic notation:
			if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
				ambiguities++;
				if (rank(from) === rank(ambig_from)) same_rank++;
				if (file(from) === file(ambig_from)) same_file++;
			}
		}
		if (ambiguities > 0) {
			// if there exists a similar moving piece on the same rank and file
			// as the move in question, use the square as the disambiguator:
			if (same_rank > 0 && same_file > 0) return algebraic(from);
			else if (same_file > 0) {
				// if the moving piece rests on the same file,
				// use the rank symbol as the disambiguator:
				return algebraic(from).charAt(1);
			} else {
				// else use the file symbol:
				return algebraic(from).charAt(0);
			}
		}
		return '';
	}

	function infer_piece_type(san) {
		let piece_type = san.charAt(0);
		if (piece_type >= 'a' && piece_type <= 'h') {
			if (san.match(/[a-h]\d.*[a-h]\d/)) return undefined;
			return PAWN;
		}
		piece_type = piece_type.toLowerCase();
		if (piece_type === 'o') return KING;
		return piece_type;
	}

	// Convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates.
	function move_from_san(move, sloppy) {
		// strip off any move decorations: e.g Nf3+?! becomes Nf3
		var clean_move = stripped_san(move);
		var overly_disambiguated = false;
		if (sloppy) {
			// The sloppy parser allows the user to parse non-standard chess
			// notations. This parser is opt-in (by specifying the
			// '{ sloppy: true }' setting) and is only run after the Standard
			// Algebraic Notation (SAN) parser has failed.

			// When running the sloppy parser, we'll run a regex to grab the piece, the
			// to / from square, and an optional promotion piece. This regex will parse
			// common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7, f7f8q, b1c3.

			// NOTE: Some positions and moves may be ambiguous when using the sloppy
			// parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
			// the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated
			// bishop move). In these cases, the sloppy parser will default to the
			// most most basic interpretation - b1c3 parses to Nc3.

			var matches = clean_move.match(
				/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
			);
			if (matches) {
				var piece = matches[1];
				var from = matches[2];
				var to = matches[3];
				var promotion = matches[4];
				if (from.length == 1) overly_disambiguated = true;
			} else {
				// The [a-h]?[1-8]? portion of the regex below handles moves that may
				// be overly disambiguated (e.g. Nge7 is unnecessary and non-standard
				// when there is one legal knight move to e7). In this case, the value
				// of 'from' variable will be a rank or file, not a square.
				var matches = clean_move.match(
					/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/
				);
				if (matches) {
					var piece = matches[1];
					var from = matches[2];
					var to = matches[3];
					var promotion = matches[4];
					if (from.length == 1) var overly_disambiguated = true;
				}
			}
		}
		var piece_type = infer_piece_type(clean_move);
		var moves = generate_moves({ legal: true, piece: piece ? piece : piece_type });
		for (var i = 0, len = moves.length; i < len; i++) {
			// try the strict parser first, then the sloppy parser if requested:
			if (clean_move === stripped_san(move_to_san(moves[i], moves))) {
				return moves[i];
			} else {
				if (sloppy && matches) {
					// hand-compare move properties with the
					// results from our sloppy regex:
					if (
						(!piece || piece.toLowerCase() == moves[i].piece) &&
						SQUARES[from] == moves[i].from &&
						SQUARES[to] == moves[i].to &&
						(!promotion || promotion.toLowerCase() == moves[i].promotion)
					) {
						return moves[i];
					} else if (overly_disambiguated) {
						// SPECIAL CASE: we parsed a move string that may have
						// an unneeded rank / file disambiguator (e.g. Nge7).
						var square = algebraic(moves[i].from);
						if (
							(!piece || piece.toLowerCase() == moves[i].piece) &&
							SQUARES[to] == moves[i].to &&
							(from == square[0] || from == square[1]) &&
							(!promotion || promotion.toLowerCase() == moves[i].promotion)
						) return moves[i];
					}
				}
			}
		}
		return null;
	}

	// UTILITY FUNCTIONS ================================================================

	function rank(i) { return i >> 4; }

	function file(i) { return i & 15; }

	function algebraic(i) {
		const f = file(i), r = rank(i);
		return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1);
	}

	function swap_color(c) { return c === WHITE ? BLACK : WHITE; }

	function is_digit(c) {
		// replaced to get a faster version
		// return '0123456789'.indexOf(c) !== -1;
		const code = c.charCodeAt(0);
		return code >= 48 && code <= 57;
	}

	function make_pretty(ugly_move) {
		let move = clone(ugly_move);
		move.san = move_to_san(move, generate_moves({ legal: true }));
		move.to = algebraic(move.to);
		move.from = algebraic(move.from);
		let flags = '';
		for (const flag in BITS) 
			if (BITS[flag] & move.flags) flags += FLAGS[flag];
		move.flags = flags;
		return move;
	}

	function clone(obj) {
		let dupe = obj instanceof Array ? [ ] : { };
		for (const property in obj)
			if (typeof property === 'object')
				dupe[property] = clone(obj[property]);
			else dupe[property] = obj[property];
		return dupe;
	}

	function trim(str) { return str.replace(/^\s+|\s+$/g, ''); }

	// DEBUGGING UTILITIES ======================================================

	function perft(depth) {
		const moves = generate_moves({ legal: false });
		let nodes = 0;
		const color = turn;
		for (let i = 0, len = moves.length; i < len; i++) {
			make_move(moves[i]);
			if (!king_attacked(color)) {
				if (depth - 1 > 0) nodes += perft(depth - 1);
				else nodes++;
			}
			undo_move();
		}
		return nodes;
	}

	return {

		// PUBLIC CONSTANTS ==========================================================

		WHITE: WHITE,
		BLACK: BLACK,
		PAWN: PAWN,
		KNIGHT: KNIGHT,
		BISHOP: BISHOP,
		ROOK: ROOK,
		QUEEN: QUEEN,
		KING: KING,
		SQUARES: (function() {
			// from the ECMA-262 spec (section 12.6.4):
			// "The mechanics of enumerating the properties
			// ... is implementation dependent".
			// so for (var sq in SQUARES) keys.push(sq);
			// might not be ordered correctly.
			let keys = [ ];
			for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
				if (i & 0x88) { i += 7; continue; }
				keys.push(algebraic(i));
			}
			return keys;
		})(),
		FLAGS: FLAGS,

		// PUBLIC API ==============================================================

		load: function(fen) { return load(fen); },

		reset: function() { return reset(); },

		moves: function(options) {

			// The internal representation of a chess move is in 0x88 format, and
			// not meant to be human-readable. The code below converts the 0x88
			// square coordinates to algebraic coordinates.	It also prunes
			// unnecessary move keys resulting from a verbose call.

			const ugly_moves = generate_moves(options);
			let moves = [ ];

			for (let i = 0, len = ugly_moves.length; i < len; i++) {
				// does the user want a full move object, or just san?
				if (
					typeof options !== 'undefined' &&
					'verbose' in options &&
					options.verbose
				) {
					moves.push(make_pretty(ugly_moves[i]));
				} else {
					moves.push(
						move_to_san(ugly_moves[i], generate_moves({ legal: true }))
					);
				}
			}

			return moves;
		},

		in_check: function() { return in_check(); },

		in_checkmate: function() { return in_checkmate(); },

		in_stalemate: function() { return in_stalemate(); },

		in_draw: function() {
			return (
				half_moves >= 100 ||
				in_stalemate() ||
				insufficient_material() ||
				in_threefold_repetition()
			);
		},

		insufficient_material: function() { return insufficient_material(); },

		in_threefold_repetition: function() { return in_threefold_repetition(); },

		game_over: function() {
			return (
				half_moves >= 100 ||
				in_checkmate() ||
				in_stalemate() ||
				insufficient_material() ||
				in_threefold_repetition()
			);
		},

		validate_fen: function(fen) { return validate_fen(fen); },

		fen: function() { return generate_fen(); },

		board: function() {
			let output = [ ], row = [ ];
			for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
				if (board[i] == null) row.push(null);
				else row.push({
					type: board[i].type,
					color: board[i].color
				});
				if ((i + 1) & 0x88) {
					output.push(row);
					row = [ ];
					i += 8;
				}
			}
			return output;
		},

		// left original implementation since it's not used anywhere else.
		pgn: function(options) {
			/* using the specification from http://www.chessclub.com/help/PGN-spec
			 * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
			 */
			var newline =
				typeof options === 'object' && typeof options.newline_char === 'string' ?
				options.newline_char :
				'\n'
			var max_width =
				typeof options === 'object' && typeof options.max_width === 'number' ?
				options.max_width :
				0
			var result = []
			var header_exists = false

			/* add the PGN header headerrmation */
			for (var i in header) {
				/* TODO: order of enumerated properties in header object is not
				 * guaranteed, see ECMA-262 spec (section 12.6.4)
				 */
				result.push('[' + i + ' "' + header[i] + '"]' + newline)
				header_exists = true
			}

			if (header_exists && history.length) {
				result.push(newline)
			}

			var append_comment = function(move_string) {
				var comment = comments[generate_fen()]
				if (typeof comment !== 'undefined') {
					var delimiter = move_string.length > 0 ? ' ' : ''
					move_string = `${move_string}${delimiter}{${comment}}`
				}
				return move_string
			}

			/* pop all of history onto reversed_history */
			var reversed_history = []
			while (history.length > 0) {
				reversed_history.push(undo_move())
			}

			var moves = []
			var move_string = ''

			/* special case of a commented starting position with no moves */
			if (reversed_history.length === 0) {
				moves.push(append_comment(''))
			}

			/* build the list of moves.	a move_string looks like: "3. e3 e6" */
			while (reversed_history.length > 0) {
				move_string = append_comment(move_string)
				var move = reversed_history.pop()

				/* if the position started with black to move, start PGN with 1. ... */
				if (!history.length && move.color === 'b') {
					move_string = move_number + '. ...'
				} else if (move.color === 'w') {
					/* store the previous generated move_string if we have one */
					if (move_string.length) {
						moves.push(move_string)
					}
					move_string = move_number + '.'
				}

				move_string =
					move_string +
					' ' +
					move_to_san(move, generate_moves({
						legal: true
					}))
				make_move(move)
			}

			/* are there any other leftover moves? */
			if (move_string.length) {
				moves.push(append_comment(move_string))
			}

			/* is there a result? */
			if (typeof header.Result !== 'undefined') {
				moves.push(header.Result)
			}

			/* history should be back to what it was before we started generating PGN,
			 * so join together moves
			 */
			if (max_width === 0) {
				return result.join('') + moves.join(' ')
			}

			var strip = function() {
				if (result.length > 0 && result[result.length - 1] === ' ') {
					result.pop()
					return true
				}
				return false
			}

			/* NB: this does not preserve comment whitespace. */
			var wrap_comment = function(width, move) {
				for (var token of move.split(' ')) {
					if (!token) {
						continue
					}
					if (width + token.length > max_width) {
						while (strip()) {
							width--
						}
						result.push(newline)
						width = 0
					}
					result.push(token)
					width += token.length
					result.push(' ')
					width++
				}
				if (strip()) {
					width--
				}
				return width
			}

			/* wrap the PGN output at max_width */
			var current_width = 0
			for (var i = 0; i < moves.length; i++) {
				if (current_width + moves[i].length > max_width) {
					if (moves[i].includes('{')) {
						current_width = wrap_comment(current_width, moves[i])
						continue
					}
				}
				/* if the current move will push past max_width */
				if (current_width + moves[i].length > max_width && i !== 0) {
					/* don't end the line with whitespace */
					if (result[result.length - 1] === ' ') {
						result.pop()
					}

					result.push(newline)
					current_width = 0
				} else if (i !== 0) {
					result.push(' ')
					current_width++
				}
				result.push(moves[i])
				current_width += moves[i].length
			}

			return result.join('')
		},

		// left original implementation since it's not used anywhere else.
		load_pgn: function(pgn, options) {
			// allow the user to specify the sloppy move parser to work around over
			// disambiguation bugs in Fritz and Chessbase
			var sloppy =
				typeof options !== 'undefined' && 'sloppy' in options ?
				options.sloppy :
				false

			function mask(str) {
				return str.replace(/\\/g, '\\')
			}

			function has_keys(object) {
				for (var key in object) {
					return true
				}
				return false
			}

			function parse_pgn_header(header, options) {
				var newline_char =
					typeof options === 'object' &&
					typeof options.newline_char === 'string' ?
					options.newline_char :
					'\r?\n'
				var header_obj = {}
				var headers = header.split(new RegExp(mask(newline_char)))
				var key = ''
				var value = ''

				for (var i = 0; i < headers.length; i++) {
					key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1')
					value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1')
					if (trim(key).length > 0) {
						header_obj[key] = value
					}
				}

				return header_obj
			}

			var newline_char =
				typeof options === 'object' && typeof options.newline_char === 'string' ?
				options.newline_char :
				'\r?\n'

			// RegExp to split header. Takes advantage of the fact that header and movetext
			// will always have a blank line between them (ie, two newline_char's).
			// With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
			var header_regex = new RegExp(
				'^(\\[((?:' +
				mask(newline_char) +
				')|.)*\\])' +
				'(?:' +
				mask(newline_char) +
				'){2}'
			)

			// If no header given, begin with moves.
			var header_string = header_regex.test(pgn) ?
				header_regex.exec(pgn)[1] :
				''

			// Put the board in the starting position
			reset()

			/* parse PGN header */
			var headers = parse_pgn_header(header_string, options)
			for (var key in headers) {
				set_header([key, headers[key]])
			}

			/* load the starting position indicated by [Setup '1'] and
			 * [FEN position] */
			if (headers['SetUp'] === '1') {
				if (!('FEN' in headers && load(headers['FEN'], true))) {
					// second argument to load: don't clear the headers
					return false
				}
			}

			/* NB: the regexes below that delete move numbers, recursive
			 * annotations, and numeric annotation glyphs may also match
			 * text in comments. To prevent this, we transform comments
			 * by hex-encoding them in place and decoding them again after
			 * the other tokens have been deleted.
			 *
			 * While the spec states that PGN files should be ASCII encoded,
			 * we use {en,de}codeURIComponent here to support arbitrary UTF8
			 * as a convenience for modern users */

			var to_hex = function(string) {
				return Array.from(string)
					.map(function(c) {
						/* encodeURI doesn't transform most ASCII characters,
						 * so we handle these ourselves */
						return c.charCodeAt(0) < 128 ?
							c.charCodeAt(0).toString(16) :
							encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
					})
					.join('')
			}

			var from_hex = function(string) {
				return string.length == 0 ?
					'' :
					decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'))
			}

			var encode_comment = function(string) {
				string = string.replace(new RegExp(mask(newline_char), 'g'), ' ')
				return `{${to_hex(string.slice(1, string.length - 1))}}`
			}

			var decode_comment = function(string) {
				if (string.startsWith('{') && string.endsWith('}')) {
					return from_hex(string.slice(1, string.length - 1))
				}
			}

			/* delete header to get the moves */
			var ms = pgn
				.replace(header_string, '')
				.replace(
					/* encode comments so they don't get deleted below */
					new RegExp(`(\{[^}]*\})+?|;([^${mask(newline_char)}]*)`, 'g'),
					function(match, bracket, semicolon) {
						return bracket !== undefined ?
							encode_comment(bracket) :
							' ' + encode_comment(`{${semicolon.slice(1)}}`)
					}
				)
				.replace(new RegExp(mask(newline_char), 'g'), ' ')

			/* delete recursive annotation variations */
			var rav_regex = /(\([^\(\)]+\))+?/g
			while (rav_regex.test(ms)) {
				ms = ms.replace(rav_regex, '')
			}

			/* delete move numbers */
			ms = ms.replace(/\d+\.(\.\.)?/g, '')

			/* delete ... indicating black to move */
			ms = ms.replace(/\.\.\./g, '')

			/* delete numeric annotation glyphs */
			ms = ms.replace(/\$\d+/g, '')

			/* trim and get array of moves */
			var moves = trim(ms).split(new RegExp(/\s+/))

			/* delete empty entries */
			moves = moves.join(',').replace(/,,+/g, ',').split(',')
			var move = ''

			var result = ''

			for (var half_move = 0; half_move < moves.length; half_move++) {
				var comment = decode_comment(moves[half_move])
				if (comment !== undefined) {
					comments[generate_fen()] = comment
					continue
				}

				move = move_from_san(moves[half_move], sloppy)

				/* invalid move */
				if (move == null) {
					/* was the move an end of game marker */
					if (TERMINATION_MARKERS.indexOf(moves[half_move]) > -1) {
						result = moves[half_move]
					} else {
						return false
					}
				} else {
					/* reset the end of game marker if making a valid move */
					result = ''
					make_move(move)
				}
			}

			/* Per section 8.2.6 of the PGN spec, the Result tag pair must match
			 * match the termination marker. Only do this when headers are present,
			 * but the result tag is missing
			 */
			if (result && Object.keys(header).length && !header['Result']) {
				set_header(['Result', result])
			}

			return true
		},

		header: function() { return set_header(arguments); },

		ascii: function() { return ascii(); },

		turn: function() { return turn; },

		move: function(move, options) {
			// The move function can be called with in the following parameters:
			// .move('Nxb7');  // where 'move' is a case-sensitive SAN string.
			// .move({
			//     from: 'h7', // where the 'move' is a move object.
			//     to :'h8',
			//     promotion: 'q',
			// });

			// allow the user to specify the sloppy move parser to work
			// around over disambiguation bugs in Fritz and Chessbase:
			const sloppy =
				typeof options !== 'undefined' && 'sloppy' in options ?
				options.sloppy : false;

			let move_obj = null;
			if (typeof move === 'string') move_obj = move_from_san(move, sloppy);
			else if (typeof move === 'object') {
				let moves = generate_moves();
				// convert the pretty move object to an ugly move object:
				for (let i = 0, len = moves.length; i < len; i++) {
					if (
						move.from === algebraic(moves[i].from) &&
						move.to === algebraic(moves[i].to) &&
						(!('promotion' in moves[i]) ||
							move.promotion === moves[i].promotion)
					) {
						move_obj = moves[i];
						break;
					}
				}
			}
			if (!move_obj) return null; // failed to find move.
			// we need to make a copy of move because we
			// can't generate SAN after the move is made.
			const pretty_move = make_pretty(move_obj);
			make_move(move_obj);
			return pretty_move;
		},

		undo: function() {
			const move = undo_move();
			return move ? make_pretty(move) : null;
		},

		clear: function() { return clear(); },

		put: function(piece, square) { return put(piece, square); },

		get: function(square) { return get(square); },

		remove: function(square) { return remove(square); },

		perft: function(depth) { return perft(depth); },

		square_color: function(square) {
			if (square in SQUARES) {
				const sq_0x88 = SQUARES[square];
				return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark';
			}
			return null;
		},

		half_move_count_since_start: function() { return history.length; },

		history: function(options) {
			let reversed_history = [ ];
			let move_history = [ ];
			const verbose = typeof options !== 'undefined' &&
							'verbose' in options &&
							options.verbose;
			while (history.length > 0) {
				reversed_history.push(undo_move())
			}
			while (reversed_history.length > 0) {
				const move = reversed_history.pop()
				if (verbose) move_history.push(make_pretty(move));
				else move_history.push(
					move_to_san(move, generate_moves({ legal: true }))
				);
				make_move(move);
			}
			return move_history;
		},

		get_comment: function() { return comments[generate_fen()]; },

		set_comment: function(comment) {
			comments[generate_fen()] = comment.replace('{', '[').replace('}', ']');
		},

		delete_comment: function() {
			const comment = comments[generate_fen()];
			delete comments[generate_fen()];
			return comment;
		},

		get_comments: function() {
			prune_comments();
			return Object.keys(comments).map(
				fen => ({ fen: fen, comment: comments[fen] })
			);
		},

		delete_comments: function() {
			prune_comments()
			return Object.keys(comments).map(fen => {
				const comment = comments[fen];
				delete comments[fen];
				return { fen: fen, comment: comment };
			})
		},

	}
}