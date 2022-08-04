
export class lichess {

	static org = {

		profile: async user => {
			user = encodeURIComponent(user);
			const url = 'https://lichess.org/api/user/';
			try {
				const response = await fetch(url + user);
				if (response.status != 200) return null;
				return await response.json();
			} catch { return null; }
		},

		ratings: async user => {
			const categories = [ 'classical', 'rapid', 'blitz', 'bullet' ];
			const ratings = [];
			const l = await lichess.org.profile(user);
			if (l == null || l.perfs == undefined) return undefined;
			for (const category of categories) {
				if (l.perfs[category] == undefined ||
					l.perfs[category].rating == undefined) continue;
				const rating = { category, rating: 'unrated' };
				if (!isNaN(parseInt(l.perfs[category].rating)))
					rating.rating = l.perfs[category].rating;
				ratings.push(rating);
			}
			return ratings;
		}

	}

}
