// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");

// Add some image layers to the WorldWindow's globe.
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());
wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer(null));

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Add a placemark
var placemarkLayer = new WorldWind.RenderableLayer();
wwd.addLayer(placemarkLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0);

placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";

var position = new WorldWind.Position(55.0, -106.0, 100.0);
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

placemark.label = "Placemark\n" +
    "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
    "Lon " + placemark.position.longitude.toPrecision(5).toString();
placemark.alwaysOnTop = true;

placemarkLayer.addRenderable(placemark);

// Add a polygon
var polygonLayer = new WorldWind.RenderableLayer();
wwd.addLayer(polygonLayer);

var polygonAttributes = new WorldWind.ShapeAttributes(null);
polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
polygonAttributes.outlineColor = WorldWind.Color.BLUE;
polygonAttributes.drawOutline = true;
polygonAttributes.applyLighting = true;

var boundaries = [];
boundaries.push(new WorldWind.Position(20.0, -75.0, 700000.0));
boundaries.push(new WorldWind.Position(25.0, -85.0, 700000.0));
boundaries.push(new WorldWind.Position(20.0, -95.0, 700000.0));

var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
polygon.extrude = true;
polygonLayer.addRenderable(polygon);

// Add a COLLADA model
var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);

var position = new WorldWind.Position(10.0, -125.0, 800000.0);
var config = { dirPath: WorldWind.configuration.baseUrl + 'examples/collada_models/duck/' };

var colladaLoader = new WorldWind.ColladaLoader(position, config);
colladaLoader.load("duck.dae", function (colladaModel) {
    colladaModel.scale = 9000;
    modelLayer.addRenderable(colladaModel);
});

// Add WMS imagery
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var layerName = "MOD_LSTD_CLIM_M";

var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
    wwd.addLayer(wmsLayer);
};

var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
        " exception: " + exception);
};

// Add Atmosphere
var atmosphereLayer = new WorldWind.AtmosphereLayer();
wwd.addLayer(atmosphereLayer);

// Add Stars
var starFieldLayer = new WorldWind.StarFieldLayer();
wwd.addLayer(starFieldLayer);

// Add ISS
var issLayer = new WorldWind.RenderableLayer();
wwd.addLayer(issLayer);

var issAttributes = new WorldWind.PlacemarkAttributes(null);
issAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";
issAttributes.imageScale = 0.5;
issAttributes.imageColor = WorldWind.Color.BLUE;
issAttributes.labelAttributes.color = WorldWind.Color.BLUE;
issAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0);

var iss = new WorldWind.Placemark(new WorldWind.Position(0, 0, 0), false, issAttributes);
iss.label = "ISS";
iss.alwaysOnTop = true;
issLayer.addRenderable(iss);

var issPath = new WorldWind.Path([], new WorldWind.ShapeAttributes(null));
issPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
issPath.followTerrain = true;
issPath.extrude = true;
issPath.width = 2;
issPath.outlineColor = WorldWind.Color.BLUE;
issLayer.addRenderable(issPath);

var issOrbit = new WorldWind.Path([], new WorldWind.ShapeAttributes(null));
issOrbit.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
issOrbit.followTerrain = true;
issOrbit.extrude = true;
issOrbit.width = 2;
issOrbit.outlineColor = WorldWind.Color.BLUE;
issLayer.addRenderable(issOrbit);

var issOrbitAttributes = new WorldWind.ShapeAttributes(issOrbit.attributes);
issOrbitAttributes.interiorColor = new WorldWind.Color(0, 0, 1, 0.5);
issOrbitAttributes.drawInterior = true;
issOrbitAttributes.enableLighting = true;
issOrbit.attributes = issOrbitAttributes;

var issOrbitAltitude = 700000;
var issOrbitRadius = 1000000;
var issOrbitPeriod = 10000; // milliseconds
var issOrbitStartTime = Date.now();

var issPosition = new WorldWind.Position(0, 0, 0);
var issVelocity = new WorldWind.Vec3(0, 0, 0);

var issPathLength = 100;
var issPathPositions = new Array(issPathLength);
for (var i = 0; i < issPathLength; i++) {
    issPathPositions[i] = new WorldWind.Position(0, 0, 0);
}

var issPathIndex = 0;

var issOrbitPositions = new Array(360);
for (var i = 0; i < 360; i++) {
    var latitude = Math.asin(issOrbitRadius * Math.sin(WorldWind.Angle.DEGREES_TO_RADIANS * i) / issOrbitAltitude);
    var longitude = WorldWind.Angle.DEGREES_TO_RADIANS * i;
    issOrbitPositions[i] = new WorldWind.Position(latitude, longitude, issOrbitAltitude);
}

issOrbit.positions = issOrbitPositions;

var updateISS = function () {
    var now = Date.now();
    var elapsedSeconds = (now - issOrbitStartTime) / 1000;
    var angle = 360 * (elapsedSeconds / (issOrbitPeriod / 1000));

    var latitude = Math.asin(issOrbitRadius * Math.sin(WorldWind.Angle.DEGREES_TO_RADIANS * angle) / issOrbitAltitude);
    var longitude = WorldWind.Angle.DEGREES_TO_RADIANS * angle;

    issPosition.latitude = latitude;
    issPosition.longitude = longitude;
    issPosition.altitude = issOrbitAltitude;

    issPathPositions[issPathIndex].latitude = latitude;
    issPathPositions[issPathIndex].longitude = longitude;
    issPathPositions[issPathIndex].altitude = issOrbitAltitude;

    issPathIndex = (issPathIndex + 1) % issPathLength;
    issPath.positions = issPathPositions;

    iss.position = issPosition;
    iss.velocity = issVelocity;

    wwd.redraw();
};

setInterval(updateISS, 100);

// Add texture to the globe
var surfaceImage = new WorldWind.SurfaceImage(
    WorldWind.Sector.FULL_SPHERE,
    "https://worldwind.arc.nasa.gov/web/examples/collada_models/earth/earth.jpg");
var surfaceImageLayer = new WorldWind.RenderableLayer();
surfaceImageLayer.addRenderable(surfaceImage);
wwd.addLayer(surfaceImageLayer);

$.get(serviceAddress).done(createLayer).fail(logError);