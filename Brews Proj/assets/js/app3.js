// Import our CSV data with d3's .csv import method.
d3.csv("../data/brewery_names_summary.csv").then(function(beerData) {
    // Visualize the data
    console.log(beerData);
  
    // beerData.forEach(function(d) {
    //   d.Table = +d.Table;
    //   d.Score = +d.Score;
    //   d.rAvg = +d.rAvg;
    //   d.Ratings = +d.Ratings;
    //   d.ABV = parseFloat(d.ABV);
    // });
  });