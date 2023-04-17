
export const GuildID = 839594883790012436n;
export const BotID = 847102766018199614n;

export const Name = 'en passant';
export const Prefix = '!';

export const ActionURL = 'https://ep.cristian-98.repl.co/';
export const RevivalURL = 'https://en-passant-discord.deno.dev';
export const MapURL = ActionURL + 'map/';
export const FENURL = 'https://game.cristian-98.repl.co/fen/';
export const PGNURL = 'https://game.cristian-98.repl.co/pgn/';

export const Streamer = 'thechessnerdlive';
export const StreamerID = '428214501';

export const CHESSCOM_REGEX = /https?:\/\/(?:www\.)?chess\.com(?:\/analysis)?\/(?:game\/)?(live|daily)\/(?:game\/)?(\d+)/;
export const LICHESSORG_REGEX = /https?:\/\/(?:www\.)?lichess\.org\/(\w{8})/;

export const Time = {
	second: 1000,
	minute: 60 * 1000,
	quarter: 15 * 60 * 1000,
	hour: 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000,
	week: 7 * 24 * 60 * 60 * 1000,
	month: 30 * 24 * 60 * 60 * 1000,
	year: 365 * 24 * 60 * 60 * 1000,
	seconds: t => t * 1000,
	minutes: t => t * 60 * 1000,
	quarters: t => t * 15 * 60 * 1000,
	hours: t => t * 60 * 60 * 1000,
	days: t => t * 24 * 60 * 60 * 1000,
	weeks: t => t * 7 * 24 * 60 * 60 * 1000,
	months: t => t * 30 * 24 * 60 * 60 * 1000,
	years: t => t * 365 * 24 * 60 * 60 * 1000,
	week_number: date => {
		const d = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
		);
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
	}
};

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

export const TitleCode = {
	'Grandmaster': 'GM',
	'Grand Master': 'GM',
	'International Master': 'IM',
	'FIDE Master': 'FM',
	'Candidate Master': 'CM',
	'National Master': 'NM',
	'Woman Grandmaster': 'WGM',
	'Woman Grand Master': 'WGM',
	'Woman Intl. Master': 'WIM',
	'Woman International Master': 'WIM',
	'Woman FIDE Master': 'WFM',
	'Woman Candidate Master': 'WCM',
	'Woman National Master': 'WNM',
};

export const control = t => (
	t.match(/(\d+)\s*(?:\+\s*(\d+))?/).slice(1)
	.map(e => !(e % 60) ? e / 60 : e)
	.map(e => e || '0').join('+')
);

export const Size = {
	byte: 1,
	kilobyte: 1024,
	megabyte: 1024 ** 2,
	gigabyte: 1024 ** 3,
	terabyte: 1024 ** 4,
	bytes: t => t,
	kilobytes: t => t * 1024,
	megabytes: t => t * 1024 ** 2,
	gigabytes: t => t * 1024 ** 3,
	terabytes: t => t * 1024 ** 4,
};

export const Channels = {
	// == INFORMATION ===================
			rules: 844682003139002369n,
	notifications: 839594884289921077n,
	  recruitment: 950121447249039403n,
	  // == GENERAL =======================
	      general: 839594884289921076n,
	    questions: 999784843208560661n,
	      company: 1025103988259045397n,
		challenge: 858358887416594463n,
		   reddit: 973541665258242068n,
			memes: 910623921093623868n,
		off_topic: 900781481704706159n,
	   positivity: 957373368749928448n,
		 commands: 996939135900205056n,
	general_voice: 845012057655869523n,
	// == TWITCH ========================
	   subscribers: 959118899398467684n,
	 guess_the_elo: 973543620558880768n,
	guess_the_eval: 989255062117285898n,
		 sub_voice: 959119103950463046n,
	// == STUDY ROOM ====================
		 openings: 1019646682226507807n,
	  middlegames: 1019649141690871819n,
		 endgames: 1019649491277729792n,
		  puzzles: 844684087981244467n,
		brilliant: 950350208649273385n,
			games: 912840725375377478n,
	  study_voice: 1031996220551475251n,
	// == MODERATORS ====================
		  academy: 996930857250062387n,
		 mod_chat: 996939904275714108n,
		 mid_chat: 996939922588057710n,
		 mad_chat: 996929332134023258n,
		mod_voice: 936021898612047892n,
	// == Developers ====================
		 dev_chat: 998669238917144659n,
		bot_tests: 996929310801788929n,
		dev_voice: 998670633170911252n,
	// ==================================
};

