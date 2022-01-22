
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

export const Quotes = [
	{
		author: 'Adolf Anderssen', title: 'M',
		quotes: [
			'Attack! Always Attack!',
		]
	},
	{
		author: 'Akiba Rubinstein', title: 'GM',
		quotes: [
			'Who is your opponent tonight, tonight I am playing against the black pieces.',
		]
	},
	{
		author: 'Albert Einstein',
		quotes: [
			'Chess holds its master in its own bonds, shackling the mind and brain so that the inner freedom of the very strongest must suffer.',
			'The enormous mental resilience, without which no chess player can exist, was so much taken up by chess that he could never free his mind of this game.',
		]
	},
	{
		author: 'Alexander Alekhine', title: 'GM',
		quotes: [
			'During a chess competition a chess master should be a combination of a beast of prey and a monk.',
			'When asked, “How is that you pick better moves than your opponents?”, I responded: I’m very glad you asked me that, because, as it happens, there is a very simple answer. I think up my own moves, and I make my opponent think up his.',
			'As a rule, so-called “positional” sacrifices are considered more difficult, and therefore more praise-worthy than those which are based exclusively on an exact calculation of tactical possibilities.',
			'Chess is a matter of vanity.',
			'During a chess tournament a master must envisage himself as a cross between an ascetic monk and a beast of prey.',
			'For my victory over Capablanca I am indebted primarily to my superiority in the field of psychology. Capablanca played, relying almost exclusively on his rich intuitive talent. But for the chess struggle nowadays one needs a subtle knowledge of human nature, an understanding of the opponent’s psychology.',
		]
	},
	{
		author: 'Alexander Khalifman', title: 'GM',
		quotes: [
			'Never play for the win, never play for the draw, just play chess!',
		]
	},
	{
		author: 'Alexander Kotov', title: 'GM',
		quotes: [
			'Bobby Fischer is the greatest chess genius of all time!',
			'Drawing general conclusions about your main weaknesses can provide a great stimulus to further growth.',
			'After a great deal of discussion in Soviet literature about the correct definition of a combination, it was decided that from the point of view of a methodical approach it was best to settle on this definition - A combination is a forced variation with a sacrifice.',
			'Anyone who wishes to learn how to play chess well must make himself or herself thoroughly conversant with the play in positions where the players have castled on opposite sides.',
			'Experience and the constant analysis of the most varied positions builds up a store of knowledge in a player’s mind enabling him often at a glance to assess this or that position.',
			'Go through detailed variations in your own time, think in a general way about the position in the opponent’s time and you will soon find that you get into time trouble less often, that your games have more content to them, and that their general standard rises.',
			'Here is a definition which correctly reflects the course of thought and action of a grandmaster: The plan in a game of chess is the sum total of successive strategical operations which are each carried out according to separate ideas arising from the demands of the position.',
			'I cannot think that a player genuinely loving the game can get pleasure just from the number of points scored no matter how impressive the total. I will not speak of myself, but for the masters of the older generation, from whose games we learned, the aesthetic side was the most important.',
		]
	},
	{
		author: 'Alexander Morozevich', title: 'GM',
		quotes: [
			'A sport, a struggle for results and a fight for prizes. I think that the discussion about “chess is science or chess is art” is already inappropriate. The purpose of modern chess is to reach a result.',
		]
	},
	{
		author: 'Aleksej Stepanovič Suėtin', title: 'GM',
		quotes: [
			'My God, Bobby Fischer plays so simply.',
			'Apart from direct mistakes, there is nothing more ruinous than routine play, the aim of which is mechanical development.',
		]
	},
	{
		author: 'Alfred Binet', title: 'M',
		quotes: [
			'Could we look into the head of a chess player, we should see there a whole world of feelings, images, ideas, emotion and passion.',
		]
	},
	{
		author: 'Anatoly Karpov', title: 'GM',
		quotes: [
			'Chess is everything: art, science and sport.',
			'An amusing fact: as far as I can recall, when playing the Ruy Lopez I have not yet once in my life had to face the Marshall Attack!',
			'But how difficult it can be to gain the desired full point against an opponent of inferior strength, when this is demanded by the tournament position!',
			'By all means examine the games of the great chess players, but don’t swallow them whole. Their games are valuable not for their separate moves, but for their vision of chess, their way of thinking.',
			'Combinations with a queen sacrifice are among the most striking and memorable…',
			'Furman astounded me with his chess depth, a depth which he revealed easily and naturally, as if all he were doing was establishing well-known truths.',
		]
	},
	{
		author: 'Andrew Soltis', title: 'GM',
		quotes: [
			'Failing to open the center at the right moment, a common error by White in the Exchange Lopez, can allow Black an excellent game.',
			'Chess is really ninety nine percent calculation.',
			'You know you’re going to lose. Even when I was ahead I knew I was going to lose (on playing against Fischer).',
		]
	},
	{
		author: 'Aron Nimzowitsch',
		quotes: [
			'Even the laziest king flees wildly in the face of a double check!',
			'The defensive power of a pinned piece is only imaginary.',
			'The passed pawn is a criminal, who should be kept under lock and key. Mild measures, such as police surveillance, are not sufficient.',
			'The isolated pawn casts gloom over the entire chessboard.',
			'The beauty of a move lies not in its appearance but in the thought behind it.',
			'Many men, many styles; what is chess style but the intangible expression of the will to win.',
			'First restrain, next blockade, lastly destroy.',
			'Chess strategy as such today is still in its diapers, despite Tarrasch’s statement “We live today in a beautiful time of progress in all fields”. Not even the slightest attempt has been made to explore and formulate the laws of chess strategy.',
			'First restrain, next blockade, lastly destroy.',
		]
	},
	{
		author: 'Tassilo von Heydebrand und der Lasa', title: 'M',
		quotes: [
			'Chess is in its essence a game, in its form an art, and in its execution a science.',
		]
	},
	{
		author: 'Benjamin Franklin',
		quotes: [
			'Life is a kind of chess, with struggle, competition, good and ill events.',
			'The game of chess is not merely an idle amusement; several very valuable qualities of the mind are to be acquired and strengthened by it, so as to become habits ready on all occasions; for life is a kind of chess.',
			'By playing at chess then, we may learn: First: Foresight. Second: Circumspection. Third: Caution. And lastly, we learn by chess the habit of not being discouraged by present bad appearances in the state of our affairs, the habit of hoping for a favorable chance, and that of persevering in the secrets of resources.',
			'Chess is so interesting in itself, as not to need the view of gain to induce engaging in it; and thence it is never played for money.',
		]
	},
	{
		author: 'Bent Larsen', title: 'GM',
		quotes: [
			'Chess is a beautiful mistress.',
			'The stomach is an essential part of the chess master.',
			'Lack of patience is probably the most common reason for losing a game, or drawing games that should have been won.',
			'I often play a move I know how to refute.',
			'A chess player never has a heart attack in a good position.',
			'A draw may be the beautiful and logical result of fine attacks and parries; and the public ought to appreciate such games, in contrast, of course, to the fear-and-laziness draws.',
			'A gambit never becomes sheer routine as long as you fear you may lose the king and pawn ending!',
			'All chess masters have on occasion played a magnificent game and then lost it by a stupid mistake, perhaps in time pressure and it may perhaps seem unjust that all their beautiful ideas get no other recognition than a zero on the tournament table.',
			'Among top grandmasters the Dutch is a rare defense, which is good reason to play it! It has not been studied very deeply by many opponents, and theory, based on a small number of “reliable” games, must be rather unreliable.',
			'Chess is my profession. I am my own boss; I am free. I like literature and music, classical especially. I am in fact quite normal; I have a Bohemian profession without being myself a Bohemian. I am neither a conformist nor a great revolutionary.',
			'For me, chess is at the same time a game, a sport, a science and an art. And perhaps even more than that. There is something hard to explain to those who do not know the game well. One must first learn to play it correctly in order to savor its richness.',
			'Had I not played the Sicilian with Black I could have saved myself the trouble of studying for more than 20 years all the more popular lines of this opening, which comprise probably more than 25 percent of all published opening theory!',
		]
	},
	{
		author: 'William Hartston', title: 'IM',
		quotes: [
			'Chess is a contributor to net human unhappiness, since the pleasure of victory is greatly exceeded by the pain of defeat.',
		]
	},
	{
		author: 'Blaise Pascal',
		quotes: [
			'Chess is the gymnasium of the mind.',
		]
	},
	{
		author: 'Robert James Fischer', title: 'GM',
		quotes: [
			'All I want to do, ever, is just play chess.',
			'I don’t believe in psychology. I believe in good moves.',
			'Your body has to be in top condition. Your chess deteriorates as your body does. You can’t separate body from mind.',
			'It’s just you and your opponent at the board and you’re trying to prove something.',
			'Chess is like war on a board.',
			'You have to have the fighting spirit. You have to force moves and take chances.',
			'That’s what chess is all about. One day you give your opponent a lesson, the next day he gives you one.',
			'I like the moment when I break a man’s ego.',
			'I am the best player in the world and I am here to prove it.',
			'If I win a tournament, I win it by myself. I do the playing. Nobody helps me.',
			'A strong memory, concentration, imagination, and a strong will is required to become a great chess player.',
			'I know people who have all the will in the world, but still can’t play good chess.',
			'Different people feel differently about resigning.',
			'All that matters on the chessboard is good moves.',
			'Tactics flow from a superior position.',
			'Chess is life.',
			'Best by test: `1. e4`.',
			'Morphy was probably the greatest genius of them all.',
			'My opponents make good moves too. Sometimes I don’t take these things into consideration.',
			'Chess demands total concentration.',
			'All my games are real.',
			'Chess is war over the board. The object is to crush the opponents mind.',
			'You can only get good at chess if you love the game.',
			'All that matters on the chessboard is good moves.',
			'Americans really don’t know much about chess. But I think when I beat Spassky, that Americans will take a greater interest in chess. Americans like winners.',
			'Blitz chess kills your ideas.',
			'Chess is a matter of delicate judgement, knowing when to punch and how to duck.',
			'Concentrate on material gains. Whatever your opponent gives you take, unless you see a good reason not to.',
			'Genius. It’s a word. What does it really mean? If I win I’m a genius. If I don’t, I’m not.',
		]
	},
	{
		author: 'Boris Gelfand', title: 'GM',
		quotes: [
			'The good thing in chess is that very often the best moves are the most beautiful ones. The beauty of logic.',
			'A lot of these ideas are built under wrong presumptions which officials have that chess players are lazy bastards whose sole idea is to deceive (the) public and to make short draws and go home. It’s not true. It’s a lie. (On the Sofia Corsica rule)',
			'I am pleased that in a match for the World Championship I was able to conduct a game in the style of Akiba Rubinstein, where the entire strategic course was maintained from the first to the last move. (on Game 7 of his 2012 match with Anand)',
		]
	},
	{
		author: 'Boris Spassky', title: 'GM',
		quotes: [
			'Chess is like life.',
			'When you play Bobby, it is not a question if you win or lose. It is a question if you survive.',
			'There is only one thing Fischer does in chess without pleasure: to lose!',
			'After I won the title, I was confronted with the real world. People do not behave naturally anymore – hypocrisy is everywhere.',
		]
	},
	{
		author: 'Bruce Pandolfini', title: 'NM',
		quotes: [
			'We don’t really know how the game was invented, though there are suspicions. As soon as we discover the culprits, we’ll let you know.',
			'Fischer was a master of clarity and a king of artful positioning. His opponents would see where he was going but were powerless to stop him.',
			'I like to say that Bobby Fischer was the greatest player ever. But what made Fischer a genius was his ability to blend an American freshness and pragmatism with Russian ideas about strategy.',
		]
	},
	{
		author: 'Burt Hochberg',
		quotes: [
			'With or without the title, Bobby Fischer was unquestionably the greatest player of his time.',
		]
	},
	{
		author: 'Cecil Purdy', title: 'IM',
		quotes: [
			'Methodical thinking is of more use in chess than inspiration.',
			'Pawn endings are to chess what putting is to golf.',
		]
	},
	{
		author: 'Dan Heisman', title: 'NM',
		quotes: [
			'When you trade, the key concern is not always the value of the pieces being exchanged, but what’s left on the board.',
			'Don’t be afraid of losing, be afraid of playing a game and not learning something.',
			'Don’t worry about your rating, work on your playing strength and your rating will follow.',
		]
	},
	{
		author: 'Daniel King', title: 'GM',
		quotes: [
			'Having spent alarmingly large chunks of my life studying the white side of the Open Sicilian, I find myself asking, why did I bother?',
		]
	},
	{
		author: 'David Bronstein', title: 'GM',
		quotes: [
			'The essence of chess is thinking about what chess is.',
			'The most powerful weapon in chess is to have the next move.',
			'Chess is imagination.',
			'A strong player requires only a few minutes of thought to get to the heart of the conflict. You see a solution immediately, and half an hour later merely convince yourself that your intuition has not deceived you.',
			'But whatever you might say and whatever I might say, a machine which can play chess with people is one of the most marvellous wonders of our 20th century!',
			'Chess is infinite, and one has to make only one ill-considered move, and one’s opponent’s wildest dreams will become reality.',
			'Even in the heat of a middlegame battle the master still has to bear in mind the outlines of a possible future ending.',
			'Far from all of the obvious moves that go without saying are correct.',
		]
	},
	{
		author: 'Dawid Janowski',
		quotes: [
			'I detest the endgame. A well-played game should be practically decided in the middlegame.',
		]
	},
	{
		author: 'Edmar Mednis', title: 'GM',
		quotes: [
			'In chess, at least, the brave inherit the earth.',
			'Winning isn’t everything… but losing is nothing.',
			'After a bad opening, there is hope for the middle game. After a bad middle game, there is hope for the endgame. But once you are in the endgame, the moment of truth has arrived.',
			'Bobby Fischer started off each game with a great advantage: after the opening he had used less time than his opponent and thus had more time available later on. The major reason why he never had serious time pressure was that his rapid opening play simply left sufficient time for the middlegame.',
			'Even when the time control has been reached, there is one situation where you want to act as if it has not: when your position is absolutely lost.',
		]
	},
	{
		author: 'Eduard Gufeld', title: 'GM',
		quotes: [
			'You are for me the queen on d8 and I am the pawn on d7!!',
			'For me, chess is life and every game is like a new life. Every chess player gets to live many lives in one lifetime.',
		]
	},
	{
		author: 'Efim Geller', title: 'GM',
		quotes: [
			'It was clear to me that the vulnerable point of the American Grandmaster (Bobby Fischer) was in double-edged, hanging, irrational positions, where he often failed to find a win even in a won position.',
		]
	},
	{
		author: 'Emanuel Lasker', title: 'WCC',
		quotes: [
			'When you see a good move, look for a better one.',
			'I have added these principles to the law: get the Knights into action before both Bishops are developed.',
			'Without error there can be no brilliancy.',
			'Chess is above all, a fight!',
			'The hardest game to win is a won game.',
			'The combination player thinks forward; he starts from the given position, and tries the forceful moves in his mind.',
			'On the chessboard, lies and hypocrisy do not survive long.',
			'In chess, as it is played by masters, chance is practically eliminated.',
			'The laws of chess do not permit a free choice: you have to move whether you like it or not.',
			'On the chessboard lies and hypocrisy do not last long.',
			'A chess game, after all, is a fight in which all possible factors must be made use of, and in which a knowledge of the opponent’s good and bad qualities is of the greatest importance.',
			'By positional play a master tries to prove and exploit true values, whereas by combinations he seeks to refute false values… A combination produces an unexpected re-assessment of values.',
			'By some ardent enthusiasts Chess has been elevated into a science or an art. It is neither; but its principal characteristic seems to be what human nature mostly delights in a fight.',
			'By what right does White, in an absolutely even position, such as after move one, when both sides have advanced `1. e4`, sacrifice a pawn, whose recapture is quite uncertain, and open up his kingside to attack? And then follow up this policy by leaving the check of the black queen open? None whatever !',
			'Chess is, above all, a fight.',
			'Do not permit yourself to fall in love with the end-game play to the exclusion of entire games. It is well to have the whole story of how it happened; the complete play, not the denouement only. Do not embrace the rag-time and vaudeville of chess.',
			'He who has a slight disadvantage plays more attentively, inventively and more boldly than his antagonist who either takes it easy or aspires after too much. Thus a slight disadvantage is very frequently seen to convert into a good, solid advantage.',
			'I believe in magic… There is magic in the creative faculty such as great poets and philosophers conspicuously possess, and equally in the creative chessmaster.',
		]
	},
	{
		author: 'Eugene Znosko-Borovsky',
		quotes: [
			'It is not a move, even the best move that you must seek, but a realizable plan.',
			'A defeatist spirit must inevitably lead to disaster.',
			'Avoidance of mistakes is the beginning, as it is the end, of mastery in chess.',
			'Haste is never more dangerous than when you feel that victory is in your grasp.',
			'Haste, the great enemy.',
			'All chess players know what a combination is. Whether one makes it oneself, or is its victim, or reads of it, it stands out from the rest of the game and stirs one’s admiration.',
			'All conceptions in the game of chess have a geometrical basis.',
		]
	},
	{
		author: 'François-André Danican Philidor',
		quotes: [
			'A pawn, when separated from his fellows, will seldom or never make a fortune.',
			'The pawns are the soul of the game.',
			'Pawns; they are the soul of this game, they alone form the attack and defense.',
		]
	},
	{
		author: 'Fred Reinfeld', title: 'NM',
		quotes: [
			'The Pin is mightier than the sword.',
			'But alas! Like many another consummation devoutly to be wished, the actual performance was a disappointing one. (on the long awaited Lasker-Capablanca match in 1921)',
		]
	},
	{
		author: 'Fred Yates & William Winter', title: 'M',
		quotes: [
			'In the perfect chess combination as in a first-rate short story, the whole plot and counter-plot should lead up to a striking finale, the interest not being allayed until the very last moment.',
		]
	},
	{
		author: 'Frederick Milne Edge',
		quotes: [
			'Chess is a bond of brotherhood amongst all lovers of the noble game, as perfect as free masonry. It is a leveller of rank - title, wealth, nationality, politics, religion - all are forgotten across the board.',
			'Deschapelles became a first-rate player in three days, at the age of something like thirty. Nobody ever believed the statement, not even Deschapelles himself, although his biographer declares he had told the lie so often that he at last forgot the facts of the case.',
		]
	},
	{
		author: 'Garry Kasparov', title: 'GM',
		quotes: [
			'Chess is mental torture.',
			'When your house is on fire, you can’t be bothered with the neighbors. Or, as we say in chess, if your king is under attack you don’t worry about losing a pawn on the queen’s side.',
			'Botvinnik tried to take the mystery out of chess, always relating it to situations in ordinary life. He used to call chess a typical inexact problem similar to those which people are always having to solve in everyday life.',
			'We like to think.',
			'By this measure (on the gap between Fischer & his contemporaries), I consider him the greatest world champion.',
			'Any experienced player knows how a change in the character of the play influences your psychological mood.',
			'Attackers may sometimes regret bad moves, but it is much worse to forever regret an opportunity you allowed to pass you by.',
			'Attackers may sometimes regret bad moves, but it is much worse to forever regret an opportunity you allowed to pass you by.',
			'Boris Vasilievich was the only top-class player of his generation who played gambits regularly and without fear… Over a period of 30 years he did not lose a single game with the King’s Gambit, and among those defeated were numerous strong players of all generations, from Averbakh, Bronstein and Fischer, to Seirawan.',
			'Botvinnik tried to take the mystery out of Chess, always relating it to situations in ordinary life. He used to call chess a typical inexact problem similar to those which people are always having to solve in everyday life.',
			'By strictly observing Botvinnik’s rule regarding the thorough analysis of one’s own games, with the years I have come to realize that this provides the foundation for the continuous development of chess mastery.',
			'By the time a player becomes a Grandmaster, almost all of his training time is dedicated to work on this first phase. The opening is the only phase that holds out the potential for true creativity and doing something entirely new.',
			'Chess continues to advance over time, so the players of the future will inevitably surpass me in the quality of their play, assuming the rules and regulations allow them to play serious chess. But it will likely be a long time before anyone spends 20 consecutive years as number one, as I did.',
			'Chess is a unique cognitive nexus, a place where art and science come together in the human mind and are refined and improved by experience.',
			'Chess is far too complex to be definitively solved with any technology we can conceive of today. However, our looked-down-upon cousin, checkers, or draughts, suffered this fate quite recently thanks to the work of Jonathan Schaeffer at the University of Alberta and his unbeatable program Chinook.',
			'Chess strength in general and chess strength in a specific match are by no means one and the same thing.',
			'Enormous self-belief, intuition, the ability to take a risk at a critical moment and go in for a very dangerous play with counter-chances for the opponent - it is precisely these qualities that distinguish great players.',
			'Excelling at chess has long been considered a symbol of more general intelligence. That is an incorrect assumption in my view, as pleasant as it might be.',
			'Few things are as psychologically brutal as chess.',
			'All that now seems to stand between Nigel and the prospect of the world crown is the unfortunate fact that fate brought him into this world only two years after Kasparov.',
			'For me, chess is a language, and if it’s not my native tongue, it is one I learned via the immersion method at a young age.',
		]
	},
	{
		author: 'Genrikh Chepukaitis',
		quotes: [
			'You need not play well - just help your opponent to play badly.',
		]
	},
	{
		author: 'Georg Kieninger', title: 'IM',
		quotes: [
			'Dazzling combinations are for the many, shifting wood is for the few.',
		]
	},
	{
		author: 'Georges Renaud & Victor Kahn', title: 'M',
		quotes: [
			'Chess is played with the mind and not with the hands!',
		]
	},
	{
		author: 'Gerald Abrahams', title: 'M',
		quotes: [
			'Good positions don’t win games, good moves do.',
			'The tactician knows what to do when there is something to do; whereas the strategian knows what to do when there is nothing to do.',
			'Chess is a good mistress, but a bad master.',
		]
	},
	{
		author: 'Gregor Piatigorsky',
		quotes: [
			'A male scorpion is stabbed to death after mating. In chess, the powerful queen often does the same to the king without giving him the satisfaction of a lover.',
		]
	},
	{
		author: 'Henry Edward Bird', title: 'M',
		quotes: [
			'Place the contents of the chess box in a hat, shake them up vigorously, pour them on the board from a height of two feet, and you get the style of Steinitz.',
		]
	},
	{
		author: 'Hans Kmoch', title: 'IM',
		quotes: [
			'The battle for the ultimate truth will never be won. And that’s why chess is so fascinating.',
			'Has he some psychological antipathy to realism? I am no psychologist, and cannot say. The fact remains that Euwe commits the most inexplicable mistakes in thoroughly favorable positions, and that this weakness has consistently tarnished his record.',
		]
	},
	{
		author: 'Hans Ree', title: 'GM',
		quotes: [
			'Chess is beautiful enough to waste your life for.',
		]
	},
	{
		author: 'Harry Golombek', title: 'OGM',
		quotes: [
			'Barcza is the most versatile player in the opening. He sometimes plays P-KN3 on the first, sometimes on the second, sometimes on the third, and sometimes only on the fourth move.',
			'Books on the openings abound; nor are works on the end game wanting; but those on the middle game can be counted on the fingers of one hand.',
		]
	},
	{
		author: 'Hein Donner', title: 'GM',
		quotes: [
			'I love all positions. Give me a difficult positional game, I will play it. But totally won positions, I cannot stand them.',
		]
	},
	{
		author: 'Hikaru Nakamura', title: 'GM',
		quotes: [
			'The single most important thing in life is to believe in yourself regardless of what everyone else says.',
			'Players who balk at playing one-minute chess are failing to see the whole picture. They shouldn’t be worrying that they will make more mistakes – they should be rubbing their hands in glee at the thought of all the mistakes their opponents will make.',
			'GM Naiditsch reckoned that me playing the King’s Indian against Anand was something akin to a samurai running at a machine gun with a sword.',
		]
	},
	{
		author: 'Howard Staunton', title: 'M',
		quotes: [
			'After black’s reply to `1. e4` with `1 ... e5`, leaves him always trying to get into the game.',
		]
	},
	{
		author: 'Irving Chernev',
		quotes: [
			'The sign of a great master is his ability to win a won game quickly and painlessly.',
			'Chess is not for the timid.',
			'Every Chess master was once a beginner.',
		]
	},
	{
		author: 'Isaac Kashdan', title: 'GM',
		quotes: [
			'In Fischer’s hands, a slight theoretical advantage is as good a being a queen ahead.',
		]
	},
	{
		author: 'Israel Albert Horowitz', title: 'IM',
		quotes: [
			'One bad move nullifies forty good ones.',
			'Chess is a great game. No matter how good one is, there is always somebody better. No matter how bad one is, there is always somebody worse.',
		]
	},
	{
		author: 'Jamie Walter Adams',
		quotes: [
			'I’m not a materialistic person, in that, I don’t suffer the lack or loss of money. The absence of worldly goods I don’t look back on. For chess is a way I can be as materialistic as I want without having to sell my soul ',
			'These are not pieces, they are men! For any man to walk into the line of fire will be one less man in your army to fight for you. Value every troop and use him wisely, throw him not to the dogs as he is there to serve his king.',
		]
	},
	{
		author: 'Jan Timman', title: 'GM',
		quotes: [
			'Half the variations which are calculated in a tournament game turn out to be completely superfluous. Unfortunately, no one knows in advance which half.',
		]
	},
	{
		author: 'Jennifer Shahade', title: 'WGM',
		quotes: [
			'Chess can learn a lot from poker. First, chess media and sponsors should emphasize its glamorous aspects: worldwide traveling, parties and escape from real world responsibilities.',
			'Chess is not relaxing; it’s stressful even if you win.',
		]
	},
	{
		author: 'Jeremy Silman', title: 'IM',
		quotes: [
			'If your opponent cannot do anything active, then don’t rush the position; instead you should let him sit there, suffer, and beg you for a draw.',
			'Fischer, who may or may not be mad as a hatter, has every right to be horrified.',
		]
	},
	{
		author: 'Johann Wolfgang von Goethe',
		quotes: [
			'Daring ideas are like chess men moved forward. They may be beaten, but they may start a winning game.',
			'Chess is the touchstone of intellect.',
		]
	},
	{
		author: 'John Bartholomew', title: 'IM',
		quotes: [
			'`1. e4` is the move you play when you’re young, naive, and believe the world owes you something. Open positions, infinite horizons - what’s not to love? Well, I’ve got news for you, buddy: it’s a cruel chess board out there.',
		]
	},
	{
		author: 'John Chernoff',
		quotes: [
			'It’s one of those types of positions where he has pieces on squares.',
			'On the bright side, I no longer have any more pieces to lose.',
			'Tactics… Tactics are your friends. But they are weird friends who do strange things.',
			'You can’t take the pawn because then the other will queen. Like wonder twin powers',
		]
	},
	{
		author: 'John van der Wiel', title: 'GM',
		quotes: [
			'When you absolutely don’t know what to do anymore, it is time to panic.',
		]
	},
	{
		author: 'José Raúl Capablanca', title: 'WCC',
		quotes: [
			'Excellent! I will still be in time for the ballet! (upon defeating Ossip Bernstein in the famous 29 move exhibition game played in Moscow in 1914).',
			'In order to improve your game, you must study the endgame before everything else, for whereas the endings can be studied and mastered by themselves, the middlegame and the opening must be studied in relation to the endgame.',
			'Chess books should be used as we use glasses: to assist the sight, although some players make use of them as if they thought they conferred sight.',
			'You may learn much more from a game you lose than from a game you win. You will have to lose hundreds of games before becoming a good player.',
			'A good player is always lucky.',
			'A passed pawn increases in strength as the number of pieces on the board diminishes.',
			'As one by one I mowed them down, my superiority soon became apparent.',
			'Although the Knight is generally considered to be on a par with the Bishop in strength, the latter piece is somewhat stronger in the majority of cases in which they are opposed to each other.',
			'Chess can never reach its height by following in the path of science… Let us, therefore, make a new effort and with the help of our imagination turn the struggle of technique into a battle of ideas.',
			'Chess is something more than a game. It is an intellectual diversion which has certain artistic qualities and many scientific elements.',
			'Endings of one rook and pawns are about the most common sort of endings arising on the chess board. Yet though they do occur so often, few have mastered them thoroughly. They are often of a very difficult nature, and sometimes while apparently very simple they are in reality extremely intricate.',
		]
	},
	{
		author: 'Judit Polgár', title: 'WGM',
		quotes: [
			'Chess is thirty to forty percent psychology. You don’t have this when you play a computer. I can’t confuse it.',
		]
	},
	{
		author: 'King Khosrow II',
		quotes: [
			'If a ruler does not understand chess, how can he rule over a kingdom?',
		]
	},
	{
		author: 'King Louis VI',
		quotes: [
			'Begone! Ignorant and impudent knight, not even in chess can a King be taken.',
		]
	},
	{
		author: 'Kurt Richter', title: 'IM',
		quotes: [
			'What would chess be without silly mistakes?',
		]
	},
	{
		author: 'Larry Evans', title: 'GM',
		quotes: [
			'Fischer is the strongest player in the world. In fact, the strongest player who ever lived.',
			'Fischer wanted to give the Russians a taste of their own medicine.',
		]
	},
	{
		author: 'Laszlo Hazai', title: 'IM',
		quotes: [
			'Do not pick a move from a list of computer lines - use your own brains. This is important, especially for young players. It’s better to study a worse line well than to reproduce a better computer line.',
		]
	},
	{
		author: 'Leonid Shamkovich', title: 'GM',
		quotes: [
			'A great chess player always has a very good memory.',
			'A real sacrifice involves a radical change in the character of a game which cannot be effected without foresight, fantasy, and the willingness to risk.',
		]
	},
	{
		author: 'Lev Polugaevsky', title: 'GM',
		quotes: [
			'Analysis is a glittering opportunity for training: it is just here that capacity for work, perseverance and stamina are cultivated, and these qualities are, in truth, as necessary to a chess player as a marathon runner.',
			'Analysis, if it is really carried out with a complete concentration of his powers, forms and completes a chess player.',
			'First and foremost it is essential to understand the essence, the overall idea of any fashionable variation, and only then include it in one’s repertoire. Otherwise the tactical trees will conceal from the player the strategic picture of the wood, in which his orientation will most likely be lost.',
		]
	},
	{
		author: 'Levon Aronian', title: 'GM',
		quotes: [
			'As a chess player one has to be able to control one’s feelings, one has to be as cold as a machine.',
			'Chess programs are our enemies, they destroy the romance of chess. They take away the beauty of the game. Everything can be calculated.',
		]
	},
	{
		author: 'Lisa Lane', title: 'USWCC',
		quotes: [
			'There’s never before been a chess player with such a thorough knowledge of the intricacies of the game and such an absolutely indomitable will to win. I think Bobby is the greatest player that ever lived.',
		]
	},
	{
		author: 'Lodewijk Prins', title: 'OGM',
		quotes: [
			'The only thing chess players have in common is chess.',
		]
	},
	{
		author: 'Lubomir Kavalek', title: 'GM',
		quotes: [
			'(On Bent Larsen) He played with enormous energy and great fighting spirit. Offering him a draw was a waste of time. He would decline it politely, but firmly. “No, thank you” he would say and the fight would go on and on and on.',
		]
	},
	{
		author: 'Luke McShane', title: 'GM',
		quotes: [
			'Chess is a game sufficiently rich in meaning that it is easily capable of containing elements of both tragedy and comedy.',
		]
	},
	{
		author: 'Magnus Carlsen', title: 'GM',
		quotes: [
			'Some people think that if their opponent plays a beautiful game, it’s okay to lose. I don’t. You have to be merciless.',
			'Contrary to many young colleagues I do believe that it makes sense to study the classics.',
			'For me right now I think being the world number one is a bigger deal than being the world champion because I think it shows better who plays the best chess. That sounds self-serving but I think it’s also right. (2012)',
			'I am trying to beat the guy sitting across from me and trying to choose the moves that are most unpleasant for him and his style.',
			'I can’t count the times I have lagged seemingly hopelessly far behind, and nobody except myself thinks I can win. But I have pulled myself in from desperate [situations]. When you are behind there are two strategies – counter-attack or all men to the defences. I’m good at finding the right balance between those.',
			'Be well enough prepared that preparation won’t play a role.',
			'You’ll be amazed at the people I’ve lost to while playing online.',
			'[…], even extremely intoxicated my chess strength and knowledge is still in my bones.',
			'I don’t play unorthodox openings. I prefer to give mainstream openings my own spin.',
			'Playing long games online just takes too much time. It’s fun to play blitz once in a while, where you can rely more on your intuition, your instincts rather than pure calculation and analysis.',
			'I don’t berserk, I am not a caveman',
		]
	},
	{
		author: 'Mark Dvoretsky', title: 'IM',
		quotes: [
			'As a rule, pawn endings have a forced character, and they can be worked out conclusively.',
			'Emotional instability can be one of the factors giving rise to a failure by chess players in important duels. Under the influence of surging emotions (and not necessarily negative ones) we sometimes lose concentration and stop objectively evaluating the events that are taking place on the board.',
		]
	},
	{
		author: 'Mark Taimanov', title: 'GM',
		quotes: [
			'Fortunately I’ve got a weak character, so I never did decide to dedicate myself to only one of my professions. And I’m very glad. After all, if I’d rejected chess or music then my life wouldn’t have been two times, but a hundred times less interesting.',
		]
	},
	{
		author: 'Maurice Ashley', title: 'GM',
		quotes: [
			'Look at Garry Kasparov. After he loses, invariably he wins the next game. He just kills the next guy. That’s something that we have to learn to be able to do.',
		]
	},
	{
		author: 'Max Euwe', title: 'GM',
		quotes: [
			'Whoever sees no other aim in the game than that of giving checkmate to one’s opponent will never become a good chess player.',
			'Strategy requires thought, tactics require observation.',
			'Alekhine is a poet who creates a work of art out of something that would hardly inspire another man to send home a picture post card.',
			'Capablanca did not apply himself to opening theory (in which he never therefore achieved much), but delved deeply into the study of end-games and other simple positions which respond to technique rather than to imagination.',
		]
	},
	{
		author: 'Michael Basman', title: 'IM',
		quotes: [
			'Chess will always be in the doldrums as a spectator sport while a draw is given equal mathematical value as a decisive result.',
		]
	},
	{
		author: 'Michael Stean', title: 'GM',
		quotes: [
			'The most important feature of the chess position is the activity of the pieces. This is absolutely fundamental in all phases of the game: Opening, Middlegame and especially Endgame. The primary constraint on a piece’s activity is the pawn structure.',
		]
	},
	{
		author: 'Mig Greengard',
		quotes: [
			'Fischer is an American chess tragedy on par with Morphy and Pillsbury.',
		]
	},
	{
		author: 'Miguel Najdorf', title: 'GM',
		quotes: [
			'Bobby just drops the pieces and they fall on the right squares.',
			'I won’t play with you anymore. You have insulted my friend! --when an opponent cursed himself for a blunder.',
			'Fischer prefers to enter chess history alone.',
			'But you see when I play a game of Bobby, there is no style. Bobby played perfectly. And perfection has no style.',
		]
	},
	{
		author: 'Mikhail Botvinnik', title: 'GM',
		quotes: [
			'Don’t worry kids, you’ll find work. After all, my machine will need strong chess player-programmers. You will be the first.',
			'Chess is no whit inferior to the violin, and we have a large number of professional violinists.',
			'Chess is the art of analysis.',
			'Chess is the art which expresses the science of logic.',
			'The boy (then a 12 year old boy named Anatoly Karpov) doesn’t have a clue about chess, and there’s no future at all for him in this profession.',
			'Chess mastery essentially consists of analyzing.',
			'Chess is a part of culture and if a culture is declining then chess too will decline.',
			'Chess, like any creative activity, can exist only through the combined efforts of those who have creative talent, and those who have the ability to organize their creative work.',
			'Everything is in a state of flux, and this includes the world of chess.',
			'Suddenly it was obvious to me in my analysis I had missed what Fischer had found with the greatest of ease at the board.',
			'A knight ending is really a pawn ending.',
			'Above all else, before playing in competitions a player must have regard to his health, for if he is suffering from ill-health he cannot hope for success. In this connection the best of all tonics is 15 to 20 days in the fresh air, in the country.',
			'Along with my retirement from chess analytical work seems to have gone too.',
			'Before Geller we did not understand the King’s Indian Defence.',
			'Every great master will find it useful to have his own theory on the openings, which only he himself knows, a theory which is closely linked with plans for the middle game.',
			'I… have two vocations: chess and engineering. If I played chess only, I believe that my success would not have been significantly greater. I can play chess well only when I have fully convalesced from chess and when the “hunger for chess” once more awakens within me.',
			'I claim that nothing else is so effective in encouraging the growth of chess strength as such independent analysis, both of the games of the great players and your own.',
		]
	},
	{
		author: 'Mikhail Tal', title: 'GM',
		quotes: [
			'Later, I began to succeed in decisive games. Perhaps because I realized a very simple truth: not only was I worried, but also my opponent.',
			'Some sacrifices are sound; the rest are mine.',
			'There are two types of sacrifices: correct ones and mine.',
			'You must take your opponent into a deep dark forest where 2+2=5, and the path leading out is only wide enough for one.',
			'It is difficult to play against Einstein’s theory (on his first loss to Fischer).',
			'When I asked Fischer why he had not played a certain move in our game, he replied: “Well, you laughed when I wrote it down!”',
			'Many chess players were surprised when after the game, Fischer quietly explained: “I had already analyzed this possibility” in a position which I thought was not possible to foresee from the opening.',
			'As long as my opponent has not yet castled, on each move I seek a pretext for an offensive. Even when I realize that the king is not in danger.',
			'Fischer is Fischer, but a knight is a knight!',
			'For pleasure you can read the games collections of Andersson and Chigorin, but for benefit you should study Tarrasch, Keres and Bronstein.',
			'I am both sad and pleased that in his last tournament, Rashid Gibiatovich came to my home in Latvia. He did not take first place, but the prize for beauty, as always, he took with him. Players die, tournaments are forgotten, but the works of great artists are left behind them to live on forever. (on Nezhmetdinov)',
			'I believe most definitely that one must not only grapple with the problems on the board, one must also make every effort to combat the thoughts and will of the opponent.',
		]
	},
	{
		author: 'Moses Mendelssohn',
		quotes: [
			'Chess as a game is too serious; as a serious pursuit too frivolous.',
			'For a game it is too serious, for seriousness too much of a game.',
		]
	},
	{
		author: 'Nigel Short', title: 'GM',
		quotes: [
			'Modern chess is too much concerned with things like pawn structure. Forget it, checkmate ends the game.',
			'Chess is ruthless; you’ve got to be prepared to kill people.',
			'If your opponent offers you a draw, try to work out why he thinks he’s worse off.',
			'Chess is, in essence, a game for children. Computers have exacerbated the trends towards youth because they now have an immensely powerful tool at their disposal and can absorb vast amounts of information extremely quickly.',
			'I am acutely conscious, from vast experience in opens, that guys around, say 2100 or more can definitely play chess and that one often has to work very hard to beat them.',
			'I cannot claim to thoroughly enjoy coaching, because it is very hard work if you are even moderately conscientious. Nevertheless it does provide a degree of satisfaction, not to mention a steady income, which is why I do it occasionally.',
		]
	},
	{
		author: 'Oleg Romanishin', title: 'GM',
		quotes: [
			'A win gives one a feeling of self-affirmation, and success; a feeling of self-expression, but only a sensible harmonization between these urges can bring really great achievements in chess.',
		]
	},
	{
		author: 'Pal Benko', title: 'GM',
		quotes: [
			'According to such great attacking players as Bronstein and Tal, most combinations are inspired by the player’s memories of earlier games.',
			'Agreeing to draws in the middlegame, equal or otherwise, deprives you of the opportunity to practice playing endgames, and the endgame is probably where you need the most practice.',
			'Errors have nothing to do with luck; they are caused by time pressure, discomfort or unfamiliarity with a position, distractions, feelings of intimidation, nervous tension, over-ambition, excessive caution, and dozens of other psychological factors.',
			'I always urge players to study composed problems and endgames.',
		]
	},
	{
		author: 'Paul Keres', title: 'GM',
		quotes: [
			'The older I grow, the more I value pawns.',
			'In complicated positions, Bobby Fischer hardly had to be afraid of anybody.',
			'A player can sometimes afford the luxury of an inaccurate move, or even a definite error, in the opening or middlegame without necessarily obtaining a lost position. In the endgame… an error can be decisive, and we are rarely presented with a second chance.',
			'An innovation need not be especially ingenious, but it must be well worked out.',
			'Chess is a test of wills.',
			'Even the best grandmasters in the world have had to work hard to acquire the technique of rook endings.',
			'However hopeless the situation appears to be there yet always exists the possibility of putting up a stubborn resistance.',
		]
	},
	{
		author: 'Paul Morphy', title: 'M',
		quotes: [
			'Help your pieces so they can help you.',
			'Chess is eminently and emphatically the philosopher’s game.',
		]
	},
	{
		author: 'Peter Leko', title: 'GM',
		quotes: [
			'My favorite victory is when it is not even clear where my opponent made a mistake.',
		]
	},
	{
		author: 'Peter Svidler', title: 'GM',
		quotes: [
			'The biggest tool for chess improvement would be playing against stronger opposition',
		]
	},
	{
		author: 'Reuben Fine', title: 'GM',
		quotes: [
			'Combinations have always been the most intriguing aspect of chess. The masters look for them, the public applauds them, the critics praise them. It is because combinations are possible that chess is more than a lifeless mathematical exercise. They are the poetry of the game; they are to chess what melody is to music. They represent the triumph of mind over matter.',
			'Discovered check is the dive bomber of the chessboard.',
			'I’d rather have a pawn than a finger.',
			'A plan is made for a few moves only, not for the whole game.',
			'Chess is a contest between two men which lends itself particularly to the conflicts surrounding aggression.',
		]
	},
	{
		author: 'Richard Réti',
		quotes: [
			'It is the aim of the modern school, not to treat every position according to one general law, but according to the principle inherent in the position.',
			'Chess is a fighting game which is purely intellectual and includes chance.',
			'Chess was Capablanca’s mother tongue.',
			'The scheme of a game is played on positional lines; the decision of it, as a rule, is effected by combinations.',
		]
	},
	{
		author: 'Robert Hübner', title: 'GM',
		quotes: [
			'Those who say they understand chess, understand nothing.',
			'Chess is thriving. There are ever less round robin tournaments and ever more World Champions.',
		]
	},
	{
		author: 'Rudolf Spielmann',
		quotes: [
			'A good sacrifice is one that is not necessarily sound but leaves your opponent dazed and confused.',
			'We cannot resist the fascination of sacrifice, since a passion for sacrifices is part of a chess player’s nature.',
			'Play the opening like a book, the middlegame like a magician, and the endgame like a machine.',
		]
	},
	{
		author: 'Salo Flohr', title: 'GM',
		quotes: [
			'Chess, like love, is infectious at any age.',
		]
	},
	{
		author: 'Samuel Reshevsky', title: 'GM',
		quotes: [
			'My style is somewhere between that of Tal and Petrosian.',
			'Good players develop a tactical instinct, a sense of what is possible or likely and what is not worth calculating.',
		]
	},
	{
		author: 'Samuel Standige Boden', title: 'M',
		quotes: [
			'In a gambit you give up a pawn for the sake of getting a lost game.',
		]
	},
	{
		author: 'Saudin Robovic', title: 'IM',
		quotes: [
			'Chess opens and enriches your mind.',
			'Chess is a terrific way for kids to build self image and self esteem.',
			'Becoming successful at chess allows you to discover your own personality. That’s what I want for the kids I teach.',
		]
	},
	{
		author: 'Savielly Tartakower', title: 'GM',
		quotes: [
			'Chess is a fairy tale of 1001 blunders.',
			'The winner of the game is the player who makes the next-to-last mistake.',
			'Some part of a mistake is always correct.',
			'The mistakes are there, waiting to be made.',
			'No one ever won a game by resigning.',
			'It’s always better to sacrifice your opponent’s men.',
			'To avoid losing a piece, many a person has lost the game.',
			'A chess game is divided into three stages: the first, when you hope you have the advantage, the second when you believe you have an advantage, and the third… when you know you’re going to lose!',
			'The blunders are all there on the board, waiting to be made.',
			'The tactician must know what to do whenever something needs doing; the strategist must know what to do when nothing needs doing.',
			'All chess players should have a hobby.',
			'It is always better to sacrifice your opponent’s men.',
			'The move is there, but you must see it.',
			'If chess is an art, Alekhine. If chess is a science, Capablanca. If chess is a struggle, Lasker (on who he thought was the best player).',
			'A Chess game is divided into three stages: the first, when you hope you have the advantage, the second when you believe that you have an advantage, and the third… when you know you’re going to lose !',
			'A Queen’s sacrifice, even when fairly obvious, always rejoices the heart of the chess-lover.',
			'A draw can be obtained not only by repeating moves, but also by one weak move.',
			'An isolated pawn spreads gloom all over the chessboard.',
			'Drawn games are sometimes more scintillating than any conclusive contest.',
		]
	},
	{
		author: 'Siegbert Tarrasch',
		quotes: [
			'Many have become chess masters, no one has become the master of chess.',
			'Before the endgame, the Gods have placed the middle game.',
			'One doesn’t have to play well, it’s enough to play better than your opponent.',
			'He who fears an isolated queen’s pawn should give up chess.',
			'It is not enough to be a good player… you must also play well.',
			'Chess, like love, like music, has the power to make people happy.',
			'A thorough understanding of the typical mating continuations makes the most complicated sacrificial combinations leading up to them not only not difficult, but almost a matter of course.',
			'Chess is a terrible game. If you have no center, your opponent has a freer position. If you do have a center, then you really have something to worry about!',
			'Mistrust is the most necessary characteristic of the chess player.',
			'What is the object of playing a gambit opening?… To acquire a reputation of being a dashing player at the cost of losing a game.',
			'One of these modest little moves may be more embarrassing to your opponent than the biggest threat.',
			'I look one move ahead… the best!',
			'When you don’t know what to play, wait for an idea to come into your opponent’s mind. You may be sure that idea will be wrong.',
			'Chess is a terrible game. If you have no center, your opponent has a freer position. If you do have a center, then you really have something to worry about!',
			'A thorough understanding of the typical mating continuations makes the most complicated sacrificial combinations leading up to them not only not difficult, but almost a matter of course.',
			'First-class players lose to second-class players because second-class players sometimes play a first-class game.',
			'Weak points or holes in the opponent’s position must be occupied by pieces not pawns.',
			'Up to this point white has been following well-known analysis. But now he makes a fatal error: he begins to use his own head.',
			'White lost because he failed to remember the right continuation and had to think up the moves himself.',
			'I have always a slight feeling of pity for the man who has no knowledge of chess.',
			'I had a toothache during the first game. In the second game I had a headache. In the third game it was an attack of rheumatism. In the fourth game, I wasn’t feeling well. And in the fifth game? Well, must one have to win every game?',
			'All lines of play which lead to the imprisonment of the bishop are on principle to be condemned. (on the closed Ruy Lopez)',
			'As Rousseau could not compose without his cat beside him, so I cannot play chess without my king’s bishop. In its absence the game to me is lifeless and void. The vitalizing factor is missing, and I can devise no plan of attack.',
			'Every move creates a weakness.',
			'First-class players lose to second-class players because second-class players sometimes play a first-class game.',
		]
	},
	{
		author: 'Simon Williams', title: 'GM',
		quotes: [
			'Come on Harry!',
		]
	},
	{
		author: 'Sir John Simon',
		quotes: [
			'Chess is a cold bath for the mind.',
		]
	},
	{
		author: 'Stanley Kubrick',
		quotes: [
			'You sit at the board and suddenly your heart leaps. Your hand trembles to pick up the piece and move it. But what chess teaches you is that you must sit there calmly and think about whether it’s really a good idea and whether there are other better ideas.',
			'Chess teaches you to control the initial excitement you feel when you see something that looks good and it trains you to think objectively when you’re in trouble.',
		]
	},
	{
		author: 'Susan Polgár', title: 'WGM',
		quotes: [
			'Win with grace, lose with dignity.',
			'Chess can help a child develop logical thinking, decision making, reasoning, and pattern recognition skills, which in turn can help math and verbal skills.',
			'Chess is a miniature version of life. To be successful, you need to be disciplined, assess resources, consider responsible choices and adjust when circumstances change.',
			'I believe that the best style is a universal one, tactical and positional at the same time…',
		]
	},
	{
		author: 'Terry Pratchett',
		quotes: [
			'Most of the gods throw dice but Fate plays chess, and you don’t find out until too late that he’s been using two queens all along.',
		]
	},
	{
		author: 'Tigran Petrosian', title: 'GM',
		quotes: [
			'Even the most distinguished players have in their careers experienced severe disappointments due to ignorance of the best lines or suspension of their own common sense.',
		]
	},
	{
		author: 'Anthony Santasiere', title: 'FM',
		quotes: [
			'Condemned by theory, the Allgaier, certainly one of the most romantic of gambits, is generally successful in practice (and yet so rarely played). Why does the defender often seem hypnotized, quite demoralized?',
		]
	},
	{
		author: 'Ulf Andersson', title: 'GM',
		quotes: [
			'Black’s `d5` square is too weak (on the Dragon variation).',
		]
	},
	{
		author: 'Vasilios Kotronias', title: 'GM',
		quotes: [
			'Be a harsh critic of your own wins.',
		]
	},
	{
		author: 'Vasily Smyslov', title: 'GM',
		quotes: [
			'A considerable role in the forming of my style was played by an early attraction to study composition.',
			'Despite the development of chess theory, there is much that remains secret and unexplored in chess.',
		]
	},
	{
		author: 'Viktor Korchnoi', title: 'GM',
		quotes: [
			'No chess Grandmaster is normal; they only differ in the extent of their madness.',
			'I don’t study; I create.',
			'As a rule, the more mistakes there are in a game, the more memorable it remains, because you have suffered and worried over each mistake at the board.',
			'Chess is my life.',
			'During the analysis, I discovered something very remarkable: the board is simply too small for two Queens of the same color. They only get in each other’s way. I realize that this might sound stupid, but I fully mean it. The advantage is much less than one would expect by counting material.',
		]
	},
	{
		author: 'Viswanathan Anand', title: 'GM',
		quotes: [
			'Nowadays, when you’re not a Grandmaster at 14, you can forget about it.',
			'In chess, knowledge is a very transient thing. It changes so fast that even a single mouse-slip sometimes changes the evaluation.',
			'Chess is like a language, the top players are very fluent at it. Talent can be developed scientifically but you have to find first what you are good at.',
			'Confidence is very important; even pretending to be confident. If you make a mistake but do not let your opponent see what you are thinking then he may overlook the mistake.',
			'For every door the computers have closed they have opened a new one.',
			'For me, chess is not a profession, it is a way of life, a passion. People may feel that I have conquered the peak and will not have to struggle. Financially, perhaps that is true; but as far as chess goes, I’m still learning a lot!',
		]
	},
	{
		author: 'Vladimir Kramnik', title: 'GM',
		quotes: [
			'Chess is an infinitely complex game, which one can play in infinitely numerous and varied ways.',
			'Chess is like body-building. If you train every day, you stay in top shape. It is the same with your brain: chess is a matter of daily training.',
			'Every month I look through some ten thousand games, so not as to miss any new ideas and trends.',
		]
	},
	{
		author: 'Vladimir Lenin',
		quotes: [
			'Chess is only a recreation and not an occupation.',
		]
	},
	{
		author: 'Vladimir Nabokov',
		quotes: [
			'Of all my Russian books, The Defense contains and diffuses the greatest ’warmth’ which may seem odd seeing how supremely abstract chess is supposed to be.',
			'Chess problems demand from the composer the same virtues that characterize all worthwhile art: originality, invention, conciseness, harmony, complexity, and splendid insincerity.',
		]
	},
	{
		author: 'Vlastimil Hort', title: 'GM',
		quotes: [
			'I believe that chess possesses a magic that is also a help in advanced age. A rheumatic knee is forgotten during a game of chess and other events can seem quite unimportant in comparison with a catastrophe on the chessboard.',
			'In blitz, the Knight is stronger than the Bishop.',
		]
	},
	{
		author: 'Voltaire',
		quotes: [
			'Chess is a game which reflects most honor on human wit.',
		]
	},
	{
		author: 'Walter Browne', title: 'GM',
		quotes: [
			'Chess is a natural cerebral high.',
		]
	},
	{
		author: 'Walter Shipman',
		quotes: [
			'It began to feel as though you were playing against chess itself (on playing against Robert Fischer).',
		]
	},
	{
		author: 'Wilhelm Steinitz', title: 'WCC',
		quotes: [
			'A win by an unsound combination, however showy, fills me with artistic horror.',
			'Only the player with the initiative has the right to attack.',
			'A sacrifice is best refuted by accepting it.',
			'Chess is so inspiring that I do not believe a good player is capable of having an evil thought during the game.',
			'I have never in my life played the French Defence, which is the dullest of all openings.',
			'The king is a fighting piece. Use it!',
			'Chess is not for the faint-hearted; it absorbs a person entirely. To get to the bottom of this game, he has to give himself up into slavery. Chess is difficult, it demands work, serious reflection and zealous research.',
			'Capture of the adverse king is the ultimate but not the first object of the game.',
		]
	},
	{
		author: 'William Ewart Napier', title: 'M',
		quotes: [
			'Of chess it has been said that life is not long enough for it, but that is the fault of life, not chess.',
		]
	},
	{
		author: 'Yasser Seirawan', title: 'GM',
		quotes: [
			'Though most people love to look at the games of the great attacking masters, some of the most successful players in history have been the quiet positional players. They slowly grind you down by taking away your space, tying up your pieces, and leaving you with virtually nothing to do!',
			'Let the perfectionist play postal.',
			'Bobby is the most misunderstood, misquoted celebrity walking the face of this earth.',
			'How come the little things bother you when you are in a bad position? They don’t bother you in good positions.',
		]
	},
	{
		author: 'Yefim Geller', title: 'GM',
		quotes: [
			'From time to time, like many other players, I glance through my own games of earlier years, and return to positions and variations which have gone out of practice. I attempt to restore them, to find new ideas and plans.',
		]
	},
	{
		author: 'Yuri Balashov', title: 'GM',
		quotes: [
			'Do you realize Fischer almost never has any bad pieces? He exchanges them, and the bad pieces remain with his opponents.',
		]
	},
	{
		author: 'Zita Rajcsanyi',
		quotes: [
			'(Fischer’s girlfriend) Fischer is completely natural. He plays no roles. He’s like a child. Very, very simple.',
		]
	},
];
