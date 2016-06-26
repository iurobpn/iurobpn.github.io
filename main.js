var fingerprint = {}
var scatter = {}
var posneg = {}
var dict = {}
var authors = [];
// var data_posneg = [];

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


/* Scatter plot */
function pre_scatter(local) {
	scatter.margin = {top: 20, right: 20, bottom: 30, left: 40};
	scatter.width = 800 - scatter.margin.left - scatter.margin.right;
	scatter.height = 400 - scatter.margin.top - scatter.margin.bottom;

	/*
	 * value accessor - returns the value to encode for a given data object.
	 * scale - maps value to a visual display encoding, such as a pixel position.
	 * map function - maps from data value to display value
	 * axis - sets up axis
	 */
	// setup x
	scatter.xValue = function(d) { return d.x;}; // data -> value
	scatter.xScale = d3.scale.linear().range([0, scatter.width]); // value -> display
	scatter.xMap = function(d) { return scatter.xScale(scatter.xValue(d));}; // data -> display
	scatter.xAxis = d3.svg.axis().scale(scatter.xScale).orient("bottom");

	// setup y
	scatter.yValue = function(d) { return d.y;}; // data -> value
	    scatter.yScale = d3.scale.linear().range([scatter.height, 0]); // value -> display
	    scatter.yMap = function(d) { return scatter.yScale(scatter.yValue(d));}; // data -> display
	    scatter.yAxis = d3.svg.axis().scale(scatter.yScale).orient("left");

	// setup fill color
	scatter.cValue = function(d) { return d.epoch ;},
	    scatter.color = d3.scale.category10();

	// add the graph canvas to the body of the webpage
	scatter.svg = d3.select(local).append("svg")
	    .attr("width", scatter.width + scatter.margin.left + scatter.margin.right)
	    .attr("height", scatter.height + scatter.margin.top + scatter.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + scatter.margin.left + "," + scatter.margin.top + ")");

	// add the tooltip area to the webpage
	scatter.tooltip = d3.select("body").append("div")
	    .attr("class", "tooltip tooltip_scatter")
	    .style("opacity", 0);
}


function plot_scatter(data) {
	// load data
	  scatter.margin_svg = 5;
	  // don't want dots overlapping axis, so add in buffer to data domain
	  scatter.xScale.domain([d3.min(data, scatter.xValue)-scatter.margin_svg, d3.max(data, scatter.xValue)+scatter.margin_svg]);
	  scatter.yScale.domain([d3.min(data, scatter.yValue)-scatter.margin_svg, d3.max(data, scatter.yValue)+scatter.margin_svg]);

	  // x-axis
	  scatter.svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + scatter.height + ")")
	      .call(scatter.xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", scatter.width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("x");


	  // y-axis
	  scatter.svg.append("g")
	      .attr("class", "y axis")
	      .call(scatter.yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("y");

	  // draw dots
	  scatter.svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 3.5)
	      .attr("cx", scatter.xMap)
	      .attr("cy", scatter.yMap)
	      .style("fill", function(d) { return scatter.color(scatter.cValue(d));})
		.on("mouseover", function(d) {
			scatter.tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			scatter.tooltip.html(d.author + "<br/> Epoch: " + d.epoch)
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			scatter.tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		})
		.on("click", function(d){
				// Determine if current line is visible
				author = dict[d.author];
				update_fingerprint(author);
		});
				

	  //draw legend
	  scatter.legend = scatter.svg.selectAll(".legend")
	      .data(scatter.color.domain())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  // draw legend colored rectangles
	  scatter.legend.append("rect")
	      .attr("x", scatter.width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", scatter.color);

	  // draw legend text
	  scatter.legend.append("text")
	      .attr("x", scatter.width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d;})
	// });
}

