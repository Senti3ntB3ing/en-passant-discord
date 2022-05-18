
import { encode, decode, ColorType } from "https://deno.land/x/pngs@0.1.1/mod.ts";
import { Chess } from "../chess.js";
import { GIFEncoder, quantize, applyPalette } from "https://unpkg.com/gifenc@1.0.3/dist/gifenc.esm.js";

const duplicate = image => ({
	width: image.width,
	height: image.height,
	colorType: image.colorType,
	bitDepth: image.bitDepth,
	lineSize: image.lineSize,
	image: image.image.slice(0)
});

const Board = {
	'b': decode(await Deno.readFile('./components/diagram/resources/bboard.png')),
	'w': decode(await Deno.readFile('./components/diagram/resources/wboard.png')),
}, GBoard = {
	'b': decode(await Deno.readFile('./components/diagram/resources/bgboard.png')),
	'w': decode(await Deno.readFile('./components/diagram/resources/wgboard.png')),
};

const Pieces = {
	'bp': decode(await Deno.readFile('./components/diagram/resources/alpha/bp.png')),
	'bn': decode(await Deno.readFile('./components/diagram/resources/alpha/bn.png')),
	'bb': decode(await Deno.readFile('./components/diagram/resources/alpha/bb.png')),
	'bq': decode(await Deno.readFile('./components/diagram/resources/alpha/bq.png')),
	'bk': decode(await Deno.readFile('./components/diagram/resources/alpha/bk.png')),
	'br': decode(await Deno.readFile('./components/diagram/resources/alpha/br.png')),
	'wp': decode(await Deno.readFile('./components/diagram/resources/alpha/wp.png')),
	'wn': decode(await Deno.readFile('./components/diagram/resources/alpha/wn.png')),
	'wb': decode(await Deno.readFile('./components/diagram/resources/alpha/wb.png')),
	'wq': decode(await Deno.readFile('./components/diagram/resources/alpha/wq.png')),
	'wk': decode(await Deno.readFile('./components/diagram/resources/alpha/wk.png')),
	'wr': decode(await Deno.readFile('./components/diagram/resources/alpha/wr.png')),
}, GPieces = {
	'bp': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/bp.png')),
	'bn': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/bn.png')),
	'bb': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/bb.png')),
	'bq': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/bq.png')),
	'bk': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/bk.png')),
	'br': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/br.png')),
	'wp': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/wp.png')),
	'wn': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/wn.png')),
	'wb': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/wb.png')),
	'wq': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/wq.png')),
	'wk': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/wk.png')),
	'wr': decode(await Deno.readFile('./components/diagram/resources/alpha_50p/wr.png')),
};

export async function stateMessage(title, game, perspective, text) {
	const white_to_move = '◽️ WHITE TO MOVE';
	const black_to_move = '◾️ BLACK TO MOVE';
	let status = '';
	if (game.ended()) {
		if (game.draw()) status = '½-½ ・ DRAW';
		else if (game.checkmate())
			status = game.turn == 'w' ? '0-1 ・ BLACK WON' : '1-0 ・ WHITE WON';
	} else status = game.turn == 'w' ? white_to_move : black_to_move;
	if (perspective == undefined) perspective = game.turn;
	let description = text;
	return {
		file: {
			blob: new Blob([ await diagram(game.board, perspective) ]),
			name: 'board.png',
		},
		embeds: [{
			type: 'image', title, description,
			color: game.turn == 'w' ? 0xFFFFFF : 0x000000,
			image: { url: 'attachment://board.png', height: 800, width: 800 },
			footer: { text: status },
		}]
	};
}

function board_to_data(board) {
	if (board.colorType == ColorType.RGBA) return board.image.slice(0);
	let data = new Uint8Array(Math.floor(board.image.length / 3) * 4);
	for (let i = 0; i < board.image.length; i += 3) {
		data.set([
			board.image[i + 0],
			board.image[i + 1],
			board.image[i + 2],
			255
		], Math.floor(i / 3) * 4);
	}
	return data;
}

