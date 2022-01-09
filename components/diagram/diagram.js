
import { Chess } from './chess.js';

import { createCanvas, loadImage } from "https://deno.land/x/canvas@v1.3.0/mod.ts";

const Board = Deno.readFileSync('./resources/board.png');

const Pieces = {
    'bp': Deno.readFileSync('./resources/alpha/bp.png'),
    'bn': Deno.readFileSync('./resources/alpha/bn.png'),
    'bb': Deno.readFileSync('./resources/alpha/bb.png'),
    'bq': Deno.readFileSync('./resources/alpha/bq.png'),
    'bk': Deno.readFileSync('./resources/alpha/bk.png'),
    'br': Deno.readFileSync('./resources/alpha/br.png'),
    'wp': Deno.readFileSync('./resources/alpha/wp.png'),
    'wn': Deno.readFileSync('./resources/alpha/wn.png'),
    'wb': Deno.readFileSync('./resources/alpha/wb.png'),
    'wq': Deno.readFileSync('./resources/alpha/wq.png'),
    'wk': Deno.readFileSync('./resources/alpha/wk.png'),
    'wr': Deno.readFileSync('./resources/alpha/wr.png'),
};

export async function diagram(fen) {

    if (!Chess().validate_fen(fen)) return null;

    const board = Chess(fen).board();

    const canvas = createCanvas(800, 800);
    const ctx = canvas.getContext('2d');

    // drawing board background:
    ctx.drawImage(await loadImage(Board), 0, 0);

    // drawing pieces:
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] == null) continue;
            const piece = Pieces[board[i][j].color + board[i][j].type];
            ctx.drawImage(await loadImage(piece), j * 100, i * 100);
        }
    }

    return canvas.toBuffer();

}
