
export const delay = async ms => new Promise(resolve => setTimeout(resolve, ms));

export const Name = 'en passant';
export const Prefix = '!';

export const Twitch_Streamer = 'thechessnerdlive';

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
	value: t => {
		let cd = 24 * 60 * 60 * 1000,
		ch = 60 * 60 * 1000,
		d = Math.floor(t / cd),
		h = Math.floor((t - d * cd) / ch),
		m = Math.round((t - d * cd - h * ch) / 60000),
		pad = n => n < 10 ? '0' + n : n;
		if (m === 60) { h++; m = 0; }
		if (h === 24) { d++; h = 0; }
		let v = '';
		if (d > 0) v += d + 'd ';
		if (h > 0) v += h + 'h ';
		if (m > 0) v += m + 'm ';
		return v.trim();
	}
}

export const Channels = {
	// == GENERAL =======================
	      general: 839594884289921076n,
	notifications: 839594884289921077n,
	    brilliant: 950350208649273385n,
	   positivity: 957373368749928448n,
		challenge: 858358887416594463n,
		 feedback: 882712808050003978n,
	   chess_club: 911588588930629683n,
			memes: 910623921093623868n,
	  recruitment: 950121447249039403n,
			 bots: 912689526244274207n,
		off_topic: 900781481704706159n,
			 help: 970803118663139378n,
	general_voice: 845012057655869523n,
	// == SUB BAY =======================
	   pro_league: 959118899398467684n,
	    sub_voice: 959119103950463046n,
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
	// == MODERATORS ====================
	     mod_chat: 955959278315917333n,
	     mad_chat: 955959299438440578n,
		 dev_chat: 955959324411310130n,
		audit_log: 920428101656248350n,
		 schedule: 951276135004667944n,
	    mod_voice: 936021898612047892n,
	// ==================================
};

export const Zach = 559086517415444480n;
export const Roles = {
	     everyone: 0,
	administrator: 947621985276530698n,
	         nerd: 845769006752464946n,
	    supporter: 913072026942570507n,
	   subscriber: 959113789800845332n,
	t1_subscriber: 959113789800845333n,
	t2_subscriber: 959113789800845334n,
	t3_subscriber: 959113789800845335n,
		  student: 845240403246841897n,
		moderator: 839596287787794502n,
	 discord_head: 965237029451477014n,
	  discord_mod: 952330006263103488n,
	  twitch_head: 965235946205372426n,
	   twitch_mod: 952330177071964210n,
	   reddit_mod: 952330229504942120n,
			voter: 964868785767059487n,
		 streamer: 967840952737751120n,
	youtube_notification: 973343815148642425n,
	 twitch_notification: 973344119239880734n,
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
