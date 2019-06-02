// Store Paths to Data Files
// var JSONPath = "{{ url_for('static', filename='data/JSON/newgeo.json') }}";

// If-else functions to select state colors
function getColor(d) {
    return d >= 50  ? '#ffffe0' :
           d > 45   ? '#ffea71' :
           d > 40   ? '#fdd249' :
           d > 35   ? '#f5b935' :
           d > 30   ? '#eba12b' :
           d > 25   ? '#df8a27' :
           d > 20   ? '#d27327' :
           d > 15   ? '#c45b28' :
           d > 10   ? '#b54429' :
                      '#a52a2a' ;
}


// Setting up style object to be passed to each feature
function style(Data) {
{   var colorData = Data['Craft Breweries Rank']
    return {
        fillColor: getColor(colorData),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
};
}


// Perform a GET request to the query path
// d3.json(JSONPath, function(data) {

    function highlightFeature(e) {
        e.target.setStyle({
        weight: 5,
        color: '#606060',
        dashArray: '',
        fillOpacity: 0.7
        });
                    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        e.target.bringToFront();
            };
        };

    function resetHighlight(e) {
        stateslayer.resetStyle(e.target);
        };

    // Add Clickable popups for every feature element
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.NAME +
        "</h3><hr><p>Craft Breweries Rank: <b>" + feature['Craft Breweries Rank'] + 
        "</b><hr><p># of Craft Breweries: <b>" + feature["Craft Breweries"] +
        "</b><hr><p>Total Capita per Brewery: <b>" + feature["Total Capita/ Breweries"] + "</b></p>")
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    };
    
    console.log("sd --- ")
    console.log(appDataObjZero)

    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    var stateslayer = L.geoJSON(appDataObjZero, {
        style: style,
        onEachFeature: onEachFeature
    });

  
    // Set State data as an overlay layer
    var stateBounds = L.layerGroup([stateslayer]);
    

    // Define streetmap and lightmap layers
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold base layers
    var baseMaps = {
        "Light Map": lightmap,
        "Street Map": streetmap
    };

    // Define an overlay object to hold the overlay layers
    var overlayMaps = {
        "Craft Breweries State Rank": stateBounds,
    };

    // Create a new map
    var myMap = L.map("map", {
        center: [41.27, -98.96],
        zoom: 4,
        layers: [lightmap, stateBounds]
    });



    // Create a layer control containing our baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'Legend'),
        rank = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        labels = ['<strong>State Rank</strong>'];
        div.innerHTML = labels + '<br>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < rank.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(rank[i] + 1) + '"></i> ' +
            rank[i] + (rank[i + 1] ? '&ndash;' + rank[i + 1] + '<br>' : '+');
    }
    return div;
    };

    legend.addTo(myMap);
// });