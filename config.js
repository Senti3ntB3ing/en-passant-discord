
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
	content_ideas: 915564965593759754n,
	   chess_club: 911588588930629683n,
	    challenge: 858358887416594463n,
	     feedback: 882712808050003978n,
	   chess_sets: 929056689909530695n,
	    off_topic: 900781481704706159n,
	        memes: 910623921093623868n,
	         bots: 912689526244274207n,
	       stream: 921464354791116800n,
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
	   staff_chat: 903024322539556874n,
	         bans: 920428101656248350n,
	        voice: 839599928660852826n,
	// ==================================
};

export const Roles = {
	everyone: 0,
	nerd: 845769006752464946n,
	supporter: 913072026942570507n,
	moderator: 839596287787794502n,
	staff: 901205179414769674n,
	student: 845240403246841897n,
	ratings: {
		 'UNR': 912679279609917460n,
		 '100': 912678726523817984n,
		 '200': 912678800985301063n,
		 '300': 912678696165466132n,
		 '400': 912677448934621185n,
		 '500': 912678044626464808n,
		 '600': 912678088167534592n,
		 '700': 912678123609415742n,
		 '800': 912678152311046145n,
		 '900': 912678225073811466n,
		'1000': 912678277951397939n,
		'1100': 912678302840389652n,
		'1200': 912678322058702878n,
		'1300': 912678355327938561n,
		'1400': 912678377461260299n,
		'1500': 912678395178012713n,
		'1600': 912678413926543361n,
		'1700': 912678432922538034n,
		'1800': 912678450937069598n,
		'1900': 912678468486049822n,
		'2000': 912678486479634463n,
		'2100': 912678503126806540n,
		'2200': 912678521091022878n,
		'2300': 912678549914271764n,
		'2400': 912678569094836244n,
		'2500': 912678585658122290n,
		'2600': 912678600778584105n,
		'2700': 912678621469106176n,
		'2800': 912678638900613152n,
		'2900': 912678657473015839n,
		'3000': 912678681414107166n,
	},
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
	error: 0xE70000,
	success: 0x1ABC9D,
	info: 0xFFFFFF,
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

export const Welcome = [
	'O-O-O comes with mate!',
	'double check!',
	'brilliant move!!',
	'Botez Gambit!',
	'rook b1, rook b1!',
	'never play f3!',
	'never play f6!',
	'c4… explosive!',
	'oh no my queen!',
	'Pawndemonium!',
	'knife f5!',
	'I won connect 4!',
	'let\'s make a pawn cube!',
	'the truth hurts',
	'please don\'t hurt me!',
	'there\'s a funny line…',
	'danger levels!',
	'Raaaawr!!',
	'you, with the wrong answer!',
	'always repeat!',
	'how does the knight move?',
	'1. e4 e5 2. Ke2! Ke7!!'
];
