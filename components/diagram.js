
import { Position, gif as encoder }
from 'https://deno.land/x/beta_chess_diagrams@v2.0.0/mod.ts';

export async function gif(game, perspective = 'w') {
	const moves = game.history(); game.reset();
	const p = new Position(game.board);
	const frames = [ await p.frame(perspective, true) ];
	/*for (const move of moves) {
		game.move(move);
		frames.push(await (p.set(game.board).frame(perspective, true)));
	}*/
	return encoder(frames);
}

export async function diagram(board, perspective = 'w') {
	const p = new Position(board);
	return await p.picture(perspective);
}
