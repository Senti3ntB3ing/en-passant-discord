
import { encode, decode } from "https://deno.land/x/pngs@0.1.1/mod.ts";

const Board = {
	'b': decode(await Deno.readFile('./components/diagram/resources/bboard.png')),
	'w': decode(await Deno.readFile('./components/diagram/resources/wboard.png')),
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
};

export async function diagram(board, color) {
	return encode(Board['w'].image, Board['w'].width, Board['w'].height);
	/*color = color || 'w';
	const canvas = createCanvas(800, 800);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(Board[color], 0, 0);
	// drawing pieces:
	if (color[0] == 'w') {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				ctx.drawImage(piece, j * 100, i * 100);
			}
		}
	} else {
		for (let i = 7; i >= 0; i--) {
			for (let j = 7; j >= 0; j--) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				ctx.drawImage(piece, (7 - j) * 100, (7 - i) * 100);
			}
		}
	}
	return canvas.toBuffer('image/png');*/
}
