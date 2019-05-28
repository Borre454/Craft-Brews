// Store Paths to Data Files
var JSONPath = "../data/JSON/newgeo.json";
console.log(JSONPath)


// If-else functions to select state colors
function getColor(d) {
    return d >= 50  ? '#E31A1C' :
           d > 40   ? '#FC4E2A' :
           d > 30   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0' ;
}

// Setting up style object to be passed to each feature
function style(Data) {
{
    return (console.log(Data), {
        fillColor: getColor(Data['Craft Breweries Rank']),
        weight: 2,
        opacity: 1,
        color: getColor(Data['Craft Breweries Rank']),
        dashArray: '3',
        fillOpacity: 0.7
    });
};
}


// Perform a GET request to the query path
d3.json(JSONPath, function(data) {
    console.log(data.features);

    // Add Clickable popups for every feature element
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.NAME +
        "</h3><hr><p>Craft Breweries Rank: " + feature['Craft Breweries Rank'] + 
        "<hr><p>Total Capita per Brewery: " + feature["Total Capita/ Breweries"] +
        "<hr><p>Production Rank: " + feature["Production_Rank"] + "</p>")
    };


    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    
    var stateslayer = L.geoJSON(data.features, {
        onEachFeature: onEachFeature,
        style: style
    });
  
    // Set earthquake data as an overlay layer
    var stateBounds = L.layerGroup([stateslayer]);
    

    // Define streetmap and satellite layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Satellite Map": satellitemap
    };

    // Define an overlay object to hold the overlay layers
    var overlayMaps = {
        "Craft Breweries Rank": stateBounds
    };

    // Create a new map
    var myMap = L.map("map", {
        center: [41.27, -98.96],
        zoom: 4,
        layers: [streetmap, stateBounds]
    });

    // Create a layer control containing our baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

    // })
});