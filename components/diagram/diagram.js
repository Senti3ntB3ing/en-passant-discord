
//import { decode } from 'https://deno.land/x/imagescript@v1.2.12/mod.ts';

/*const Board = {
	'b': await decode(await Deno.readFile('./components/diagram/resources/bboard.png')),
	'w': await decode(await Deno.readFile('./components/diagram/resources/wboard.png')),
};

const Pieces = {
	'bp': await decode(await Deno.readFile('./components/diagram/resources/alpha/bp.png')),
	'bn': await decode(await Deno.readFile('./components/diagram/resources/alpha/bn.png')),
	'bb': await decode(await Deno.readFile('./components/diagram/resources/alpha/bb.png')),
	'bq': await decode(await Deno.readFile('./components/diagram/resources/alpha/bq.png')),
	'bk': await decode(await Deno.readFile('./components/diagram/resources/alpha/bk.png')),
	'br': await decode(await Deno.readFile('./components/diagram/resources/alpha/br.png')),
	'wp': await decode(await Deno.readFile('./components/diagram/resources/alpha/wp.png')),
	'wn': await decode(await Deno.readFile('./components/diagram/resources/alpha/wn.png')),
	'wb': await decode(await Deno.readFile('./components/diagram/resources/alpha/wb.png')),
	'wq': await decode(await Deno.readFile('./components/diagram/resources/alpha/wq.png')),
	'wk': await decode(await Deno.readFile('./components/diagram/resources/alpha/wk.png')),
	'wr': await decode(await Deno.readFile('./components/diagram/resources/alpha/wr.png')),
};*/

console.log(await Deno.readFile('./components/diagram/resources/alpha/bp.png'));

export async function diagram(board, color) {
	/*color = color || 'w';
	const canvas = Board[color].clone();
	// drawing pieces:
	if (color[0] == 'w') {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				canvas.composite(piece, j * 100, i * 100);
			}
		}
	} else {
		for (let i = 7; i >= 0; i--) {
			for (let j = 7; j >= 0; j--) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				canvas.composite(piece, (7 - j) * 100, (7 - i) * 100);
			}
		}
	}
	return await canvas.encode();*/
	return undefined;
}
