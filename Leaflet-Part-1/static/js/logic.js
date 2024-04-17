// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
  let myMap = L.map("map").setView([45.52, -122.67], 4);


  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// Store the API query variables.
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Perform a GET request to the query URL/
d3.json(queryURL).then(function (data) {
  
  for (var i = 0; i < data.features.length; i++) {
      console.log(i);
      let latitude = data.features[i].geometry.coordinates[1];
      let longitude = data.features[i].geometry.coordinates[0];
      let depth = data.features[i].geometry.coordinates[2];
      let magnitude = data.features[i].properties.mag;
      let location = data.features[i].properties.place;

      function depthColor(depth) {
          if (depth >= 90) return "red";
          if (depth >= 70 & depth < 90) return "darkorange";
          if (depth >= 50 & depth < 70) return "orange";
          if (depth >= 30 & depth < 50) return "yellow";
          if (depth >= 10 & depth < 30) return "yellowgreen";
          if (depth >= -10 & depth < 10) return "lawngreen";
      };

      let circle = L.circle([latitude,longitude], {
          fillOpacity: 0.95,
          color: "black",
          fillColor: depthColor(depth),
          radius: magnitude*20000
      });

      circle.addTo(myMap);
      circle.bindPopup((`<h1>${magnitude} Magnitude,</h1> <hr> <h2> ${location},</h2> <hr> <h2> Depth: ${depth}</h2>`));
  }

  //Adding a legend
  var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = ["-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    var colors = ["lawngreen", "yellowgreen", "yellow", "orange", "darkorange","red"];
    var labels = []

  // Add min & max
  div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
    <div class="max">' + limits[limits.length - 1] + '</div></div>'

  limits.forEach(function (limit, index) {
    labels.push('<li style="background-color: ' + colors[index] + '"></li>')
  })

  div.innerHTML += '<ul>' + labels.join('') + '</ul>'
  return div
}
  
  legend.addTo(myMap)
});