function pre_fingerprint(local) {
	// var margin = {top: 20, right: 20, bottom: 70, left: 40},
	//     width = 600 - margin.left - margin.right,
	//     height = 300 - margin.top - margin.bottom;
	fingerprint.margin = {top: 20, right: 20, bottom: 20, left: 30};
	fingerprint.width = 500 - fingerprint.margin.left - fingerprint.margin.right;
	fingerprint.height = 250 - fingerprint.margin.top - fingerprint.margin.bottom;

	fingerprint.xScale = d3.scale.ordinal().rangeBands([0, fingerprint.width], .1);

	fingerprint.yScale = d3.scale.linear().range([fingerprint.height, 0]);

	fingerprint.xAxis = d3.svg.axis()
	    .scale(fingerprint.xScale)
	    .orient("bottom")
	    // .tickFormat(d3.time.format("%Y-%m"));
	    .ticks(10)
	    .tickFormat(function(d) { return ""; });

	fingerprint.yAxis = d3.svg.axis()
	    .scale(fingerprint.yScale)
	    .orient("left")
	    .ticks(10);

	fingerprint.svg = d3.select(local).append("svg")
	    .attr("width", fingerprint.width + fingerprint.margin.left + fingerprint.margin.right)
	    .attr("height", fingerprint.height + fingerprint.margin.top + fingerprint.margin.bottom)
	  .append("g")
	    .attr("transform", 
		  "translate(" + fingerprint.margin.left + "," + fingerprint.margin.top + ")");
    
	// add the tooltip area to the webpage
	fingerprint.tooltip = d3.select("body").append("div")
	    .attr("class", "tooltip tooltip_bar")
	    .style("opacity", 0);

}

function update_fingerprint(author) {
	data = {};
	data.positive = author.positive;
	data.negative = author.negative;
	data.anger_emolex = author.anger_emolex;
	data.anticipation = author.anticipation;
	data.disgust = author.disgust;
	data.fear = author.fear;
	data.joy = author.joy;
	data.sadness = author.sadness;
	data.surprise = author.surprise;
	data.trust = author.trust;
	data.affect = author.affect;
	data.posemo = author.posemo;
	data.negemo = author.negemo;
	data.anx = author.anx;
	data.anger = author.anger;
	data.sad = author.sad;
	data.social = author.social;
	data.family = author.family;
	data.friend = author.friend;
	data.female = author.female;
	data.male = author.male;
	data.cogproc = author.cogproc;
	data.insight = author.insight;
	data.cause = author.cause;
	data.discrep = author.discrep;
	data.tentat = author.tentat;
	data.certain = author.certain;
	data.differ = author.differ;
	data.percept = author.percept;
	data.see = author.see;
	data.hear = author.hear;
	data.feel = author.feel;
	data.bio = author.bio;
	data.body = author.body;
	data.health = author.health;
	data.sexual = author.sexual;
	data.ingest = author.ingest;
	data.drives = author.drives;
	data.affiliation = author.affiliation;
	data.achiev = author.achiev;
	data.power = author.power;
	data.reward = author.reward;
	data.risk = author.risk;
	data.focuspast = author.focuspast;
	data.focuspresent = author.focuspresent;
	data.focusfuture = author.focusfuture;
	data.relativ = author.relativ;
	data.motion = author.motion;
	data.space = author.space;
	data.time = author.time;
	data.work = author.work;
	data.leisure = author.leisure;
	data.home = author.home;
	data.money = author.money;
	data.relig = author.relig;
	data.death = author.death;
	data.informal = author.informal;
	data.swear = author.swear;
	data.netspeak = author.netspeak;
	data.assent = author.assent;
	data.nonflu = author.nonflu;
	data.filler = author.filler;
	var epoch = author.epoch;
	var nome = author.author;
	// epoch = author.epoch;
	// delete author.epoch;
	// nome = author.author;
	// delete author.author;
	// delete author.x;
	// delete author.y;
	fingerprint.svg.select("text.label_fingerprint").text(nome);

	features_name = Object.keys(data);
	features_value = Object.values(data);
	var min_feature = d3.min(features_value);
	var max_feature = d3.max(features_value);
	
	fingerprint.xScale.domain(features_name);
	fingerprint.yScale.domain([min_feature, max_feature]);
	// eixo X
	fingerprint.svg.select(".x.axis")
		.transition().duration(300)
		.call(fingerprint.xAxis)
		// .selectAll("text")
		// .style("text-anchor", "end")
		// .attr("dx", "-.8em")
		// .attr("dy", "-.55em")
		// .attr("transform", "rotate(-90)" );

	// eixo Y
	fingerprint.svg.select(".y.axis")
		.transition().duration(300)
		.call(fingerprint.yAxis);
		// .append("text")
		// .attr("transform", "rotate(-90)")
		// .attr("y", 6)
		// .attr("dy", ".71em")
		// .style("text-anchor", "end")
		// .text("Value");

	var features = [];
	for (i = 0; i < features_name.length; i++) { 
		features[i] = {};
		features[i].name = features_name[i];
		features[i].value = features_value[i];
	}


	// THIS IS THE ACTUAL WORK!
	var bars = fingerprint.svg.selectAll(".bar").data(features) // (data) is an array/iterable thing, second argument is an ID generator function

	bars.exit()
	.transition()
	.duration(300)
	.attr("y", fingerprint.yScale(0))
	// .attr("height", height - y(0))
	.style('fill-opacity', 1e-6)
	.remove();

	// data that needs DOM = enter() (a set/selection, not an event!)
	bars.enter().append("rect")
	.attr("class", "bar")
	.attr("y", fingerprint.yScale(0));
	// .attr("height", height - y(0));

	// the "UPDATE" set:
	bars.transition().duration(300)//.attr("x", function(d) { return fingerprint.xValue(d); }) 
		.attr("x", function(d) { return fingerprint.xScale(d.name); })
		.attr("width", fingerprint.xScale.rangeBand())
		.attr("y", function(d) { return fingerprint.yScale(d.value); })
		.attr("height", function(d) { return fingerprint.height - fingerprint.yScale(d.value); });
	bars.on("mouseover", function(d) {
		   fingerprint.tooltip.transition()
		       .duration(200)
			.style("opacity", .9);
		   fingerprint.tooltip.html(d.name)
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		   fingerprint.tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		});
}

