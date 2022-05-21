

/*!
 *  Copyright (c) 2021, Jeff Hlywa (jhlywa@gmail.com)
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and / or other materials provided with the distribution.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 *  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 *  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 *  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 *
!*/

const EMPTY = - 1;

export const SLOPPY = true, STRICT = false;
export const BLACK = 'b', WHITE = 'w', LIGHT = 'light', DARK = 'dark';
export const PAWN = 'p', KNIGHT = 'n', BISHOP = 'b', ROOK = 'r', QUEEN = 'q', KING = 'k';
export const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const LETTERS = 'pnbrqkPNBRQK', SYMBOLS = '♟♞♝♜♛♚♙♘♗♖♕♔';
const TERMINATION_MARKERS = [ '1-0', '0-1', '1/2-1/2', '*' ];
const PAWN_OFFSETS = { b: [ 16, 32, 17, 15 ], w: [ -16, -32, -17, -15 ]};

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
	NORMAL: 'n', CAPTURE: 'c', BIG_PAWN: 'b',
	EP_CAPTURE: 'e', PROMOTION: 'p',
	KSIDE_CASTLE: 'k', QSIDE_CASTLE: 'q'
};

const BITS = {
	NORMAL: 1, CAPTURE: 2, BIG_PAWN: 4,
	EP_CAPTURE: 8, PROMOTION: 16,
	KSIDE_CASTLE: 32, QSIDE_CASTLE: 64,
};

const RANK_1 = 7, RANK_2 = 6, RANK_3 = 5, RANK_4 = 4,
	  RANK_5 = 3, RANK_6 = 2, RANK_7 = 1, RANK_8 = 0;

export const SQUARES = {
	a8: 0x00, b8: 0x01, c8: 0x02, d8: 0x03, e8: 0x04, f8: 0x05, g8: 0x06, h8: 0x07,
	a7: 0x10, b7: 0x11, c7: 0x12, d7: 0x13, e7: 0x14, f7: 0x15, g7: 0x16, h7: 0x17,
	a6: 0x20, b6: 0x21, c6: 0x22, d6: 0x23, e6: 0x24, f6: 0x25, g6: 0x26, h6: 0x27,
	a5: 0x30, b5: 0x31, c5: 0x32, d5: 0x33, e5: 0x34, f5: 0x35, g5: 0x36, h5: 0x37,
	a4: 0x40, b4: 0x41, c4: 0x42, d4: 0x43, e4: 0x44, f4: 0x45, g4: 0x46, h4: 0x47,
	a3: 0x50, b3: 0x51, c3: 0x52, d3: 0x53, e3: 0x54, f3: 0x55, g3: 0x56, h3: 0x57,
	a2: 0x60, b2: 0x61, c2: 0x62, d2: 0x63, e2: 0x64, f2: 0x65, g2: 0x66, h2: 0x67,
	a1: 0x70, b1: 0x71, c1: 0x72, d1: 0x73, e1: 0x74, f1: 0x75, g1: 0x76, h1: 0x77
};

const PARSER_STRICT = 0, PARSER_SLOPPY = 1;

export class Chess {

	#ROOKS = {
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

	#board = new Array(128);
	#kings = { w: EMPTY, b: EMPTY };
	#turn = WHITE;
	#castling = { w: 0, b: 0 };
	#ep_square = EMPTY;
	#half_moves = 0;
	#move_number = 1;
	#history = [];
	#header = {};
	#comments = {};

	/**
	 * Creates a new chess object with the specified position.
	 * If the position is invalid or not specified, loads the default position.
	 * @param {string | undefined} fen - the fen string
	 */
	constructor(fen) {
		if (fen === undefined) this.fen(DEFAULT_POSITION);
		else if (!this.fen(fen)) this.fen(DEFAULT_POSITION);
	}

	/**
	 * Called when the initial board setup is changed with put() or remove().
	 * Modifies the SetUp and FEN properties of the header object.
	 * If the FEN is equal to the default position, the SetUp and FEN are deleted.
	 * The setup is only updated if history length == 0, ie moves haven't been made.
	 */
	#update(fen) {
		if (this.#history.length > 0) return;
		if (fen !== DEFAULT_POSITION) {
			this.#header['SetUp'] = '1';
			this.#header['FEN'] = fen;
		} else {
			delete this.#header['SetUp'];
			delete this.#header['FEN'];
		}
	}

