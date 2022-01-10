
export const Name = 'en passant';
export const Prefix = '!';

export const Channels = {
	general: 839594884289921076n,
	notifications: 839594884289921077n,
};

export const Roles = {
	everyone: 0,
	moderator: 839596287787794502n,
	staff: 901205179414769674n
};

export const ColorCode = {
	error: 0xE70000,
	success: 0x1ABC9D,
	info: 0xFFFFFF,
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
	'retreat like a Frenchman!',
	'always repeat!',
	'how does the knight move?',
	'1. e4 e5 2. Ke2! Ke7!!'
];
