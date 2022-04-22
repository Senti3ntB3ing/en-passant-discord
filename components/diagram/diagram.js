
import { encode, decode, ColorType } from "https://deno.land/x/pngs@0.1.1/mod.ts";

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
	color = color || 'w';
	let img = Board[color].image;
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
	return encode(img, img.width, img.height, {
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
			setPixel(b, i + x, j + y, bend(bp, fp));
		}
	}
	return b;
}

function getPixel(image, x, y) {
	const a = image.colorType == ColorType.RGBA;
	const d = image.image;
	const p = (x + y * image.width) * (a ? 4 : 3);
	return { r: d[p], g: d[p + 1], b: d[p + 2], a: a ? d[p + 3] : 255 };
}

function setPixel(image, x, y, color) {
	const a = image.colorType == ColorType.RGBA;
	let d = image.image;
	const p = (x + y * image.width) * (a ? 4 : 3);
	d[p] = color.r; d[p + 1] = color.g; d[p + 2] = color.b;
	if (!a) return;
	d[p + 3] = 'a' in color ? color.a : 255;
}

function bend(c1, c2) {
	if (c1.a == undefined) c1.a = 255;
	if (c2.a == undefined) c2.a = 255;
    let a = 255 - ((255 - c1.a) * (255 - c2.a) / 255);
    let r = (c1.r * (255 - c2.a) + c2.r * c2.a) / 255;
    let g = (c1.g * (255 - c2.a) + c2.g * c2.a) / 255;
    let b = (c1.b * (255 - c2.a) + c2.b * c2.a) / 255;
    return { r, g, b, a };
}