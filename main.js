
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
var scatter = {}
scatter.margin = {top: 20, right: 20, bottom: 30, left: 40};
scatter.width = 960 - scatter.margin.left - scatter.margin.right;
scatter.height = 500 - scatter.margin.top - scatter.margin.bottom;

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
scatter.svg = d3.select("div.scatter").append("svg")
    .attr("width", scatter.width + scatter.margin.left + scatter.margin.right)
    .attr("height", scatter.height + scatter.margin.top + scatter.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + scatter.margin.left + "," + scatter.margin.top + ")");

// add the tooltip area to the webpage
scatter.tooltip = d3.select("body").append("div")
    .attr("class", "tooltip_scatter")
    .style("opacity", 0);

// load data
d3.csv("scatter_data.csv", function(error, data) {
	handle_scatter_data(data);
  // change string (from CSV) into number format
  // scatter.x_max = d3.max(data, scatter.xValue);
  // scatter.x_min = d3.min(data, scatter.xValue);
  // scatter.y_max = d3.max(data, scatter.yValue);
  // scatter.y_min = d3.min(data, scatter.yValue);

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
      });

  // d3.selectAll("p")
	//   .data([scatter.x_min,scatter.x_max,scatter.y_min,scatter.y_max])
	//   .enter()
	//   .append("p")
	//   .text(function(d) { return d;})
	//   .exit();

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
});
