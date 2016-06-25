
function capFirstChar(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function handle_scatter_data(data) {
	  // change string (from CSV) into number format
	  data.forEach(function(d) {
		d.y = +d.y;
		d.x = +d.x;
		d.positive = +d.positive;
		d.negative = +d.negative;
		d.anger_emolex = +d.anger_emolex;
		d.anticipation = +d.anticipation;
		d.disgust = +d.disgust;
		d.fear = +d.fear;
		d.joy = +d.joy;
		d.sadness = +d.sadness;
		d.surprise = +d.surprise;
		d.trust = +d.trust;
		d.affect = +d.affect;
		d.posemo = +d.posemo;
		d.negemo = +d.negemo;
		d.anx = +d.anx;
		d.anger = +d.anger;
		d.sad = +d.sad;
		d.social = +d.social;
		d.family = +d.family;
		d.friend = +d.friend;
		d.female = +d.female;
		d.male = +d.male;
		d.cogproc = +d.cogproc;
		d.insight = +d.insight;
		d.cause = +d.cause;
		d.discrep = +d.discrep;
		d.tentat = +d.tentat;
		d.certain = +d.certain;
		d.differ = +d.differ;
		d.percept = +d.percept;
		d.see = +d.see;
		d.hear = +d.hear;
		d.feel = +d.feel;
		d.bio = +d.bio;
		d.body = +d.body;
		d.health = +d.health;
		d.sexual = +d.sexual;
		d.ingest = +d.ingest;
		d.drives = +d.drives;
		d.affiliation = +d.affiliation;
		d.achiev = +d.achiev;
		d.power = +d.power;
		d.reward = +d.reward;
		d.risk = +d.risk;
		d.focuspast = +d.focuspast;
		d.focuspresent = +d.focuspresent;
		d.focusfuture = +d.focusfuture;
		d.relativ = +d.relativ;
		d.motion = +d.motion;
		d.space = +d.space;
		d.time = +d.time;
		d.work = +d.work;
		d.leisure = +d.leisure;
		d.home = +d.home;
		d.money = +d.money;
		d.relig = +d.relig;
		d.death = +d.death;
		d.informal = +d.informal;
		d.swear = +d.swear;
		d.netspeak = +d.netspeak;
		d.assent = +d.assent;
		d.nonflu = +d.nonflu;
		d.filler = +d.filler;
		d.epoch = capFirstChar(d.epoch);
		d.author = capFirstChar(d.author);
	  });
}