/* Fingerprint bar chart */
function plot_fingerprint(author) {
	data = {};
	data.positive = author.positive;
	data.negative = author.negative;
	data.anger_emolex = author.anger_emolex;
	data.anticipation = author.anticipation;
	data.disgust = author.disgust;
	data.fear = author.fear;
	data.joy = author.joy;
	data.sadness = author.sadness;
	data.surprise = author.surprise;
	data.trust = author.trust;
	data.affect = author.affect;
	data.posemo = author.posemo;
	data.negemo = author.negemo;
	data.anx = author.anx;
	data.anger = author.anger;
	data.sad = author.sad;
	data.social = author.social;
	data.family = author.family;
	data.friend = author.friend;
	data.female = author.female;
	data.male = author.male;
	data.cogproc = author.cogproc;
	data.insight = author.insight;
	data.cause = author.cause;
	data.discrep = author.discrep;
	data.tentat = author.tentat;
	data.certain = author.certain;
	data.differ = author.differ;
	data.percept = author.percept;
	data.see = author.see;
	data.hear = author.hear;
	data.feel = author.feel;
	data.bio = author.bio;
	data.body = author.body;
	data.health = author.health;
	data.sexual = author.sexual;
	data.ingest = author.ingest;
	data.drives = author.drives;
	data.affiliation = author.affiliation;
	data.achiev = author.achiev;
	data.power = author.power;
	data.reward = author.reward;
	data.risk = author.risk;
	data.focuspast = author.focuspast;
	data.focuspresent = author.focuspresent;
	data.focusfuture = author.focusfuture;
	data.relativ = author.relativ;
	data.motion = author.motion;
	data.space = author.space;
	data.time = author.time;
	data.work = author.work;
	data.leisure = author.leisure;
	data.home = author.home;
	data.money = author.money;
	data.relig = author.relig;
	data.death = author.death;
	data.informal = author.informal;
	data.swear = author.swear;
	data.netspeak = author.netspeak;
	data.assent = author.assent;
	data.nonflu = author.nonflu;
	data.filler = author.filler;
	var epoch = author.epoch;
	var nome = author.author;


	// fingerprint.svg.select("label_fingerprint").text(nome);
	fingerprint.svg
		.append("text")
		.attr("class","label_fingerprint")
		.attr("x", fingerprint.width / 2) 
		.attr("y", 0-(fingerprint.margin.top / 2))
		.attr("text-anchor", "middle")  
		.style("font-size", "12px") 
		.text(nome);

	features_name = Object.keys(data);
	features_value = Object.values(data);
	min_feature = d3.min(features_value);
	max_feature = d3.max(features_value);
	
	fingerprint.xScale.domain(features_name);
	fingerprint.yScale.domain([min_feature, max_feature]);
	// eixo X
	fingerprint.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + fingerprint.height + ")")
		.transition().duration(300)
		.call(fingerprint.xAxis)
		// .selectAll("text")
		// .style("text-anchor", "end")
		// .attr("dx", "-.8em")
		// .attr("dy", "-.55em")
		// .attr("transform", "rotate(-90)" );

	// eixo Y
	fingerprint.svg.append("g")
		.attr("class", "y axis")
		.transition().duration(300)
		.call(fingerprint.yAxis);
		// .append("text")
		// .attr("transform", "rotate(-90)")
		// .attr("y", 6)
		// .attr("dy", ".71em")
		// .style("text-anchor", "end")
		// .text("Value");

	var features = [];
	for (i = 0; i < features_name.length; i++) { 
		features[i] = {};
		features[i].name = features_name[i];
		features[i].value = features_value[i];
	}


	// THIS IS THE ACTUAL WORK!
	var bars = fingerprint.svg.selectAll(".bar").data(features) // (data) is an array/iterable thing, second argument is an ID generator function

	bars.exit()
	.transition()
	.duration(300)
	.attr("y", fingerprint.yScale(0))
	// .attr("height", height - y(0))
	.style('fill-opacity', 1e-6)
	.remove();

	// data that needs DOM = enter() (a set/selection, not an event!)
	bars.enter().append("rect")
	.attr("class", "bar")
	.attr("y", fingerprint.yScale(0));
	// .attr("height", height - y(0));

	// the "UPDATE" set:
	bars.transition().duration(300)//.attr("x", function(d) { return fingerprint.xValue(d); }) 
		.attr("x", function(d) { return fingerprint.xScale(d.name); })
		.attr("width", fingerprint.xScale.rangeBand())
		.attr("y", function(d) { return fingerprint.yScale(d.value); })
		.attr("height", function(d) { return fingerprint.height - fingerprint.yScale(d.value); });
	bars.on("mouseover", function(d) {
		   fingerprint.tooltip.transition()
		       .duration(200)
			.style("opacity", .9);
		   fingerprint.tooltip.html(d.name)
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		   fingerprint.tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		});
}

