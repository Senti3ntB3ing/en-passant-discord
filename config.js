
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

const Actions = [
	{ type:  'Watching', status: 'Pawn Sacrifice' },
	{ type:  'Watching', status: 'The Queen\'s Gambit' },
	{ type:      'Game', status: 'Chess' },
	{ type:      'Game', status: 'King of the Hill' },
	{ type:      'Game', status: '3-Check' },
	{ type:      'Game', status: 'Crazyhouse' },
	{ type:      'Game', status: 'Chess960' },
	{ type:      'Game', status: 'Antichess' },
	{ type:      'Game', status: 'Racing Kings' },
	{ type:      'Game', status: 'Horde' },
	{ type:      'Game', status: 'Atomic' },
	{ type: 'Listening', status: 'Chopin' },
	{ type: 'Listening', status: 'Mozart' },
	{ type: 'Listening', status: 'Beethoven' },
	{ type: 'Listening', status: 'Bach' },
	{ type: 'Competing', status: 'Tournament' },
	{ type: 'Streaming', status: 'World Cup' },
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
