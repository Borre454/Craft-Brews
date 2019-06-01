var appDataObj = JSON.parse(myGeocode)

var statesDataObj = appDataObj[0]
var statesDataObjFinal = statesDataObj["states"]
console.log(statesDataObjFinal)

var citiesDataObj = appDataObj[1]
var citiesDataObjFinal = citiesDataObj["cities"]
console.log(citiesDataObjFinal)

var styleDataObj = appDataObj[3]
var styleDataObjFinal = styleDataObj["style"]
console.log(styleDataObjFinal)

var breweriesDataObj = appDataObj[2]
var breweriesDataObjFinal = breweriesDataObj["breweries"]
console.log(breweriesDataObjFinal)

var collectionsObject = {'state':statesDataObjFinal,'city':citiesDataObjFinal,'style':styleDataObjFinal,'brewery_name':breweriesDataObjFinal}

// Constants
var diameter = 500,
    format = d3.format(",d"),
    color = d3.scale.category20c();

// Define a bubble object with attributes
var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

// Define svg object
var svg = d3.select("#body_bubbles").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

// Define 'div' for tooltips
var div = d3.select("#body_bubbles") 
    .append("div")  // declare the tooltip div 
    .attr("class", "tooltip")
    .style("opacity", 0);
    //.text("a simple tooltip");


// d3.json("breweriesBubbles.json", function(error, root) {
//   // Throw warning
//   if (error) return console.warn(error);

  // Get the data from the JSON file 
  pts = getTheData(breweriesDataObjFinal);

  // Visualise the data
  visualiseIt(pts);

// });


// Get the data from the json file
function getTheData(root){
  console.log(root)
    // Get the node values
  var pts = bubble.nodes(classes(root)).filter( function(d) {
    // console.log(!d.children)
    return !d.children;} );
    
  // console.log(pts)
  return pts;
  
}

// Visualise the data function 
function visualiseIt(pts){
  // transition
  var t = d3.transition()
      .duration(25000);
  // Define a node
  // Use a <g> element to put multiple elements in the same location, such
  // as a <circle> and <text> element.
  var node = svg.selectAll(".node")
      .data(pts)
          .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

  // Shape for each node
  node.append("circle").transition(t)
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  // Label for each node
  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });

  // Tooltip for bubble
  node.on("mouseover", function(d) {    
              div .transition()
                  .duration(100)    
                  .style("visibility", "visible")
                  .style("opacity", 0.9);
              div .html(
                      "Package: " +d.packageName +"<br/>"+
                      "Class: "   +d.className   +"<br/>"+
                      "Size: "    +d.value 
                  )
                  .style("left", (d3.event.pageX -475) + "px")             
                  .style("top", (d3.event.pageY-200) + "px");
              })
      .on("mouseout", function(){return div.style("visibility", "hidden");});
} // visualiseIt(pts)


// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");

$(".filters").click(function(event){
  var radioValue = $("input[name='optradio']:checked").val();
  
  d3.selectAll("svg > *").remove();
  
  // d3.json(collectionsObject[radioValue], function(error, root) {
  //   // Throw warning
  //   if (error) return console.warn(error);
  
    // Get the data from the JSON file 
    pts = getTheData(collectionsObject[radioValue]);
  
    // Visualise the data
    visualiseIt(pts);

// });
});