function pre_posneg(local) {
	// var margin = {top: 50, right: 20, bottom: 10, left: 200},
	//     width = 800 - margin.left - margin.right,
	//     height = 400 - margin.top - margin.bottom;
	posneg.margin = {top: 50, right: 60, bottom: 10, left:150};
	posneg.width = 500 - posneg.margin.left - posneg.margin.right;
	posneg.height = 300 - posneg.margin.top - posneg.margin.bottom;

	posneg.yScale = d3.scale.ordinal()
	    .rangeRoundBands([0, posneg.height], .3);

	posneg.xScale = d3.scale.linear()
	    .rangeRound([0, posneg.width]);

	posneg.color = d3.scale.ordinal()
	    .range(["#c7001e", "#f6a580",  "#92c6db", "#086fad"]);

	posneg.xAxis = d3.svg.axis()
	    .scale(posneg.xScale)
	    .orient("top");

	posneg.yAxis = d3.svg.axis()
	    .scale(posneg.yScale)
	    .orient("left")

	posneg.svg = d3.select(local).append("svg")
	    .attr("width", posneg.width + posneg.margin.left + posneg.margin.right)
	    .attr("height", posneg.height + posneg.margin.top + posneg.margin.bottom)
	    .attr("id", "d3-plot")
	  .append("g")
	    .attr("transform", "translate(" + posneg.margin.left + "," + posneg.margin.top + ")");

	  posneg.color.domain(["Sadness", "Negative",  "Positive", "Joy"]);
}

