
import { loadImage, createCanvas } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';

const Board = {
	'b': await loadImage(await Deno.readFile('./components/diagram/resources/bboard.png')),
	'w': await loadImage(await Deno.readFile('./components/diagram/resources/wboard.png')),
};

const Pieces = {
	'bp': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/bp.png')),
	'bn': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/bn.png')),
	'bb': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/bb.png')),
	'bq': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/bq.png')),
	'bk': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/bk.png')),
	'br': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/br.png')),
	'wp': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/wp.png')),
	'wn': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/wn.png')),
	'wb': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/wb.png')),
	'wq': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/wq.png')),
	'wk': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/wk.png')),
	'wr': await loadImage(await Deno.readFile('./components/diagram/resources/alpha/wr.png')),
};

export async function diagram(board, color) {
	color = color || 'w';
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
	return canvas.toBuffer('image/png');
}
