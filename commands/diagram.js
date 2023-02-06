
import { Chess } from "https://deno.land/x/beta_chess@v1.0.1/chess.js";

import { FENURL, CHESSCOM_REGEX, LICHESSORG_REGEX, Channels } from "../config.js";
import { handleChesscomGame, handlelichessorgGame, handlePGNGame } from "../attachments/game.js";
import { Option, command, error } from "../parser.js";

command({
	name: "fen", emoji: ":page_with_curl:",
	description: "📋 Displays a chess board diagram from FEN.",
	options: [{
		name: "fen", type: Option.String, required: true,
		description: "Forsyth–Edwards Notation",
	}, {
		name: "perspective", type: Option.String, required: false,
		description: "Perspective of the board",
		choices: [
			{ name: "⬜️ White", value: "white" },
			{ name: "⬛️ Black", value: "black" }
		]
	}],
	execute: async interaction => {
		const title = "Chess Diagram";
		const fen = interaction.data.options[0].value.trim();
		const game = new Chess(fen);
		if (game == null || game.fen() != fen) return error(
			"Invalid FEN Positon",
			`**FEN:** \`${fen}\`\n` +
			"https://en.wikipedia.org/wiki/Forsyth–Edwards_Notation"
		);
		let status = "";
		if (game.ended()) {
			if (game.draw()) status = "½-½ ・ Draw";
			else if (game.checkmate())
				status = game.turn == 'w' ? "0-1 ・ ⬛️ Black Won" : "1-0 ・ ⬜️ White Won";
		} else status = game.turn == 'w' ? "⬜️ White to Move" : "⬛️ Black to Move";
		let perspective = game.turn == 'w' ? "white" : "black";
		if (interaction.data.options.length > 1)
			perspective = interaction.data.options[1].value;
		const diagram = await fetch(FENURL + perspective + '/' + fen.replace(/\s.+$/, ''));
		if (diagram.status != 200) return error(
			"FEN Diagram Issue",
			`**FEN:** \`${fen}\`\n` +
			"There was an issue generating the diagram."
		);
		const filename = fen.replace(/[^A-Za-z0-9_.\-]/g, '_') + ".png";
		return {
			file: [{ blob: await diagram.blob(), name: filename }],
			embeds: [{
				type: "image", title, color: game.turn == 'w' ? 0xFFFFFF : 0x000000,
				image: { url: "attachment://" + filename, height: 800, width: 800 },
				description: "**FEN: **`" + fen + "`", footer: { text: status },
			}]
		};
	}
});

command({
	name: "pgn", emoji: ":page_with_curl:",
	description: "📋 Displays an animated game preview.",
	options: [{
		name: "link", type: Option.String, required: true,
		description: "The Chess.com or lichess.org game link",
	}, {
		name: "theme", type: Option.String, required: false,
		description: "Board theme",
		choices: [
			{ name: "💗 Bubble", value: "bubble" },
			{ name: "💚 Nature", value: "nature" },
			{ name: "💙 IceAge", value: "iceage" },
			{ name: "🤎 Wooden", value: "wooden" },
			{ name: "💜 Grapes", value: "grapes" },
		]
	}, {
		name: "perspective", type: Option.String, required: false,
		description: "Perspective of the board",
		choices: [
			{ name: "⬜️ White", value: "white" },
			{ name: "⬛️ Black", value: "black" }
		]
	}],
	execute: async interaction => {
		const link = interaction.data.options[0].value.trim();
		let theme = undefined, perspective = "white";
		for (const option of interaction.data.options) {
			if (option.name == "perspective") perspective = option.value;
			else if (option.name == "theme") theme = option.value;
		}
		let game = undefined;
		if (link.startsWith("1.") || link.startsWith("["))
			game = handlePGNGame(link, perspective[0], theme);
		const c = CHESSCOM_REGEX.exec(link);
		if (c != null && c.length >= 3) game = handleChesscomGame(c[1], c[2],
			perspective[0], theme, interaction.channelId == Channels.guess_the_elo
		);
		const l = LICHESSORG_REGEX.exec(link);
		if (l != null && l.length >= 2) game = handlelichessorgGame(l[1],
			perspective[0], theme, interaction.channelId == Channels.guess_the_elo
		);
		if (game != undefined) return game;
		return error(
			"Invalid Game",
			`**Data:** \`${link}\`\n` +
			"It should be a valid PGN game, or a __Chess.com__ / __lichess.org__ link."
		);
	}
});
