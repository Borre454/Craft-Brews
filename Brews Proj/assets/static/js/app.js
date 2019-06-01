// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG Wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Score";

// function used for updating x-scale var upon click on axis label
function xScale(beerData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(beerData, d => d[chosenXAxis]) * 0.8,
      d3.max(beerData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "Score") {
    var xlabel = "Score:";
  }
  else if (chosenXAxis === "ABV") {
  	var xlabel = "ABV:";
  }
  else {
    var xlabel = "Ratings:";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.Beer}<br>${xlabel} ${d[chosenXAxis]}<br>rAvg: ${d.rAvg}`);
    });

  circlesGroup.call(toolTip);

  // circlesGroup.on("mouseover", function(d) {
  //   toolTip.show(d);
  // })

  circlesGroup.on("mouseover", toolTip.show)

  //onmouseout event
  	.on("mouseout", function(d, index) {
      toolTip.hide(d);
    });

  return circlesGroup;
}


//Load the data
d3.csv("assets/data/craft_beer_fest_data2.csv").then(function(beerData) {
	console.log(beerData);

	beerData.forEach(function(d) {
		d.Table = +d.Table;
		d.Score = +d.Score;
		d.rAvg = +d.rAvg;
		d.Ratings = +d.Ratings;

	});

  

	// xLinearScale function above csv import
  var xLinearScale = xScale(beerData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(beerData, d => d.rAvg)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(beerData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.rAvg))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // var textGroup = chartGroup.selectAll("tspan")
  //   .data(healthData)
  //   .enter()
  //   .append("text")
  //   .attr("x", d => xLinearScale(d[chosenXAxis])-10)
  //   .attr("y", d => yLinearScale(d.healthcare)+5)
  //   .attr("r", 20)
  //   .text(function(d) {return d.abbr})
  //   .attr({"font-size":10});    

  // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ScoreLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "Score") // value to grab for event listener
    .classed("active", true)
    .text("Score");

  var ABVLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "ABV") // value to grab for event listener
    .classed("inactive", true)
    .text("ABV (%)");

  var RatingsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "Ratings") // value to grab for event listener
    .classed("inactive", true)
    .text("Ratings");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("rAvg");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(beerData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "ABV") {
          ABVLabel
            .classed("active", true)
            .classed("inactive", false);
          RatingsLabel
            .classed("active", false)
            .classed("inactive", true);
          ScoreLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "Ratings") {
          RatingsLabel
            .classed("active", true)
            .classed("inactive", false);
          ABVLabel
            .classed("active", false)
            .classed("inactive", true);
          ScoreLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ScoreLabel
            .classed("active", true)
            .classed("inactive", false);
          ABVLabel
            .classed("active", false)
            .classed("inactive", true);
          RatingsLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
});