
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


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/*
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

// setup x
var xValue = function(d) { return d.x;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.y;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.epoch ;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("div.scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip_scatter")
    .style("opacity", 0);

// load data
d3.csv("scatter_data.csv", function(error, data) {
	handle_scatter_data(data);
  // change string (from CSV) into number format
  var x_max = d3.max(data, xValue);
  var x_min = d3.min(data, xValue);
  var y_max = d3.max(data, yValue);
  var y_min = d3.min(data, yValue);

  var margin_svg = 5;
  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-margin_svg, d3.max(data, xValue)+margin_svg]);
  yScale.domain([d3.min(data, yValue)-margin_svg, d3.max(data, yValue)+margin_svg]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("x");


  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("y");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.author + "<br/> Epoch: " + d.epoch)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // d3.selectAll("p")
	//   .data([x_min,x_max,y_min,y_max])
	//   .enter()
	//   .append("p")
	//   .text(function(d) { return d;})
	//   .exit();

  //draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