export async function gif(pgn, perspective = 'w') {
	const game = new Chess();
	let data = board_to_data(await frame(game.board, perspective));
	if (!game.pgn(pgn)) return undefined;
	const moves = game.history();
	game.reset();
	const palette = quantize(data, 16, { format: 'rgb444' });
	let index = applyPalette(data, palette, 'rgb444');
	const gif = GIFEncoder();
	gif.writeFrame(index, 400, 400, { palette, repeat: -1 });
	for (const move of moves) {
		if (game.move(move) == null) return undefined;
		data = board_to_data(await frame(game.board, perspective));
		index = applyPalette(data, palette, 'rgb444');
		gif.writeFrame(index, 400, 400, { delay: 800, repeat: -1 });
	}
	gif.finish();
	return gif.bytes();
}

async function frame(board, color) {
	color = color || 'w';
	let img = duplicate(GBoard[color]);
	// drawing pieces:
	if (color[0] == 'w') {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (board[i][j] == null) continue;
				const piece = GPieces[board[i][j].color + board[i][j].type];
				img = overlay(img, piece, j * 50, i * 50);
			}
		}
	} else {
		for (let i = 7; i >= 0; i--) {
			for (let j = 7; j >= 0; j--) {
				if (board[i][j] == null) continue;
				const piece = GPieces[board[i][j].color + board[i][j].type];
				img = overlay(img, piece, (7 - j) * 50, (7 - i) * 50);
			}
		}
	}
	return img;
}

export async function diagram(board, color) {
	color = color || 'w';
	let img = duplicate(Board[color]);
	// drawing pieces:
	if (color[0] == 'w') {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				img = overlay(img, piece, j * 100, i * 100);
			}
		}
	} else {
		for (let i = 7; i >= 0; i--) {
			for (let j = 7; j >= 0; j--) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				img = overlay(img, piece, (7 - j) * 100, (7 - i) * 100);
			}
		}
	}
	return encode(img.image, img.width, img.height, {
		depth: img.bitDepth, color: img.colorType
	});
}

/// overlays foreground f on background b, at position x, y.
/// f, b: image objects.
function overlay(b, f, x = 0, y = 0) {
	if (b.width < x + f.width || b.height < y + f.height) return undefined;
	for (let i = 0; i < f.width; i++) {
		for (let j = 0; j < f.height; j++) {
			const bp = getPixel(b, i + x, j + y);
			const fp = getPixel(f, i, j);
			b = setPixel(b, i + x, j + y, blend(bp, fp));
		}
	}
	return b;
}

function getPixel(image, x, y) {
	const a = image.colorType == ColorType.RGBA;
	const d = image.image;
	const p = (x + y * image.width) * (a ? 4 : 3);
	return { r: d[p], g: d[p + 1], b: d[p + 2], a: (a ? d[p + 3] : 255) };
}

function setPixel(image, x, y, color) {
	const a = image.colorType == ColorType.RGBA;
	let d = image.image;
	const p = (x + y * image.width) * (a ? 4 : 3);
	d[p] = color.r; d[p + 1] = color.g; d[p + 2] = color.b;
	if (!a) return image;
	d[p + 3] = 'a' in color ? color.a : 255;
	return image;
}

function blend(c1, c2) {
	if (c1.a == undefined) c1.a = 255;
	if (c2.a == undefined) c2.a = 255;
	let a = 255 - ((255 - c1.a) * (255 - c2.a) / 255);
	let r = (c1.r * (255 - c2.a) + c2.r * c2.a) / 255;
	let g = (c1.g * (255 - c2.a) + c2.g * c2.a) / 255;
	let b = (c1.b * (255 - c2.a) + c2.b * c2.a) / 255;
	return { r, g, b, a };
}
