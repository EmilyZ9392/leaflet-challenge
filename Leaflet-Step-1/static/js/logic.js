// create/define tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 10,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// create map object, center on center of US.
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 4,

});

streetmap.addTo(myMap);

// Store our API endpoint (all earthquakes for last 7 days)
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url, function(data) {

  /// create mapStyle function

  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: setRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  //create function for depth color of earthquake markers
  function chooseColor(depth) {
    switch (true) {
      case depth < 10:
        return "#7CFC00";
      case depth < 30:
        return "#ADFF2F";
      case depth < 50:
        return "#FFD700";
      case depth < 70:
        return "#FFA500";
      case depth < 90:
        return "#FF8C00";
      default:
        return "#FF0000";
  
    }
  }
  // create function for radius of markers based on magnitude
  function setRadius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 4;
  }
  

//create markers for earthquakes as a layer from geojson
  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: mapStyle,

    //create pop-up for each marker with magnitude, location, and depth 
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br> Depth: " + feature.geometry.coordinates[2]);

    }
  }).addTo(myMap);

  //create legend for depth colors

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = ["#7CFC00", "#ADFF2F", "#FFD700", "#FFA500","#FF8C00", "#FF0000"];


  // loop through depth/color intervals to put them in legend
    for (var i = 0; i<grades.length; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;

  };

  legend.addTo(myMap)
  
  

});