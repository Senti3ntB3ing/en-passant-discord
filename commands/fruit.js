
import { Roles } from '../config.js';
import { createCommand, card, error } from '../parser.js';

import { closest, levenshtein } from '../components/levenshtein.js';

const fruits = [
	{
		name: 'Strawberry', emoji: '🍓', color: 0xD81420,
		facts: [
			'The Romans used strawberries for a long list of medical remedies.',
			'The average Strawberry has around 200 seeds.',
			'Strawberries are the only fruit with their seeds on the outside.',
			'Despite their name, Strawberries aren’t technically berries, they’re accessory fruits.',
			'Native Americans were also among the earliest people to eat strawberries.',
		]
	},
	{
		name: 'Peach', emoji: '🍑', color: 0xF17640,
		facts: [
			'Almonds are a member of the Peach family.',
			'Peaches are a member of the rose family.',
			'Ripe Peaches taste best when eaten at room temperature.',
			'Nectarines are just Peaches without the fuzz.',
			'There are over 700 varieties of Peaches.',
			'Romans believed that peaches originated from Persia.',
			'The first fruit will appear on the peach tree only after 3 years.',
		]
	},
	{
		name: 'Pear', emoji: '🍐', color: 0xA8AA3E,
		facts: [
			'Most of the vitamin C in Pears is found in the skin of the fruit.',
			'Pear trees are able to withstand temperatures as low as -40 ° C.',
			'Pears were important part of diet in ancient Greece and remedy for nausea.',
			'Pear starts to produce fruit 4 years after planting.',
			'They were given the nickname “Butter Fruit” in the 1700s because of their buttery texture.',
			'There are over 3000 varieties of Pears grown around the world.',
			'Many varieties of Pears, such as the Nashi Pear, are not pear-shaped.',
		]
	},
	{
		name: 'Mango', emoji: '🥭', color: 0xDD6C00,
		facts: [
			'Mangoes contain more vitamin C than oranges.',
			'More fresh Mangoes are eaten every day than any other fruit in the world.',
			'Mangoes can be ripened quickly by being placed in a paper bag with a ripe Banana.',
			'Mangos are related to Cashews and Pistachios.',
			'The bark, leaves, skin and pit of the Mango have been used in folk remedies for centuries.',
			'A basket of Mangos is considered a gesture of friendship in India.',
			'Mangos were first grown in India over 5,000 years ago.',
		]
	},
	{
		name: 'Kiwi', emoji: '🥝', color: 0xB0C92C,
		facts: [
			'Kiwis contain actinidin which can be used to tenderise meat.',
			'Kiwis are declared the national fruit of China.',
			'Kiwi Fruit was originally known by its Chinese name, yang tao (Sunny Peach).',
			'Eating 2 Kiwis an hour before bedtime will help you fall asleep quicker.',
			'Kiwi Fruit was named after its uncanny resemblance to the fuzzy brown Kiwi bird.',
			'Kiwi Fruit can produce fruits up to 30 years and to survive more than 50 years.',
			'Over 1 million tons of Kiwis are produced each year.',
			'The fuzzy skin of the Kiwi Fruit is edible and is actually nutritious.',
		]
	},
	{
		name: 'Coconut', emoji: '🥥', color: 0x7E4F2D,
		facts: [
			'In some parts of the world, trained monkeys are used to harvest Coconuts.',
			'Falling Coconuts kill 150 people every year, 10 times the number of people killed by sharks.',
			'In Kerala in south India, Coconut flowers must be present at a wedding.',
			'Over 20 billion Coconuts are harvested each year.',
			'2/3 of the world’s Coconuts are produced in Hawaii.',
			'The Coconut palm is sometimes called the tree of life.',
			'Technically the Coconut is a Drupe not a Nut.',
			'Coconut water was used in WW2 as a substitute for blood plasma in transfusions.',
		]
	},
	{
		name: 'Pineapple', emoji: '🍍', color: 0x7E4F2D,
		facts: [
			'Pineapples were once very rare. Thus the name “King of Fruits”.',
			'Pineapples contain bromelain, which is used to stop cold beer from going cloudy.',
			'Unripe Pineapples are toxic.',
			'The Pineapple is not a single fruit, but a cluster of up to 200 fruitlets.',
			'1/3 of the world’s Pineapples are produced in Hawaii.',
			'One Pineapple plant can produce one pineapple at a time.',
			'Pineapples ripen faster upside down.',
			'Pineapples regenerate! You can plant Pineapple leaves to grow a new plant.',
		]
	},
	{
		name: 'Passion Fruit', emoji: '♥️', color: 0xD82023,
		facts: [
			'The Passion Fruit flower is the national flower of Paraguay.',
			'Passion Fruits were first grown in Brazil.',
			'Passion Fruit is sweetest when slightly wrinkled.',
			'The purple-fruited species of Passion Fruit self-fertilizes.',
		]
	},
	{
		name: 'Lemon', emoji: '🍋', color: 0xFBD338,
		facts: [
			'Lemons contain more sugar than strawberries.',
			'Mature Lemon trees produce between 1,000 and 2,000 fruits per year.',
			'Lemon and salt can be used to treat rust spots and clean copper pots.',
			'Add half a cup of Lemon juice to your laundry to brighten whites.',
			'If you warm a Lemon before squeezing, it will yield much more juice.',
			'Lemon is used in traditional Indian medicine (Ayurveda) and aromatherapy.',
			'Lemon tree can survive more than 100 years, but production of fruit ceases after 50 years.',
			'Mixture composed of warm water and Lemon juice is used as a remedy for sore throat.',
		]
	},
	{
		name: 'Lime', emoji: '🍋', color: 0xFBD338,
		facts: [
			'Leaving diluted Lime juice in a teapot overnight can clean the brown stains.',
			'Limes are free of fat, saturated fat, sodium, and cholesterol.',
			'Lime juice was fed to British sailors to prevent scurvy.',
			'Because of all the Lime juice they would drink, British seamen were called “Limeys”.',
			'A ripe Lime is yellow in colour not green.',
			'Concentrated Lime juice is so acidic it will dissolve concrete.',
			'Lime blooms and produces fruit all year round.',
			'India is the greatest manufacturer of Lime in the world.',
		]
	},
	{
		name: 'Banana', emoji: '🍌', color: 0xF3B800,
		facts: [
			'Expecting mothers can eat Bananas between meals to avoid morning sickness.',
			'Bananas can help fight depression, as they increase serotonin levels.',
			'Bananas contain B6, which regulates blood glucose levels and your mood.',
			'Rub the inside of a Banana peel on mosquito bites to stop the itching.',
			'The inside if a Banana peel can be used to polish leather shoes.',
			'Research shows that Bananas can assist learning.',
			'Bananas are high in the B-complex vitamins, which help calm the nervous system.',
			'Banana plants are not trees, they are giant herbs.',
		]
	},
	{
		name: 'Blackberry', emoji: '🫐', color: 0x040A2A,
		facts: [
			'Blackberries contain copper which is essential for bone metabolism.',
			'Blackberries only last for a few days once picked.',
			'The very dark color of Blackberries is determined by its antioxidant.',
			'Blackberries are also known as Thimbleberries, Dewberries, and Brambleberries.',
			'Batology is the scientific study of Blackberries.',
			'Blackberry fruit are red in color, rather than green, before they are ripe.',
		]
	},
	{
		name: 'Cherry', emoji: '🍒', color: 0xE8003C,
		facts: [
			'“Hanami” is an ancient Japanese tradition of viewing Cherry trees while they are in bloom 🌸.',
			'Around 2,000,000 tons of cherries are produced each year.',
			'Cherry tree can survive and produce fruit around 100 years.',
			'Cherry tree develops beautiful white flowers during the spring. ',
			'Cherries belong to the rose family.',
			'Cherries were part of the Roman soldiers’ rations.',
			'George Washington had never chopped down a Cherry tree.',
			'The word Cherry comes from the Turkish town of Cerasus.',
			'A typical Cherry tree produces 7000 Cherries.',
		]
	},
	{
		name: 'Pomegranate', emoji: '🍅', color: 0xD62A00,
		facts: [
			'Pomegranate comes from the latin pomum granatum and means Apple with many seeds.',
			'Pomegranates belong to the berry family.',
			'In Greek mythology the god Hades tricks Persephone into eating Pomegranate seeds.',
			'Pomegranates are classified as a Super Fruit.',
			'In early English, the Pomegranate was called the “Apple of Grenada”.',
			'In Greece it is traditional to break Pomegranates on the ground at weddings.',
			'Pomegranate trees can live for over 200 years.',
			'Ancient Egyptians were often buried with Pomegranates.',
			'There are over 760 varieties of Pomegranate.',
		]
	},
	{
		name: 'Avocado', emoji: '🥑', color: 0xF7F791,
		facts: [
			'Avocado is also known as “Alligator Pear” because of its pear like shape and rough skin.',
			'Avocado is often consumed raw because cooking changes its taste.',
			'Mexico is the greatest producer of Avocados that are available worldwide.',
			'Hass is the most popular and the most consumed type of Avocado.',
			'Avocado matures on the tree but ripens after falling to the ground.',
			'Avocado tree can survive over 100 years under appropriate climate conditions.',
		]
	},
	{
		name: 'Grapes', emoji: '🍇', color: 0xB30050,
		facts: [
			'Technically Grapes are a member of the group of berries.',
			'Best known varieties of Grapes are yellow, green, red or dark purple.',
			'It takes 2.5 pounds of grape for the production of one bottle of vine.',
			'Grapes contain 80% of water and high percent of dietary fibers.',
			'Grapes are a type of fruit that grow in clusters of 15 to 300.',
			'Grapes can be used for making wine, jam, juice, jelly, raisins and vinegar.',
			'Grapevine is perennial plant that can survive and produce fruit for centuries.',
		]
	},
	{
		name: 'Dragon Fruit', emoji: '🐲', color: 0xB30050,
		facts: [
			'The Dragon Fruit is also known as “Pitaya”, “Nanettika Fruit” and  Strawberry Pear.',
			'The cactus flower that produces Dragon Fruit survives only a single night.',
			'Pollination of the Dragon Fruit plant is done by nocturnal creatures, like moths and bats.',
			'The red fleshed variety of Dragon Fruit contains lycopene, an antioxidant found in tomatoes.',
			'The red flesh variety of the Dragon Fruit is purported to be sweeter.',
			'Dragon Fruit helps to excrete heavy metal toxins from the body.',
		]
	},
	{
		name: 'Tomato', emoji: '🍅', color: 0xC72200,
		facts: [
			'Tomato is harvested unripe to prevent rotting and to ensure longer shelf-life.',
			'Tomatoes in the wild are pollinated by insects such as halictid bee.',
			'Scientific name for Tomato is Lycopersicon Lycopersicum. It means “Wolf Peach”.',
			'Around 150 million of tons of Tomatoes are produced annually.',
			'There are more than 7500 tomato varieties grown around the world.',
			'Tomato juice is an excellent hangover remedy.',
			'The Tomato, is a relative of the deadly nightshade family of plants.',
			'Use under-ripe, green Tomatoes for making salad.',
		]
	},
	{
		name: 'Honeydew', emoji: '🍈', color: 0xD7D98B,
		facts: [
			'Egyptians regarded the Honeydew as sacred and it was only reserved for society’s elite.',
			'A less common type of Honeydew has an orange coloured flesh.',
			'Honeydew melons are very sweet due to their high content of natural sugars.',
			'Napoleon and Cleopatra VII used to like Honeydews.',
			'Honeydew melons are native to southern France and Algeria.',
		]
	},
	{
		name: 'Cantaloupe', emoji: '🍈', color: 0xD7D98B,
		facts: [
			'Cantaloupe cannot increase sugar content after the harvest.',
			'The Name Cantaloupe originates from the Italian town Cantalupo where it was cultivated.',
			'Cantaloupe is the most popular type of melon in the USA.',
			'An average sized Cantaloupe contains just 100 calories.',
			'The vine of the Cantaloupe naturally slips from the fruit when it’s harvest time.',
			'Cantaloupe and Pumpkins are members of the same family.',
			'When Cantaloupe is ripe it is possible to hear the seeds rattling inside.',
		]
	},
	{
		name: 'Watermelon', emoji: '🍉', color: 0x4F8917,
		facts: [
			'Tutankhamen had been buried with the seeds of Watermelons.',
			'Watermelon contains more than 92% of water, hence the name.',
			'In China and Japan Watermelon is a popular gift to bring a host.',
			'Over 1,200 varieties of Watermelon are grown worldwide.',
			'Every part of a Watermelon is edible, even the seeds and rinds.',
			'People eat an average 16 pounds of Watermelon every year.',
			'The first ever Watermelon harvest happened approximately 5,000 years ago.',
		]
	},
	{
		name: 'Grapefruit', emoji: '🍊', color: 0xFF7E00,
		facts: [
			'When the Grapefruit was found, it was firstly named the forbidden fruit.',
			'A grapefruit is made of 75% juice.',
			'Grapefruit extract, is used to protect wooden tools against mold.',
			'The name Grapefruit it’s due to the way it grows in bunches like grapes.',
			'The red Grapefruit is considered to be the healthiest variety.',
			'February is National Grapefruit Month.',
			'Fresh Grapefruit come in several colours including pink, red, white and golden.',
			'A single Grapefruit tree can produce more than 1,500 pounds of fruit.',
		]
	},
	{
		name: 'Mandarin Orange', emoji: '🍊', color: 0xFF7E00,
		facts: [
			'Mandarin Oranges are smaller than oranges and have skin that is easier to peel.',
			'Mandarin Oranges are believed to have originated in China.',
			'China is by far the major producer of Mandarin Oranges.',
			'Mandarin Oranges peel is used as an ingredient in liqueurs, soft drinks and ice creams.',
			'Mandarin Oranges are also known as Tangerines.',
		]
	},
	{
		name: 'Orange', emoji: '🍊', color: 0xFF7E00,
		facts: [
			'Orange is technically a type of berry.',
			'Orange trees were first grown in China.',
			'One Orange supplies a full days Vitamin C requirement.',
			'It is possible for more than one plant to grow from a single seed of Orange.',
			'Oranges were known as the fruits of the gods in Greek mythology.',
			'Red Oranges are a variety that grows only in Sicily, Italy.',
			'Navel Oranges get their name from the belly-button formation opposite the stem end.',
			'After chocolate and vanilla, Orange is the world’s favorite flavour.',
			'Christopher Columbus brought the first Orange to America in 1493.',
			'Only 1% of the Orange’s flowers will turn into one fruit.',
			'Navel Oranges are seedless and they can’t reproduce through pollination.',
		]
	},
	{
		name: 'Persimmon', emoji: '🍅', color: 0xEF6B22,
		facts: [
			'In Korean folklore the dried Persimmon has a reputation for scaring away tigers.',
			'There are about 2,000 varieties of Persimmons in the world.',
			'Persimmons belong to the berry family.',
			'It can take a Persimmon tree up to 7 years before it produces fruit.',
			'Solution made of crushed wild Persimmons and water is used as natural, homemade insect repellent.',
			'A Persimmon tree can survive up to 75 years in the wild.',
			'Before ripening, Persimmons usually have a "chalky" or bitter taste.',
		]
	},
	{
		name: 'Prickly Pear', emoji: '🌵', color: 0x930E79,
		facts: [
			'Prickly Pear is also known as “cactus fruit”, “cactus Fig” and “Indian Fig”.',
			'100 grams of Prickly Pears have only 14 calories.',
			'The Prickly Pear cactus secretes an oily fluid during full moons.',
			'There are several different varieties of Prickly Pear cactus each growing to different sizes.',
			'Prickly Pear cactus pads are used to reduce inflammation and help relieve stomach problems.',
			'Prickly Pear’s pads are fed to cows in order to add a sweet flavour to their milk in Northern Mexico.',
		]
	},
	{
		name: 'Star Fruit', emoji: '⭐️', color: 0xCEFE39,
		facts: [
			'Star Fruit is perennial plant that can survive around 40 years in the wild.',
			'Star Fruit is actually a type of berry that has a star like shape.',
			'Star Fruit has 5 longitudinal ridges, but it can grow as few as 4 or as many as 8.',
			'The entire Star Fruit is edible, including the slightly waxy skin.',
			'Ripe sweet type Star Fruits are sweet but they contain no more than 4% of sugar.',
			'The Star Fruit is also known as Carambola.',
			'Fruit and juice of starfruit facilitate elimination of excess water from the body.',
		]
	},
	{
		name: 'Miracle Fruit', emoji: '🌶', color: 0xF9313D,
		facts: [
			'Miracle Fruit are also known as sweet berries, miracle berries, “taamis” and “agbayuns”.',
			'The impact of the Miracle Fruit on one’s sense of taste lasts for around 30 minutes or longer.',
			'The Miracle Fruit causes sour foods (such as Lemons) subsequently consumed to taste sweet.',
			'In Japan, Miracle Fruit is popular among patients with diabetes and dieters.',
			'The Miracle Fruit itself has a low sugar content despite its sweet properties.',
		]
	},
	{
		name: 'Apple', emoji: '🍎', color: 0xF30014,
		facts: [
			'Research shows that Apples may reduce the risk of many kinds of cancer.',
			'2/3 of the fiber in Apples is found in the skin.',
			'The science of Apple growing is called pomology.',
			'Apple seeds are mildly poisonous, but not enough to be dangerous to humans.',
			'Apple trees are able to produce fruit for up to 100 years.',
			'It takes the energy from 50 leaves to produce one Apple.',
			'Only 1 in 5 Australians eats an Apple a day.',
			'The average person eats 65 Apples per year.',
			'25% of an Apple’s volume is air. That’s why they float.',
			'There are approximately 10,000 varieties of Apples grown around the world.',
			'Over 60 million tons of Apples are grown each year.',
			'Apples have almost 5 times the antioxidant capacity of Bananas.',
		]
	}
];

createCommand({
	name: 'fruit', emoji: '🍏',
	aliases: [ 'fruits' ],
	description: 'Random fruit facts and characteristics.',
	permissions: Roles.everyone,
	execute: message => {
		const argument = message.content.replace(/^(.*?)\s+/g, '');
		let fruit = fruits[Math.floor(Math.random() * fruits.length)];
		if (argument != message.content) {
			fruit = fruits.find(fruit => fruit.name.toLowerCase() == argument.toLowerCase());
			if (!fruit) {
				const closestFruit = closest(argument, fruits.map(fruit => fruit.name));
				const distance = levenshtein(argument, closestFruit);
				return error(
					'Fruit Facts',
					`Could not find any fruit facts for \`${argument}\`!` +
					(distance < 3 ? `\nDid you mean \`${closestFruit}\` instead?` : '')
				);
			}

		}
		const fact = fruit.facts[Math.floor(Math.random() * fruit.facts.length)];
		return card(`Fruit Facts - ${fruit.emoji} **${fruit.name}**`, fact, fruit.color);
	}
});