export const Zach = 559086517415444480n;
export const Roles = {
		 everyone: 839594883790012436n,
	administrator: 947621985276530698n,
			 nerd: 845769006752464946n,
		supporter: 913072026942570507n,
	   subscriber: 959113789800845332n,
	t1_subscriber: 959113789800845333n,
	t2_subscriber: 959113789800845334n,
	t3_subscriber: 959113789800845335n,
		  student: 845240403246841897n,
		human_res: 987633991362420737n,
		moderator: 839596287787794502n,
		developer: 973647937257242654n,
		 baby_mod: 997103870306160661n,
	  retired_mod: 1014267785821564949n,
		 streamer: 967840952737751120n,
			  vip: 997104755572756501n,
			  art: 1020635093083107358n,
	platforms: {
			   'FIDE': 922543456285503508n,
		  'chess.com': 912688297338359848n,
		'lichess.org': 912688177498697758n,
	},
	titles: {
		 GM: 844910347819548763n,
		WGM: 844910588454371328n,
		 IM: 844910310590513153n,
		WIM: 844910492912582677n,
		 FM: 844909793805729813n,
		WFM: 844910374482739230n,
		 NM: 852274554306691115n,
		WNM: 852274736486023219n,
		 CM: 844910027865325598n,
		WCM: 844910399509233704n,
	},
	// Notifications:
	    twitch: 1070673648777711657n,
	   youtube: 1070673341284892706n,
	    reddit: 1070675589922574346n,
	tournament: 1072008754633121822n,
	// Pronouns:
	   he_him: 1070673804885508146n,
	  she_her: 1070673916026167377n,
	they_them: 1070673984359764089n,
};

export const ColorCodes = {
	normal: 0x1ABC9C,
	error: 0xDD2E44,
	success: 0x77B255,
	info: 0x3C88C3,
	warn: 0xFFCC4D,
	titled: 0xF1C40F,
	random: () => Math.floor(Math.random() * (0xFFFFFF + 1))
};

export const ActionTypes = {
	game: 0, streaming: 1, listening: 2,
	watching: 3, custom: 4, competing: 5
};

export const Actions = [
	{ type:  ActionTypes.watching, status: 'Pawn Sacrifice' },
	{ type:  ActionTypes.watching, status: 'The Queen\'s Gambit' },
	{ type:      ActionTypes.game, status: 'Chess' },
	{ type:      ActionTypes.game, status: 'King of the Hill' },
	{ type:      ActionTypes.game, status: '3-Check' },
	{ type:      ActionTypes.game, status: 'Crazyhouse' },
	{ type:      ActionTypes.game, status: 'Chess960' },
	{ type:      ActionTypes.game, status: 'Antichess' },
	{ type:      ActionTypes.game, status: 'Racing Kings' },
	{ type:      ActionTypes.game, status: 'Horde' },
	{ type:      ActionTypes.game, status: 'Atomic' },
	{ type: ActionTypes.listening, status: 'Aman Hambleton' },
	{ type: ActionTypes.listening, status: 'Eric Hansen' },
	{ type: ActionTypes.listening, status: 'Eric Rosen' },
	{ type: ActionTypes.listening, status: 'Ben Finegold' },
	{ type: ActionTypes.listening, status: 'Daniel Naroditsky' },
	{ type: ActionTypes.listening, status: 'Yasser Seirawan' },
	{ type: ActionTypes.listening, status: 'Magnus Carlsen' },
	{ type: ActionTypes.listening, status: 'Levy Rozman' },
	{ type: ActionTypes.listening, status: 'Alexandra Botez' },
	{ type: ActionTypes.listening, status: 'Anna Rudolf' },
	{ type: ActionTypes.listening, status: 'Anna Cramling' },
	{ type: ActionTypes.listening, status: 'Andrew Tang' },
	{ type: ActionTypes.competing, status: 'Tournament' },
];

export const Welcome = [
	'`O-O-O#!!` with checkmate!',
	'`O-O#!!` with checkmate!',
	'double check!',
	'brilliant move!!',
	'Botez Gambit!',
	'rook `b1`, rook `b1`!',
	'never play `f3`!',
	'never play `f6`!',
	'always play `Bf8`!',
	'always play `Bf1`!',
	'`c4`… explosive!',
	'oh no my queen!',
	'pawndemonium!',
	'knife `f5`!',
	'I won connect 4!',
	'let’s make a pawn cube!',
	'the truth hurts',
	'please don’t hurt me!',
	'there’s a funny line…',
	'danger levels!',
	'even a poor plan is better than no plan!',
	'you can’t lose if you don’t play!',
	'one queen is good, but two is better',
	'chess is a fairy tale of 1001 blunders',
	'without error there can be no brilliancy',
	'every Master was once a beginner',
	'the hardest game to win is a winning game',
	'help your pieces so they can help you',
	'never accept the second gambit pawn',
	'a sacrifice is best refuted by accepting it',
	'every pawn is a potential queen',
	'RAAAAWR!!',
	'push ’em baby!',
	'you, with the wrong answer!',
	'always repeat!',
	'trying is the first step to failure!',
	'how does the knight move?',
	'triple, quadruple discovered check!',
	'1. `e4` `e5` 2. `Ke2!` `Ke7!!`',
	'always play en-passant!',
	'activate your pieces!',
	'don’t forget to castle!',
	'develop your minor pieces!',
	'play for the center!',
	'think on your opponent’s clock!',
	'the pin is mightier than the sword!',
	'fight till the end!',
];

// idea: marble
export const Themes = [ 'bubble', 'nature', 'iceage', 'wooden', 'grapes' ];