	/** builds a move object */
	#build(board, from, to, flags, promotion) {
		const move = {
			color: this.#turn,
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

	/** generate move list */
	#moves(options) {
		const moves = [];
		const add_move = (board, moves, from, to, flags) => {
			// if pawn promotion:
			if (
				board[from].type === PAWN &&
				(this.#rank(to) === RANK_8 || this.#rank(to) === RANK_1)
			) {
				const pieces = [ QUEEN, ROOK, BISHOP, KNIGHT ];
				for (const piece of pieces)
					moves.push(this.#build(board, from, to, flags, piece));
			} else moves.push(this.#build(board, from, to, flags));
		}
		const us = this.#turn, them = this.#invert(us);
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
			} else return []; // invalid square!
		}
		for (let i = first_sq; i <= last_sq; i++) {
			// did we run off the end of the board?
			if (i & 0x88) { i += 7; continue; }
			const piece = this.#board[i];
			if (piece == null || piece.color !== us) continue;
			if (piece.type === PAWN && (piece_type === true || piece_type === PAWN)) {
				// single square, non-capturing:
				let square = i + PAWN_OFFSETS[us][0];
				if (this.#board[square] == null) {
					add_move(this.#board, moves, i, square, BITS.NORMAL);
					// double square:
					square = i + PAWN_OFFSETS[us][1];
					if (second_rank[us] === this.#rank(i) && this.#board[square] == null)
						add_move(this.#board, moves, i, square, BITS.BIG_PAWN);
				}
				// pawn captures:
				for (let j = 2; j < 4; j++) {
					square = i + PAWN_OFFSETS[us][j];
					if (square & 0x88) continue;
					if (this.#board[square] != null && this.#board[square].color === them)
						add_move(this.#board, moves, i, square, BITS.CAPTURE);
					else if (square === this.#ep_square)
						add_move(this.#board, moves, i, this.#ep_square, BITS.EP_CAPTURE);
				}
			} else if (piece_type === true || piece_type === piece.type) {
				for (let j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
					const offset = PIECE_OFFSETS[piece.type][j];
					let square = i;
					while (true) {
						square += offset;
						if (square & 0x88) break;
						if (this.#board[square] == null)
							add_move(this.#board, moves, i, square, BITS.NORMAL);
						else {
							if (this.#board[square].color === us) break;
							add_move(this.#board, moves, i, square, BITS.CAPTURE);
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
			if (!single_square || last_sq === this.#kings[us]) {
				// king-side castling:
				if (this.#castling[us] & BITS.KSIDE_CASTLE) {
					const castling_from = this.#kings[us];
					const castling_to = castling_from + 2;
					if (
						this.#board[castling_from + 1] == null &&
						this.#board[castling_to] == null &&
						!this.#attacked(them, this.#kings[us]) &&
						!this.#attacked(them, castling_from + 1) &&
						!this.#attacked(them, castling_to)
					) add_move(this.#board, moves, this.#kings[us], castling_to, BITS.KSIDE_CASTLE);
				}
				// queen-side castling:
				if (this.#castling[us] & BITS.QSIDE_CASTLE) {
					const castling_from = this.#kings[us];
					const castling_to = castling_from - 2;
					if (
						this.#board[castling_from - 1] == null &&
						this.#board[castling_from - 2] == null &&
						this.#board[castling_from - 3] == null &&
						!this.#attacked(them, this.#kings[us]) &&
						!this.#attacked(them, castling_from - 1) &&
						!this.#attacked(them, castling_to)
					) add_move(this.#board, moves, this.#kings[us], castling_to, BITS.QSIDE_CASTLE);
				}
			}
		}
		// return all pseudo-legal moves.
		// this includes moves that allow the king to be captured.
		if (!legal) return moves;
		// filter out illegal moves:
		const legal_moves = [];
		for (const move of moves) {
			this.#move(move);
			if (!this.#king_attacked(us)) legal_moves.push(move);
			this.#takeback();
		}
		return legal_moves;
	}

	/**
	 * Convert a move from 0x88 coordinates to Standard Algebraic Notation (SAN)
	 * { sloppy: boolean } Use the sloppy SAN generator to work around over
	 * disambiguation bugs in Fritz and Chessbase. See below:
	 * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
	 * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned.
	 * 4. ... Ne7 is technically the valid SAN
	*/
	#san(move, moves) {
		let output = '';
		if (move.flags & BITS.KSIDE_CASTLE) output = 'O-O';
		else if (move.flags & BITS.QSIDE_CASTLE) output = 'O-O-O';
		else {
			if (move.piece !== PAWN) {
				const disambiguator = this.#disambiguator(move, moves);
				output += move.piece.toUpperCase() + disambiguator;
			}
			if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
				if (move.piece === PAWN) output += this.#algebraic(move.from)[0];
				output += 'x';
			}
			output += this.#algebraic(move.to);
			if (move.flags & BITS.PROMOTION)
				output += '=' + move.promotion.toUpperCase();
		}
		this.#move(move);
		if (this.check()) {
			if (this.checkmate()) output += '#';
			else output += '+';
		}
		this.#takeback();
		return output;
	}

	/** convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates */
	#x88(move, sloppy) {
		let piece, from, to, promotion, overly_disambiguated, matches;
		// strip off any move decorations: e.g Nf3+?! becomes Nf3
		const clean_move = this.#strip(move);
		// the move parsers is a 2-step state
		for (let parser = 0; parser < 2; parser++) {
			if (parser == PARSER_SLOPPY) {
				// only run the sloppy parse if explicitly requested
				if (!sloppy) return null;
				// The sloppy parser allows the user to parse non-standard chess
				// notations. This parser is opt-in (by specifying the
				// '{ sloppy: true }' setting) and is only run after the Standard
				// Algebraic Notation (SAN) parser has failed.
				// When running the sloppy parser, we'll run a regex to grab the piece,
				// the to/from square, and an optional promotion piece. This regex will
				// parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7,
				// f7f8q, b1c3
				// NOTE: Some positions and moves may be ambiguous when using the
				// sloppy parser. For example, in this position:
				// 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1, the move b1c3 may be interpreted
				// as Nc3 or B1c3 (a disambiguated bishop move). In these cases, the
				// sloppy parser will default to the most most basic interpretation
				// (which is b1c3 parsing to Nc3).
				overly_disambiguated = false;
				matches = clean_move.match(
					/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
				);
				if (matches) {
					piece = matches[1];
					from = matches[2];
					to = matches[3];
					promotion = matches[4];
					if (from.length == 1) overly_disambiguated = true;
				} else {
					// The [a-h]?[1-8]? portion of the regex below handles moves that may
					// be overly disambiguated (e.g. Nge7 is unnecessary and non-standard
					// when there is one legal knight move to e7). In this case, the value
					// of 'from' variable will be a rank or file, not a square.
					matches = clean_move.match(
						/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/
					);
					if (matches) {
						piece = matches[1];
						from = matches[2];
						to = matches[3];
						promotion = matches[4];
						if (from.length == 1) overly_disambiguated = true;
					}
				}
			}
			const piece_type = this.#infer(clean_move);
			const moves = this.#moves({
				legal: true,
				piece: piece ? piece : piece_type,
			});
			for (let i = 0, len = moves.length; i < len; i++) {
				switch (parser) {
					case PARSER_STRICT: {
						if (clean_move === this.#strip(this.#san(moves[i], moves)))
							return moves[i];
						break;
					}
					case PARSER_SLOPPY: {
						if (matches) {
							// hand-compare move properties with the results from our sloppy
							// regex
							if (
								(!piece || piece.toLowerCase() == moves[i].piece) &&
								SQUARES[from] == moves[i].from &&
								SQUARES[to] == moves[i].to &&
								(!promotion || promotion.toLowerCase() == moves[i].promotion)
							) return moves[i];
							else if (overly_disambiguated) {
								// SPECIAL CASE: we parsed a move string that may have an
								// unneeded rank/file disambiguator (e.g. Nge7).	The 'from'
								// variable will
								const square = this.#algebraic(moves[i].from);
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
			}
		}
		return null;
	}

	/** parse all of the decorators out of a SAN string */
	#strip(move) {
		return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
	}

	/** check if a square is attacked by a given color */
	#attacked(color, square) {
		for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
			// did we run off the end of the board?
			if (i & 0x88) { i += 7; continue;}
			// if empty square or wrong color:
			if (this.#board[i] == null || this.#board[i].color !== color) continue;
			const piece = this.#board[i];
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
					if (this.#board[j] != null) {
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

	/** check if one's king is attacked */
	#king_attacked(color) {
		return this.#attacked(this.#invert(color), this.#kings[color]);
	}

	/** push a move in the move list */
	#push(move) {
		this.#history.push({
			move,
			kings: {
				b: this.#kings.b,
				w: this.#kings.w
			},
			turn: this.#turn,
			castling: {
				b: this.#castling.b,
				w: this.#castling.w
			},
			ep_square: this.#ep_square,
			half_moves: this.#half_moves,
			move_number: this.#move_number,
		});
	}

	/** make a move */
	#move(move) {
		const us = this.#turn;
		const them = this.#invert(us);
		this.#push(move);
		this.#board[move.to] = this.#board[move.from];
		this.#board[move.from] = null;
		// if e.p. capture, remove the captured pawn:
		if (move.flags & BITS.EP_CAPTURE) {
			if (this.#turn === BLACK) this.#board[move.to - 16] = null;
			else this.#board[move.to + 16] = null;
		}
		// if pawn promotion, replace with new piece:
		if (move.flags & BITS.PROMOTION)
			this.#board[move.to] = { type: move.promotion, color: us };
		// if we moved the king:
		if (this.#board[move.to].type === KING) {
			this.#kings[this.#board[move.to].color] = move.to;
			// if we castled, move the rook next to the king:
			if (move.flags & BITS.KSIDE_CASTLE) {
				const castling_to = move.to - 1;
				const castling_from = move.to + 1;
				this.#board[castling_to] = this.#board[castling_from];
				this.#board[castling_from] = null;
			} else if (move.flags & BITS.QSIDE_CASTLE) {
				const castling_to = move.to + 1;
				const castling_from = move.to - 2;
				this.#board[castling_to] = this.#board[castling_from];
				this.#board[castling_from] = null;
			}
			this.#castling[us] = ''; // turn off castling.
		}
		// turn off castling if we move a rook:
		if (this.#castling[us]) {
			for (let i = 0, len = this.#ROOKS[us].length; i < len; i++) {
				if (
					move.from === this.#ROOKS[us][i].square &&
					this.#castling[us] & this.#ROOKS[us][i].flag
				) {
					this.#castling[us] ^= this.#ROOKS[us][i].flag;
					break;
				}
			}
		}
		// turn off castling if we capture a rook:
		if (this.#castling[them]) {
			for (let i = 0, len = this.#ROOKS[them].length; i < len; i++) {
				if (
					move.to === this.#ROOKS[them][i].square &&
					this.#castling[them] & this.#ROOKS[them][i].flag
				) {
					this.#castling[them] ^= this.#ROOKS[them][i].flag;
					break;
				}
			}
		}
		// if "big" pawn move, update the en passant square:
		if (move.flags & BITS.BIG_PAWN) {
			if (this.#turn === 'b') this.#ep_square = move.to - 16;
			else this.#ep_square = move.to + 16;
		} else this.#ep_square = EMPTY;
		// reset the 50 move counter if a pawn is moved or a piece is captured:
		if (move.piece === PAWN) this.#half_moves = 0;
		else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) this.#half_moves = 0;
		else this.#half_moves++;
		if (this.#turn === BLACK) this.#move_number++;
		this.#turn = this.#invert(this.#turn);
	}

	/** take back last half-move */
	#takeback() {
		const old = this.#history.pop();
		if (old == null) return null;
		const move = old.move;
		this.#kings = old.kings;
		this.#turn = old.turn;
		this.#castling = old.castling;
		this.#ep_square = old.ep_square;
		this.#half_moves = old.half_moves;
		this.#move_number = old.move_number;
		const us = this.#turn;
		const them = this.#invert(this.#turn);
		this.#board[move.from] = this.#board[move.to];
		this.#board[move.from].type = move.piece; // to undo any promotions
		this.#board[move.to] = null;
		if (move.flags & BITS.CAPTURE)
			this.#board[move.to] = { type: move.captured, color: them };
		else if (move.flags & BITS.EP_CAPTURE) {
			const index = move.to + (us === BLACK ? - 16 : 16);
			this.#board[index] = { type: PAWN, color: them };
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
			this.#board[castling_to] = this.#board[castling_from];
			this.#board[castling_from] = null;
		}
		return move;
	}

	/** uniquely identify ambiguous moves */
	#disambiguator(move, moves) {
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
				if (this.#rank(from) === this.#rank(ambig_from)) same_rank++;
				if (this.#file(from) === this.#file(ambig_from)) same_file++;
			}
		}
		if (ambiguities > 0) {
			// if there exists a similar moving piece on the same rank and file
			// as the move in question, use the square as the disambiguator:
			if (same_rank > 0 && same_file > 0) return this.#algebraic(from);
			else if (same_file > 0) {
				// if the moving piece rests on the same file,
				// use the rank symbol as the disambiguator:
				return this.#algebraic(from).charAt(1);
			} else {
				// else use the file symbol:
				return this.#algebraic(from).charAt(0);
			}
		}
		return '';
	}

	/** infer piece type from a san move */
	#infer(san) {
		let piece_type = san.charAt(0);
		if (piece_type >= 'a' && piece_type <= 'h') {
			if (san.match(/[a-h]\d.*[a-h]\d/)) return undefined;
			return PAWN;
		}
		piece_type = piece_type.toLowerCase();
		if (piece_type === 'o') return KING;
		return piece_type;
	}

	/** generate a pgn string from the current game */
	#pgn(options) {
		// using the specification from http://www.chessclub.com/help/PGN-spec
		// example for html usage:
		// .pgn({ wrap: 72, endings: "<br />" })
		const newline = typeof options === 'object' &&
			typeof options.endings === 'string' ?
			options.endings : '\n';
		const wrap = typeof options === 'object' &&
			typeof options.wrap === 'number' ?
			options.wrap : 0;
		const result = [];
		let header_exists = false;
		// add the PGN header
		for (const i in this.#header) {
			// TODO: order of enumerated properties in header object is not
			// guaranteed, see ECMA-262 spec (section 12.6.4)
			result.push('[' + i + ' "' + this.#header[i] + '"]' + newline);
			header_exists = true;
		}
		if (header_exists && this.#history.length) result.push(newline);
		const append_comment = move_string => {
			const comment = this.#comments[this.fen()];
			if (typeof comment !== 'undefined') {
				const delimiter = move_string.length > 0 ? ' ' : '';
				move_string = `${move_string}${delimiter}{${comment}}`;
			}
			return move_string;
		}
		// pop all of history onto reversed_history
		const reversed_history = [];
		while (this.#history.length > 0) reversed_history.push(this.#takeback());
		const moves = [];
		let move_string = '';
		// special case of a commented starting position with no moves
		if (reversed_history.length === 0) moves.push(append_comment(''))
		// build the list of moves.	a move_string looks like: "3. e3 e6"
		while (reversed_history.length > 0) {
			move_string = append_comment(move_string);
			const move = reversed_history.pop();
			// if the position started with black to move, start PGN with 1. ...
			if (!this.#history.length && move.color === 'b') {
				move_string = this.#move_number + '. ...';
			} else if (move.color === 'w') {
				// store the previously generated move_string if we have one
				if (move_string.length) moves.push(move_string);
				move_string = this.#move_number + '.';
			}
			move_string = move_string + ' ' + this.#san(
				move, this.#moves({ legal: true })
			);
			this.#move(move);
		}
		// are there any other leftover moves?
		if (move_string.length) moves.push(append_comment(move_string));
		// is there a result?
		if (typeof this.#header.Result !== 'undefined') moves.push(this.#header.Result);
		// history should be back to what it was before we started generating
		// the PGN so join together the moves
		if (wrap === 0) return result.join('') + moves.join(' ');
		const strip = () => {
			if (result.length > 0 && result[result.length - 1] === ' ') {
				result.pop();
				return true;
			}
			return false;
		};
		// NOTE: this does not preserve comment whitespace
		const wrap_comment = (width, move) => {
			const parts = move.split(' ');
			for (const token of parts) {
				if (!token) continue;
				if (width + token.length > wrap) {
					while (strip()) width--;
					result.push(newline);
					width = 0;
				}
				result.push(token);
				width += token.length;
				result.push(' ');
				width++;
			}
			if (strip()) width--;
			return width;
		}
		// wrap the PGN output at wrap
		let current_width = 0;
		for (let i = 0; i < moves.length; i++) {
			if (current_width + moves[i].length > wrap) {
				if (moves[i].includes('{')) {
					current_width = wrap_comment(current_width, moves[i]);
					continue;
				}
			}
			// if the current move will push past wrap
			if (current_width + moves[i].length > wrap && i !== 0) {
				// don't end the line with whitespace
				if (result[result.length - 1] === ' ') result.pop();
				result.push(newline);
				current_width = 0;
			} else if (i !== 0) {
				result.push(' ');
				current_width++;
			}
			result.push(moves[i]);
			current_width += moves[i].length;
		}
		return result.join('');
	}

	/** loads a game from a pgn string */
	#load(pgn, options) {
		// allow the user to specify the sloppy move parser to work
		// around over disambiguation bugs in Fritz and Chessbase
		const sloppy = typeof options !== 'undefined' &&
			'sloppy' in options ? options.sloppy : false;
		const mask = str => str.replace(/\\/g, '\\');
		const parse_pgn_header = (header, options) => {
			const endings = typeof options === 'object' &&
				typeof options.endings === 'string' ?
				options.endings : '\r?\n';
			const header_obj = {};
			const headers = header.split(new RegExp(mask(endings)));
			let key = '', value = '';
			for (let i = 0; i < headers.length; i++) {
				const regex = /^\s*\[([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
				key = headers[i].replace(regex, '$1');
				value = headers[i].replace(regex, '$2');
				if (key.trim().length > 0) header_obj[key] = value;
			}
			return header_obj;
		}
		const endings = typeof options === 'object' &&
			typeof options.endings === 'string' ?
			options.endings : '\r?\n';
		// RegExp to split header. Takes advantage of the fact that header and movetext
		// will always have a blank line between them (ie, two endings's).
		// With default endings, will equal: /^\s*(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
		const header_regex = new RegExp(
			'^\\s*(\\[((?:' + mask(endings) + ')|.)*\\])' +
			'(?:\\s*' + mask(endings) + '){2}'
		);
		// if no header given, begin with moves.
		const header_string = header_regex.test(pgn) ?
			header_regex.exec(pgn)[1] : '';
		// put the board in the starting position
		this.reset();
		// parse PGN header
		const headers = parse_pgn_header(header_string, options);
		let fen = '';
		for (let key in headers) {
			if (key.toUpperCase() === 'FEN') {
				fen = headers[key];
				key = key.toUpperCase();
			}
			this.#header[key] = headers[key];
		}
		// sloppy parser should attempt to load a fen tag, even if it's
		// the wrong case and doesn't include a corresponding [SetUp "1"] tag
		if (sloppy) {
			if (fen.length && !this.fen(fen, true)) return false;
		} else {
			// strict parser - load the starting position
			// indicated by [Setup '1'] and [FEN position] 
			if (headers['SetUp'] === '1') {
				if (!('FEN' in headers && this.fen(headers['FEN'], true))) {
					// second argument to load: don't clear the headers
					return false;
				}
			}
		}
		// NOTE: the regexes below that delete move numbers, recursive
		// annotations, and numeric annotation glyphs may also match
		// text in comments. To prevent this, we transform comments
		// by hex-encoding them in place and decoding them again after
		// the other tokens have been deleted.
		// While the spec states that PGN files should be ASCII encoded,
		// we use {en,de}codeURIComponent here to support arbitrary UTF8
		// as a convenience for modern users 
		const to_hex = string => {
			return Array.from(string).map(c => {
				// encodeURI doesn't transform most ASCII characters,
				// so we handle these ourselves
				return c.charCodeAt(0) < 128 ?
					c.charCodeAt(0).toString(16) :
					encodeURIComponent(c).replace(/\%/g, '').toLowerCase();
			}).join('');
		};
		const from_hex = string => string.length == 0 ?
			'' : decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'));
		const encode_comment = string => {
			string = string.replace(new RegExp(mask(endings), 'g'), ' ');
			return `{${to_hex(string.slice(1, string.length - 1))}}`;
		};
		const decode_comment = string => {
			if (string.startsWith('{') && string.endsWith('}'))
				return from_hex(string.slice(1, string.length - 1));
		};
		// delete header to get the moves
		let ms = pgn.replace(header_string, '').replace(
			// encode comments so they don't get deleted below
			new RegExp(`(\{[^}]*\})+?|;([^${mask(endings)}]*)`, 'g'),
			function (_match, bracket, semicolon) {
				return bracket !== undefined ?
					encode_comment(bracket) :
					' ' + encode_comment(`{${semicolon.slice(1)}}`)
			}
		).replace(new RegExp(mask(endings), 'g'), ' ');
		// delete recursive annotation letiations
		const rav_regex = /(\([^\(\)]+\))+?/g;
		while (rav_regex.test(ms)) ms = ms.replace(rav_regex, '');
		// delete move numbers
		ms = ms.replace(/\d+\.(\.\.)?/g, '');
		// delete ... indicating black to move
		ms = ms.replace(/\.\.\./g, '');
		// delete numeric annotation glyphs
		ms = ms.replace(/\$\d+/g, '');
		// delete other glyphs
		ms = ms.replace(/(\s+)[=∓±□+-]+/gu, '$1');
		// trim and get array of moves
		let moves = ms.trim().split(new RegExp(/\s+/));
		// delete empty entries
		moves = moves.join(',').replace(/,,+/g, ',').split(',');
		let move = '', result = '';
		for (let half_move = 0; half_move < moves.length; half_move++) {
			const comment = decode_comment(moves[half_move]);
			if (comment !== undefined) {
				this.#comments[this.fen()] = comment;
				continue;
			}
			move = this.#x88(moves[half_move], sloppy);
			// invalid move
			if (move == null) {
				// was the move an end of game marker
				if (TERMINATION_MARKERS.includes(moves[half_move]))
					result = moves[half_move];
				else return false;
			} else {
				// reset the end of game marker if making a valid move
				result = '';
				this.#move(move);
			}
		}
		// Per section 8.2.6 of the PGN spec, the Result tag pair must match
		// the termination marker. Only do this when headers are present,
		// but the result tag is missing.
		if (result.length && Object.keys(this.#header).length && !this.#header['Result'])
			this.#header['Result'] = result;
		return true;
	}

	// ==== UTILITY FUNCTIONS ==================================================

	#rank(i) { return i >> 4; }
	#file(i) { return i & 15; }

	#algebraic(i) {
		const f = this.#file(i), r = this.#rank(i);
		return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1);
	}

	#invert(c) { return c === WHITE ? BLACK : WHITE; }

	#prettify(ugly_move) {
		const move = this.#clone(ugly_move);
		move.san = this.#san(move, this.#moves({ legal: true }));
		move.to = this.#algebraic(move.to);
		move.from = this.#algebraic(move.from);
		let flags = '';
		for (const flag in BITS) 
			if (BITS[flag] & move.flags) flags += FLAGS[flag];
		move.flags = flags;
		return move;
	}

	#clone(obj) {
		const dupe = obj instanceof Array ? [] : {};
		for (const property in obj)
			if (typeof property === 'object')
				dupe[property] = this.#clone(obj[property]);
			else dupe[property] = obj[property];
		return dupe;
	}

	// ==== PUBLIC FUNCTIONS ===================================================

	/**
	 * _Clears_ the entire board.
	 * @param {boolean} keepHeaders - whether to keep the headers
	 */ 
	clear(keepHeaders = false) {
		this.#board = new Array(128);
		this.#kings = { w: EMPTY, b: EMPTY };
		this.#turn = WHITE;
		this.#castling = { w: 0, b: 0 };
		this.#ep_square = EMPTY;
		this.#half_moves = 0;
		this.#move_number = 1;
		this.#history = [];
		if (!keepHeaders) this.#header = {};
		this.#comments = {};
		this.#update(this.fen());
	}

	/// returns `true` even if it's checkmate
	/**
	 * _Checks_ if current player is in check.
	 * @returns {boolean} `true` if it's check, `false` otherwise
	 */
	check() {
		return this.#king_attacked(this.#turn);
	}

	/**
	 * _Checks_ if the current player is in checkmate.
	 * @returns {boolean} `true` if the game is lost, `false` otherwise
	 */
	checkmate() {
		return this.check() && this.#moves().length === 0;
	}

	/**
	 * _Checks_ if the game is drawn by stalemate.
	 * @returns {boolean} `true` if the game is drawn, `false` otherwise
	 */
	stalemate() {
		return !this.check() && this.#moves().length === 0;
	}

	/**
	 * _Checks_ if the game is drawn by insufficient material.
	 * @returns {boolean} `true` if the game is drawn, `false` otherwise
	 */
	insufficient() {
		const pieces = {};
		const bishops = [];
		let num_pieces = 0;
		let sq_color = 0;
		for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
			sq_color = (sq_color + 1) % 2;
			if (i & 0x88) { i += 7; continue; }
			const piece = this.#board[i];
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
			if (sum === 0 || sum === bishops.length) return true;
		}
		return false;
	}

	/**
	 * _Checks_ if the game is drawn by threefold repetition.
	 * @returns {boolean} `true` if the game is drawn, `false` otherwise
	 */
	threefold() {
		// TODO: while this function is fine for casual use, a better
		//       implementation would use a Zobrist key (instead of FEN).
		//       The Zobrist key would be maintained in the make_move / takeback
		//       functions, avoiding the costly process that we do below.
		const moves = [], positions = {};
		let repetition = false;
		while (true) {
			const move = this.#takeback();
			if (!move) break;
			moves.push(move);
		}
		while (true) {
			// remove the last two fields in the FEN string:
			const fen = this.fen().split(' ').slice(0, 4).join(' ');
			// has the position occurred three or more times?
			positions[fen] = fen in positions ? positions[fen] + 1 : 1;
			if (positions[fen] >= 3) repetition = true;
			if (!moves.length) break;
			this.#move(moves.pop());
		}
		return repetition;
	}

	/**
	 * _Checks_ if the game is drawn by the 50 move rule.
	 * @returns {boolean} `true` if the game is drawn, `false` otherwise
	 */
	fiftymove() { return this.#half_moves >= 100; }

	/**
	 * _Checks_ if the game is drawn by agreement.\
	 * It ensures no other type of draws were reached.
	 * If checkmate occurred and the players didn't
	 * notice and agreed to a draw, the draw stands.
	 * @returns {boolean} `true` if the game is drawn, `false` otherwise
	 */
	agreement() {
		if (!('Result' in this.#header)) return false;
		// by standard FIDE rules: if checkmate occurred and
		// the players didn't notice and agree to a draw,
		// the draw stands. hence we don't have to check
		// for checkmate. however, we need to make sure
		// that the game is not drawn by other causes.
		return (!(
			this.stalemate() ||
			this.threefold() ||
			this.fiftymove() ||
			this.insufficient()
		) && this.#header['Result'] === '1/2-1/2');
	}

	/**
	 * _Checks_ if the game is drawn by any possible means.\
	 * It includes stalemate, insufficient material, 50 move rule,
	 * threefold repetition, and draw by agreement.
	 * @returns {boolean} `true` if the game is drawn, `false` otherwise
	 */
	draw() {
		return (
			this.stalemate() ||
			this.threefold() ||
			this.fiftymove() ||
			this.agreement() ||
			this.insufficient()
		);
	}

	/**
	 * _Checks_ if the game has ended.\
	 * It includes checkmate, draw by agreement and any other draws.
	 * @returns {boolean} `true` if the game has ended, `false` otherwise
	 */
	ended() { return this.checkmate() || this.draw(); }

	/**
	 * _Returns_ the matrix representation of the board.
	 * @returns {({ type, color } | null)[][]} the matrix
	 */
	get board() {
		const output = [];
		let row = [];
		for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
			if (this.#board[i] == null) row.push(null);
			else row.push({
				type: this.#board[i].type,
				color: this.#board[i].color
			});
			if ((i + 1) & 0x88) {
				output.push(row);
				row = [];
				i += 8;
			}
		}
		return output;
	}

	/** _Returns_ the current turn.
	 * @return {WHITE | BLACK} the current turn
	 */
	get turn() { return this.#turn; }

	/**
	 * _Returns_ the total number of half moves
	 * made from the beginning of the game.
	 * @returns {number} the total number of half moves
	 */
	get halfmoves() {
		if (this.#turn === WHITE) return (this.#move_number - 1) * 2;
		return (this.#move_number - 1) * 2 + 1;
	}

	/**
	 * _Generates_ a list of all possible moves.
	 * @param {{ verbose: boolean }} options - move verbosity
	 * @returns {string[] | object[]} the list of moves
	 */
	moves(options) {
		// The internal representation of a chess move is in 0x88 format, and
		// not meant to be human-readable. The code below converts the 0x88
		// square coordinates to algebraic coordinates.	It also prunes
		// unnecessary move keys resulting from a verbose call.
		const ugly_moves = this.#moves(options);
		const moves = [];
		for (let i = 0, len = ugly_moves.length; i < len; i++) {
			// does the user want a full move object, or just san?
			if (typeof options !== 'undefined' &&
				'verbose' in options && options.verbose
			) moves.push(this.#prettify(ugly_moves[i]));
			else moves.push(
				this.#san(ugly_moves[i], this.#moves({ legal: true }))
			);
		}
		return moves;
	}

	/**
	 * _Loads_ the given pgn and options when
	 * available, otherwise return the current pgn.
	 * @param {string} pgn - the pgn to load
	 * @param {object} options - the options to load
	 * @returns {string | boolean} the current pgn if no arguments are given
	 * @returns {boolean} `true` if the pgn was loaded, `false` otherwise
	 */
	pgn() {
		if (arguments.length === 0) return this.#pgn();
		if (typeof arguments[0] === 'string')
			return this.#load(arguments[0], arguments[1]);
		else return this.#pgn(arguments[0]);
	}

	/**
	 * _Makes_ a move on the board.
	 * @param {object | string} move - the move to make
	 * @param {{ sloppy: boolean }} options - sloppy move mode
	 * @returns {object?} the move object or `null` if the move was invalid
	 */
	move(move, options) {
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
		if (typeof move === 'string') move_obj = this.#x88(move, sloppy);
		else if (typeof move === 'object') {
			const moves = this.#moves();
			// convert the pretty move object to an ugly move object:
			for (let i = 0, len = moves.length; i < len; i++) {
				if (
					move.from === this.#algebraic(moves[i].from) &&
					move.to === this.#algebraic(moves[i].to) &&
					(!('promotion' in moves[i]) ||
						move.promotion === moves[i].promotion)
				) {
					move_obj = moves[i];
					break;
				}
			}
		}
		// failed to find move
		if (!move_obj) {
			if (typeof move !== 'object') return null;
			// failed to find move (might be castling king onto rook)
			if (move.from != 'e1' && move.from != 'e8') return null;
			if (move.to != 'h1' && move.to != 'a1' &&
				move.to != 'h8' && move.to != 'a8') return null;
			const king = this.get(move.from), rook = this.get(move.to);
			if (king == null || rook == null) return null;
			if (king.type != 'k' || rook.type != 'r') return null;
			if (king.color != rook.color) return null;
			return this.move(move.to[0] == 'h' ? 'O-O' : 'O-O-O');
		}
		// we need to make a copy of move because we
		// can't generate SAN after the move is made.
		const pretty_move = this.#prettify(move_obj);
		this.#move(move_obj);
		return pretty_move;
	}

	/**
	 * _Takes_ back last half move.
	 * @returns {object?} the move object or `null` if invalid
	 */
	takeback() {
		// remove comment of last half move if present;
		// do this only in the public code because the
		// private takeback is widely used privately
		const fen = this.fen();
		if (this.#comments[fen]) delete this.#comments[fen];
		const move = this.#takeback();
		return move ? this.#prettify(move) : null;
	}

	/**
	 * _Returns_ the full game history.
	 * @param {{ verbose: boolean }} options - verbose generation
	 * @returns {string[]} the game history as an array of SAN strings
	 */
	history(options) {
		const reversed = [], moves = [];
		const verbose = typeof options !== 'undefined' &&
			'verbose' in options && options.verbose;
		while (this.#history.length > 0) reversed.push(this.#takeback());
		while (reversed.length > 0) {
			const move = reversed.pop();
			if (verbose) moves.push(this.#prettify(move));
			else moves.push(
				this.#san(move, this.#moves({ legal: true }))
			);
			this.#move(move);
		}
		return moves;
	}

	/**
	 * _Retrieves_ the current comment if no parameters are given.\
	 * _Sets_ the current comment if a string comment is given.\
	 * _Deletes_ all comments if the argument is `null`.
	 * @returns {string} the current comment
	*/
	comment() {
		const fen = this.fen();
		if (arguments.length === 0) return this.#comments[fen];
		const data = arguments[0];
		if (data === null) {
			const comment = this.#comments[fen];
			delete this.#comments[fen];
			return comment;
		}
		if (typeof data == 'string')
			this.#comments[fen] = data.replace(/[{]/g, '[').replace(/[}]/g, ']');
	}

	/**
	 * _Retrieves_ all comments if no parameters are given.\
	 * _Sets_ comments if a dictionary `object` is given.\
	 * _Deletes_ all comments if the argument is `null`.
	 * @returns {object} all comments when no parameter is given
	*/
	comments() {
		if (arguments.length === 0) return this.#comments;
		const data = arguments[0];
		if (data === null) {
			const comments = this.#comments;
			this.#comments = {};
			return comments;
		}
		this.#comments = data;
	}

	/** _Resets_ the board and loads the default position. */
	reset() { this.fen(DEFAULT_POSITION); }

	/**
	 * _Loads_ the board with the given FEN string when 
	 * available, otherwise _returns_ the current FEN.
	 * @param {string} fen - the FEN string
	 * @param {boolean} keepHeaders - whether to keep the headers
	 * @returns {string | boolean} the current FEN if no arguments provided
	 * @returns {boolean} whether the FEN was properly loaded if provided
	 */
	fen(fen, keepHeaders = false) {
		if (fen == undefined) {
			// return current fen
			let empty = 0;
			let fen = '';
			for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
				if (this.#board[i] == null) empty++;
				else {
					if (empty > 0) {
						fen += empty;
						empty = 0;
					}
					const color = this.#board[i].color;
					const piece = this.#board[i].type;
					fen += color === WHITE ?
						piece.toUpperCase() : piece.toLowerCase();
				}
				if ((i + 1) & 0x88) {
					if (empty > 0) fen += empty;
					if (i !== SQUARES.h1) fen += '/';
					empty = 0;
					i += 8;
				}
			}
			let cflags = '';
			if (this.#castling[WHITE] & BITS.KSIDE_CASTLE) cflags += 'K';
			if (this.#castling[WHITE] & BITS.QSIDE_CASTLE) cflags += 'Q';
			if (this.#castling[BLACK] & BITS.KSIDE_CASTLE) cflags += 'k';
			if (this.#castling[BLACK] & BITS.QSIDE_CASTLE) cflags += 'q';
			// do we have an empty castling flag?
			cflags = cflags || '-';
			const epflags = this.#ep_square === EMPTY ?
				'-' : this.#algebraic(this.#ep_square);
			return [
				fen, this.#turn, cflags, epflags,
				this.#half_moves, this.#move_number
			].join(' ');
		}
		// load from a FEN string
		const is_digit = c => {
			// replaced to get a faster version
			// return '0123456789'.indexOf(c) !== -1;
			const code = c.charCodeAt(0);
			return code >= 48 && code <= 57;
		};
		const tokens = fen.split(/\s+/);
		const position = tokens[0];
		let square = 0;
		if (!Chess.validate(fen)) return false;
		this.clear(keepHeaders);
		for (let i = 0; i < position.length; i++) {
			const piece = position.charAt(i);
			if (piece === '/') square += 8;
			else if (is_digit(piece)) square += parseInt(piece);
			else {
				this.set({
					type: piece.toLowerCase(),
					color: (piece < 'a' ? WHITE : BLACK)
				}, this.#algebraic(square));
				square++;
			}
		}
		this.#turn = tokens[1];
		if (tokens[2].includes('K')) this.#castling.w |= BITS.KSIDE_CASTLE;
		if (tokens[2].includes('Q')) this.#castling.w |= BITS.QSIDE_CASTLE;
		if (tokens[2].includes('k')) this.#castling.b |= BITS.KSIDE_CASTLE;
		if (tokens[2].includes('q')) this.#castling.b |= BITS.QSIDE_CASTLE;
		this.#ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
		this.#half_moves = parseInt(tokens[4]);
		this.#move_number = parseInt(tokens[5]);
		this.#update(this.fen());
		return true;
	}

	/**
	 * _Validates_ a FEN string from a syntax standpoint.
	 * @param {string} fen - the string to validate
	 * @returns {boolean} `true` if valid, `false` otherwise
	 */
	static validate(fen) {
		// TODO: checks if there is more than 1 king of the same color
		// TODO: check if the position is legal (king in check must move,
		//       both kings can't be in check)
		// TODO: check if the pawns are not on the first ranks
		// TODO: check if the en passant can be done on the specified square
		// TODO: check if castling works by checking king's and rook's positions
		const tokens = fen.split(/\s+/);
		// 1st criterion: 6 space-seperated fields.
		if (tokens.length !== 6) return false;
		// 2nd criterion: move number field is a integer value > 0.
		let x = NaN;
		if (isNaN(x = parseInt(tokens[5])) || x <= 0) return false;
		// 3rd criterion: half move counter is an integer >= 0.
		if (isNaN(x = parseInt(tokens[4])) || x < 0) return false;
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
					sum_fields += parseInt(rows[i][k]);
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

	/**
	 * _Gets_ the contents of a square.
	 * @param {string} square - (`'d4'`, `'f6'` ...)
	 * @returns {{ type, color }?} the piece on the square or `null` if empty
	 */
	get(square) {
		const piece = this.#board[SQUARES[square]];
		return piece ? { type: piece.type, color: piece.color } : null;
	}

	/**
	 * _Sets_ a piece on a square.\
	 * __en passant__ and __castling__ flags are not updated.
	 * @param {{ type, color } | string} piece - (`{ type: 'k', color: 'w' }`)
	 * @param {string} square - (`'b8'`, `'c5'` ...)
	 * @returns {boolean} `true` if the piece was set, `false` on error
	 */
	set(piece, square) {
		if (typeof piece === 'string') {
			if (piece.length != 1 || !LETTERS.includes(piece)) return false;
			piece = {
				type: piece.toLowerCase(),
				color: /^[pnbrqk]$/i.test(piece) ? WHITE : BLACK
			};
		} else if (!('type' in piece && 'color' in piece)) return false;
		// check for piece:
		if (!LETTERS.includes(piece.type.toLowerCase())) return false;
		// check for valid square:
		if (!(square in SQUARES)) return false;
		const sq = SQUARES[square];
		// don't let the user place more than one king:
		if (
			piece.type == KING &&
			!(this.#kings[piece.color] == EMPTY || this.#kings[piece.color] == sq)
		) return false;
		this.#board[sq] = { type: piece.type, color: piece.color };
		if (piece.type === KING) this.#kings[piece.color] = sq;
		this.#update(this.fen());
		return true;
	}

	/**
	 * _Removes_ a piece from a square.\
	 * __en passant__ and __castling__ flags are not updated.
	 * @param {string} square - (`'a1'`, `'f5'` ...)
	 * @returns {{ type, color }?} the removed piece
	 */
	remove(square) {
		if (!(square in SQUARES)) return null;
		const piece = this.get(square);
		this.#board[SQUARES[square]] = null;
		if (piece && piece.type === KING) this.#kings[piece.color] = EMPTY;
		this.#update(this.fen());
		return piece;
	}

	/**
	 * _Gets_ the current header or sets the
	 * header if a dictionary is specified.
	 * @param {object | undefined} dictionary - (`{ Result: '1-0' }`)
	 * @returns {object} the current header
	 */
	header(dictionary) {
		if (dictionary === undefined) return this.#header;
		for (const key in dictionary) {
			if (typeof key != 'string') continue;
			if (typeof dictionary[key] != 'string') continue;
			if (key == 'Result') // making sure result contains no spaces
				dictionary[key] = dictionary[key].replace(/\s/g, '');
			this.#header[key] = dictionary[key];
		}
		return this.#header;
	}

	/**
	 * _Returns_ the ASCII render of the board.
	 * @param {WHITE | BLACK} perspective - the perspective of the board
	 * @returns {string} the ASCII render of the board
	 */
	ascii(perspective = WHITE) {
		let s = '   ╔════════════════════════╗\n';
		if (perspective === WHITE) {
			for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
				// display the rank
				if (this.#file(i) === 0)
					s += ' ' + '87654321'[this.#rank(i)] + ' ║';
				// empty piece
				if (this.#board[i] == null) s += ' · ';
				else s += ' ' + SYMBOLS[LETTERS.indexOf(
					this.#board[i].color == WHITE ?
						this.#board[i].type.toUpperCase() :
						this.#board[i].type.toLowerCase()
				)] + ' ';
				if ((i + 1) & 0x88) {
					s += '║\n';
					i += 8;
				}
			}
			s += '   ╚════════════════════════╝\n';
			s += '     a  b  c  d  e  f  g  h';
		} else {
			for (let i = SQUARES.h1; i >= SQUARES.a8; i--) {
				// display the rank
				if (this.#file(i) === 7)
					s += ' ' + '87654321'[this.#rank(i)] + ' ║';
				// empty piece
				if (this.#board[i] == null) s += ' · ';
				else s += ' ' + SYMBOLS[LETTERS.indexOf(
					this.#board[i].color == WHITE ?
						this.#board[i].type.toUpperCase() :
						this.#board[i].type.toLowerCase()
				)] + ' ';
				if ((i - 1) & 0x88) {
					s += '║\n';
					i -= 8;
				}
			}
			s += '   ╚════════════════════════╝\n';
			s += '     h  g  f  e  d  c  b  a';
		}
		return s;
	}

	/**
	 * _Gets_ the color of a given square.
	 * @param {string} square - (`'a1'`, `'h4'` ...)
	 * @returns {(LIGHT | DARK)?} `'light'` or `'dark'`
	 */
	color(square) {
		square = square.toLowerCase();
		if (!(square in SQUARES)) return null;
		const sq_0x88 = SQUARES[square];
		return (
			this.#rank(sq_0x88) + this.#file(sq_0x88)
		) % 2 === 0 ? LIGHT : DARK;
	}

}