function handle_posneg_data(data) {
	data.forEach(function(d) {
		d.affect = +d.affect;
		d.negative = +d.negative;
		d.positive = +d.positive;
		d.neutral = +d.neutral;
		d.joy = +d.joy;
		d.sadness = +d.sadness;
		// calc percentages
		// fd.neutral = (d.sadness + d.joy + d.positive + d.negative)/4;
		d.neutral = 100 - d.affect;
		d.neutral = d.neutral;
		d.N = d.sadness + d.neutral + d.joy + d.positive + d.negative;
		d.Sadness = d.sadness*100/(d.N - d.neutral);
		d.Negative = d.negative*100/(d.N - d.neutral);
		// d["Neutral"] = +d["neutral"]*100/d.N;
		d.Positive = d.positive*100/(d.N - d.neutral);
		d.Joy = d.joy*100/(d.N - d.neutral);
		var x0 = -1*( d.Negative + d.Sadness);
		var idx = 0;
		d.negative = d.negative;
		d.positive = d.positive;
		d.neutral = d.neutral;
		d.joy = d.joy;
		
		d.boxes = posneg.color.domain().map(function(name) { return {
			joy: d.joy,
			sadness: d.sadness,
			positive: d.positive,
			positive: d.positive,
			negative: d.negative,
			author: d.author,
			name: name,
			x0: x0,
			x1: x0 += +d[name],
			N: +d.N- d.neutral,
			// n: +d[idx += 1]
		}; });
	});

}


function check_author(author,rem) {
	// d3.selectAll("input").filter("#"+author).attr("checked",rem);
	d3.selectAll("input").filter("#"+author).node().checked = rem;
}

function get_check_author(author) {
	return d3.selectAll("input").filter("#"+author).attr("checked");
}

function plot_posneg(data) {

	// d3.csv("visu4.csv", function(error, data)  {
	// handle_posneg_data(data);

	var min_val = d3.min(data, function(d) {
		return d.boxes["0"].x0;
	});

	var max_val = d3.max(data, function(d) {
		return d.boxes["3"].x1;
	});

	for (i=0; i<data.length; i++) {
		check_author(data[i].author,true);
	}

	posneg.xScale.domain([min_val, max_val]).nice();
	posneg.yScale.domain(data.map(function(d) { return d.author; }));


	posneg.tooltip = d3.select("body").append("div")
	    .attr("class", "tooltip tooltip_posneg")
	    .style("opacity", 0);

	  posneg.svg.append("g")
	      .attr("class", "x axis")
	      .call(posneg.xAxis);

	  posneg.svg.append("g")
	      .attr("class", "y axis")
	      .call(posneg.yAxis)

	  posneg.vakken = posneg.svg.selectAll(".question")
	      .data(data)
	    .enter().append("g")
	      .attr("class", "bar")
	      .attr("transform", function(d) { return "translate(0," + posneg.yScale(d.author) + ")"; });

	  posneg.bars = posneg.vakken.selectAll("rect")
		.data(function(d) { return d.boxes; })
		.enter()
		.append("g")
		// .attr("class", "subbar")
		.on("mouseover", function(d) {
		   posneg.tooltip.transition()
		       .duration(200)
			.style("opacity", .9);
		   posneg.tooltip.html("Authors: " + d.author + "<br>"
				+ "Joy: " + d.joy + "<br>"
				+ "Positive: " +  d.positive + "<br>"
				+ "Negative: " + d.negative + "<br>"
				+ "Sadness: " + d.sadness)
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		   posneg.tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		});
	    // .on('mouseover', tip.show)
	    // .on('mouseout', tip.hide)
	    //   ;

	  posneg.bars.append("rect")
	      .attr("height", posneg.yScale.rangeBand())
	      .attr("x", function(d) { return posneg.xScale(d.x0); })
	      .attr("width", function(d) { return posneg.xScale(d.x1) - posneg.xScale(d.x0); })
	      .style("fill", function(d) { return posneg.color(d.name); });

	  // posneg.bars.append("text")
	  //     .attr("x", function(d) { return posneg.xScale(d.x0); })
	  //     .attr("y", posneg.yScale.rangeBand()/2)
	  //     .attr("dy", "0.5em")
	  //     .attr("dx", "0.5em")
	  //     .style("font" ,"10px sans-serif")
	  //     .style("text-anchor", "start")
	      // .text(function(d) { return d.N !== 0 && (d.x1-d.x0)>3 ? Math.abs(Math.floor(d.x1-d.x0)) + "%" : "" });

	  posneg.vakken.insert("rect",":first-child")
	      .attr("height", posneg.yScale.rangeBand())
	      .attr("x", "1")
	      .attr("width", posneg.width)
	      .attr("fill-opacity", "0.5")
	      .style("fill", "#F5F5F5")
	      .attr("class", function(d,index) { return index%2==0 ? "even" : "uneven"; });

	  posneg.svg.append("g")
	      .attr("class", "y axis")
	  .append("line")
	      .attr("x1", posneg.xScale(0))
	      .attr("x2", posneg.xScale(0))
	      .attr("y2", posneg.height);

	  var startp = posneg.svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
	  // this is not nice, we should calculate the bounding box and use that
	  var legend_tabs = [0, 120, 200, 375, 450];
	  posneg.legend = startp.selectAll(".legend")
	      .data(posneg.color.domain().slice())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });

	  posneg.legend.append("rect")
	      .attr("x", 0)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", posneg.color);

	  posneg.legend.append("text")
	      .attr("x", 22)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "start")
	      .style("font" ,"10px sans-serif")
	      .text(function(d) { return d; });

	  d3.selectAll(".axis path")
	      .style("fill", "none")
	      .style("stroke", "#000")
	      .style("shape-rendering", "crispEdges")

	  d3.selectAll(".axis line")
	      .style("fill", "none")
	      .style("stroke", "#000")
	      .style("shape-rendering", "crispEdges")



	  var movesize = posneg.width/2 - startp.node().getBBox().width/2;
	  d3.selectAll(".legendbox").attr("transform", "translate(" + movesize  + ",0)");
	// });
}

