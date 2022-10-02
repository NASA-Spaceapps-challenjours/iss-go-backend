function addPlaceMarker() {
  let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
  placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION,
    0.3,
    WorldWind.OFFSET_FRACTION,
    0.0
  );

  placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
  placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION,
    0.5,
    WorldWind.OFFSET_FRACTION,
    1.0
  );

  let placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
  placemark.alwaysOnTop = true;
  placemark.attributes = placemarkAttributes;
  placemarkLayer.addRenderable(placemark);
  return placemark;
}

// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");

// Add some image layers to the WorldWindow's globe.
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());
// wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer(null));

// Add a COLLADA model of the ISS that orbits the Earth
var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);

// Add Atmosphere
var atmosphereLayer = new WorldWind.AtmosphereLayer();
wwd.addLayer(atmosphereLayer);

// Add Stars
var starFieldLayer = new WorldWind.StarFieldLayer();
wwd.addLayer(starFieldLayer);

// Add ISS
var issLayer = new WorldWind.RenderableLayer();
wwd.addLayer(issLayer);

// Add Placemark
var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

var pinLibrary =
  WorldWind.configuration.baseUrl + "images/pushpins/plain-black.png"; // location of the image files
placemark,
  (placemarkAttributes = new WorldWind.PlacemarkAttributes(null)),
  (latitude = 37.6872),
  (longitude = -97.3301);

// Set up the common placemark attributes.
placemarkAttributes.imageScale = 1;
placemarkAttributes.imageOffset = new WorldWind.Offset(
  WorldWind.OFFSET_FRACTION,
  0.3,
  WorldWind.OFFSET_FRACTION,
  0.0
);
placemarkAttributes.imageColor = WorldWind.Color.WHITE;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
  WorldWind.OFFSET_FRACTION,
  0.5,
  WorldWind.OFFSET_FRACTION,
  1.0
);
placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
placemarkAttributes.drawLeaderLine = true;
placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

// For each placemark image, create a placemark with a label.
// Create the placemark and its label.
placemark = new WorldWind.Placemark(
  new WorldWind.Position(latitude, longitude, 1e2),
  true,
  null
);
placemark.label =
  "Placemark for Wichita" +
  "Lat " +
  placemark.position.latitude.toPrecision(4).toString() +
  "\n" +
  "Lon " +
  placemark.position.longitude.toPrecision(5).toString();
placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

// Create the placemark attributes for this placemark. Note that the attributes differ only by their
// image URL.
placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
placemarkAttributes.imageSource = pinLibrary;
placemark.attributes = placemarkAttributes;

// Create the highlight attributes for this placemark. Note that the normal attributes are specified as
// the default highlight attributes so that all properties are identical except the image scale. You could
// instead vary the color, image, or other property to control the highlight representation.
highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
highlightAttributes.imageScale = 1.2;
placemark.highlightAttributes = highlightAttributes;

// Add the placemark to the layer.
placemarkLayer.addRenderable(placemark);

// ISS Position values
var postlat = 10.0;
var postlon = -125.0;
var postalt = 800000.0;

var lat = postlat;
var lon = postlon;
var alt = postalt;

var position = new WorldWind.Position(lat, lon, alt);
var config = { dirPath: "/models/" };

var placemark = addPlaceMarker();

var pathAttributes = new WorldWind.ShapeAttributes(null);
var positionArray = [];
positionArray.push(position);

// Create the path.
var path = new WorldWind.Path(positionArray, null);
path.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
path.followTerrain = true;
path.useSurfaceShapeFor2D = true;

// Create and assign the path's attributes.
var pathAttributes = new WorldWind.ShapeAttributes(null);
pathAttributes.outlineColor = WorldWind.Color.YELLOW;
pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 1);
pathAttributes.drawVerticals = path.extrude;
path.attributes = pathAttributes;

// Add the path to a layer and the layer to the WorldWindow's layer list.
var pathsLayer = new WorldWind.RenderableLayer();
pathsLayer.displayName = "Paths";
pathsLayer.addRenderable(path);
wwd.addLayer(pathsLayer);

var colladaLoader = new WorldWind.ColladaLoader(position, config);
var oneCycle = true;

colladaLoader.load("ISSComplete1.dae", function (colladaModel) {
  colladaModel.scale = 500000;
  modelLayer.addRenderable(colladaModel);
  window.setInterval(function () {
    var coords = fetch("http://127.0.0.1:8080/getIssLocation")
      .then((res) => res.json())
      .then((data) => {
        const { latitude, longitude, altitude } = data;
        lat = latitude;
        lon = longitude;
        alt = altitude;
      })
      .catch((err) => console.log("ewwow"));

    console.log(lat, lon, alt);

    position = new WorldWind.Position(lat, lon, alt);

    // Placemark label recording
    placemark.label =
      "Placemark\n" +
      "Lat " +
      modelLayer.renderables[0].position.latitude.toPrecision(4).toString() +
      "\n" +
      "Lon " +
      modelLayer.renderables[0].position.longitude.toPrecision(5).toString();
    // ISS Model position updating
    modelLayer.renderables[0].position = position;
    wwd.redraw();
  }, 1000);
});
