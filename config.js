
export const delay = async ms => new Promise(resolve => setTimeout(resolve, ms));

export const Name = 'en passant';
export const Prefix = '!';

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
}

export const Channels = {
	// == GENERAL =======================
	      general: 839594884289921076n,
	notifications: 839594884289921077n,
	  recruitment: 950121447249039403n,
	    brilliant: 950350208649273385n,
	content_ideas: 915564965593759754n,
	   chess_club: 911588588930629683n,
	    challenge: 858358887416594463n,
	     feedback: 882712808050003978n,
	   chess_sets: 929056689909530695n,
	    off_topic: 900781481704706159n,
	        memes: 910623921093623868n,
	         bots: 912689526244274207n,
	// == CHESS =========================
	     openings: 839594884289921079n,
	  middlegames: 839594884289921080n,
	     endgames: 839594884289921081n,
	      puzzles: 844684087981244467n,
	        games: 912840725375377478n,
	// == VOTE CHESS ====================
	   vote_chess: 845769660108636171n,
	   discussion: 911278525129064458n,
	   past_games: 865897303822172160n,
	// == STUDY =========================
	         text: 921783499315351612n,
	      voice_1: 845012057655869523n,
	      voice_2: 920065309770137650n,
	      voice_3: 932303088973402172n,
	// == MODERATORS ====================
	     mod_chat: 839597908999274526n,
	     mad_chat: 918169575848308766n,
		 dev_chat: 903024322539556874n,
		 feedback: 950442416261976095n,
		audit_log: 920428101656248350n,
	        voice: 839599928660852826n,
	// ==================================
};

export const Roles = {
	Zach: 559086517415444480n,
	everyone: 0,
	nerd: 845769006752464946n,
	supporter: 913072026942570507n,
	moderator: 839596287787794502n,
	staff: 901205179414769674n,
	student: 845240403246841897n,
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
	}
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
	{ type: ActionTypes.listening, status: 'Chopin' },
	{ type: ActionTypes.listening, status: 'Mozart' },
	{ type: ActionTypes.listening, status: 'Beethoven' },
	{ type: ActionTypes.listening, status: 'Bach' },
	{ type: ActionTypes.competing, status: 'Tournament' },
	{ type: ActionTypes.streaming, status: 'World Cup' },
];

export const YTChannel = 'UCiEgruTJIBdmH7oRmC6EMoA';

export const Welcome = [
	'`O-O-O#!!` with checkmate!',
	'`O-O#!!` with checkmate!',
	'double check!',
	'brilliant move!!',
	'Botez Gambit!',
	'rook `b1`, rook `b1`!',
	'never play `f3`!',
	'never play `f6`!',
	'always play `bf8`!',
	'always play `bf8`!',
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
	'RAAAAWR!!',
	'push ’em baby!',
	'you, with the wrong answer!',
	'always repeat!',
	'trying is the first step to failure!',
	'how does the knight move?',
	'triple, quadruple discovered check!',
	'1. `e4` `e5` 2. `Ke2!` `Ke7!!`'
];