data_posneg = [];
function plot(local_scatter,local_fingerprint,local_posneg,local_authors) {
	pre_scatter(local_scatter);
	pre_fingerprint(local_fingerprint);
	pre_posneg(local_posneg);
	d3.csv("scatter_data.csv", function(error, data) {
		handle_scatter_data(data);
		// data_posneg = data.slice(0)
		handle_posneg_data(data);
		/* gerando o dicionarios de autores */		
		data.forEach(function(author) {
			/* name = author.author */
			dict[author.author] = author;
		});
		authors = Object.keys(dict);
		plot_scatter(data);
		plot_fingerprint(data[0]);
		plot_authors(local_authors,authors);
		plot_posneg(data.slice(1,7));
	});
}

function update_posneg(author,rem) {


	// posneg.tooltip = d3.select("body").append("div")
	//     .attr("class", "tooltip tooltip_posneg")
	//     .style("opacity", 0);



	  posneg.svg.select(".x.axis")
	  	.transition().duration(300)
		.call(posneg.xAxis);

	  posneg.svg.select(".y.axis")
	  	.transition().duration(300)
		.call(posneg.yAxis);



	var bars = posneg.vakken.selectAll(".bar")
	var data = bars.data();
	
	for (i=0; i<data.length; i++) {
		if (data[i].author == author) {
			if (rem) {
				data.push(dict[author]);
				break;
			} else {
				data.splice(i,1);
			}
		}
	}

	var min_val = d3.min(data, function(d) {
	  return d.boxes["0"].x0;
	  });

	var max_val = d3.max(data, function(d) {
	  return d.boxes["3"].x1;
	  });

	posneg.xScale.domain([min_val, max_val]).nice();
	posneg.yScale.domain(data.map(function(d) { return d.author; }));

	bars.data(function(d) { return d.boxes; })
		.enter()
		.append("g")
		// .attr("class", "subbar")
		.on("mouseover", function(d) {
		   posneg.tooltip.transition()
		       .duration(200)
			.style("opacity", .9);
		   posneg.tooltip.html("Authors: " + d.author + "<br>"
				+ "Joy: " + d.joy + "<br>"
				+ "Positive: " +  d.positive + "<br>"
				+ "Negative: " + d.negative + "<br>"
				+ "Sadness: " + d.sadness)
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		   posneg.tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		});

	bars.append("rect")
		.attr("height", posneg.yScale.rangeBand())
		.attr("x", function(d) { return posneg.xScale(d.x0); })
		.attr("width", function(d) { return posneg.xScale(d.x1) - posneg.xScale(d.x0); })
		.style("fill", function(d) { return posneg.color(d.name); });

	  // bars.append("text")
	  //     .attr("x", function(d) { return posneg.xScale(d.x0); })
	  //     .attr("y", posneg.yScale.rangeBand()/2)
	  //     .attr("dy", "0.5em")
	  //     .attr("dx", "0.5em")
	  //     .style("font" ,"10px sans-serif")
	  //     .style("text-anchor", "start")
	      // .text(function(d) { return d.N !== 0 && (d.x1-d.x0)>3 ? Math.abs(Math.floor(d.x1-d.x0)) + "%" : "" });

	  posneg.vakken.insert("rect",":first-child")
	      .attr("height", posneg.yScale.rangeBand())
	      .attr("x", "1")
	      .attr("width", posneg.width)
	      .attr("fill-opacity", "0.5")
	      .style("fill", "#F5F5F5")
	      .attr("class", function(d,index) { return index%2==0 ? "even" : "uneven"; });

	  // posneg.svg.append("g")
	  //     .attr("class", "y axis")
	  // .append("line")
	  //     .attr("x1", posneg.xScale(0))
	  //     .attr("x2", posneg.xScale(0))
	  //     .attr("y2", posneg.height);

	  // var startp = posneg.svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
	  // // this is not nice, we should calculate the bounding box and use that
	  // var legend_tabs = [0, 120, 200, 375, 450];
	  // posneg.legend = startp.selectAll(".legend")
	  //     .data(posneg.color.domain().slice())
	  //   .enter().append("g")
	  //     .attr("class", "legend")
	  //     .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });
          //
	  // posneg.legend.append("rect")
	  //     .attr("x", 0)
	  //     .attr("width", 18)
	  //     .attr("height", 18)
	  //     .style("fill", posneg.color);
          //
	  // posneg.legend.append("text")
	  //     .attr("x", 22)
	  //     .attr("y", 9)
	  //     .attr("dy", ".35em")
	  //     .style("text-anchor", "start")
	  //     .style("font" ,"10px sans-serif")
	  //     .text(function(d) { return d; });

	  // d3.selectAll(".axis path")
	  //     .style("fill", "none")
	  //     .style("stroke", "#000")
	  //     .style("shape-rendering", "crispEdges")
          //
	  // d3.selectAll(".axis line")
	  //     .style("fill", "none")
	  //     .style("stroke", "#000")
	  //     .style("shape-rendering", "crispEdges")



	  // var movesize = posneg.width/2 - startp.node().getBBox().width/2;
	  // d3.selectAll(".legendbox").attr("transform", "translate(" + movesize  + ",0)");
	// });

}


// var divs = new Object();
function plot_authors(local,authors) {
	// console.log(local)
	// console.log(authors)
	var divs = d3.select(local).selectAll(".author")
		.data(authors)
		.enter()
		.append("div")
		.attr("class","author");

	// divs.html(function(d){return d;});
	fun = function(d){return d;};
	// divs.append("label")
	// 	.attr("class","author")
	// 	.html(function(d) {
	// 		return '<input type="checkbox" name="author" value=' + 
	// 			d + ">" + d;
	// 	});

	var checkboxes = divs.append("input")
		.attr("type","checkbox")
		.attr("name","author")
		.attr("id",fun)
		.on("change",function(d) {update_posneg(d,this.checked)});
	divs.append("a").html(fun);
	 // divs.append("a").html(fun);
	 // checkboxes
// d3.select("input").on("change", change);
}
