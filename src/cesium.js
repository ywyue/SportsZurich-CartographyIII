import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

export function add3Dbuildings() {
  var buildingAssetIds = [
    168589,
    172528,
    172530,
    172536,
    172539,
    181476,
    186312,
    186324,
    186328,
    186332,
    189273,
    186336,
    186337,
    189276,
    189279,
    189283
  ];
  var assetId;

  for (assetId of buildingAssetIds) {
    viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(assetId)
      })
    );
  }
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(8.5410422, 47.3744489, 10000)
  });
}

export async function addSportsPointGeoJSON() {
  var len = viewer.dataSources.length;
  var layers = [];
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      layers.push(viewer.dataSources.get(i)._name);
    }
  }
  // check if pointLayer exists
  if (layers.indexOf("pointLayer") == -1) {
    const geoJSONURL = await Cesium.IonResource.fromAssetId(250852);
    const pointLayer = await Cesium.GeoJsonDataSource.load(geoJSONURL, {
      clampToGround: true
    });
    const dataSource = await viewer.dataSources.add(pointLayer);
    viewer.flyTo(dataSource);
    pointLayer._name = "pointLayer";
    // different kinds of sports facilities are symbolized by different billboards
    for (const entity of dataSource.entities.values) {
      entity.billboard.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
      if (
        entity.properties.kategorie == "Schulschwimmanlage" ||
        entity.properties.kategorie == "Planschbecken" ||
        entity.properties.kategorie == "Hallenbad" ||
        entity.properties.kategorie == "Freibad" ||
        entity.properties.kategorie == "Flussbad" ||
        entity.properties.kategorie == "Seebad"
      ) {
        entity.billboard.image = "swimming.png";
      } else if (entity.properties.kategorie == "Fussballplatz") {
        entity.billboard.image = "soccer.png";
      } else if (entity.properties.kategorie == "Tennisplatz") {
        entity.billboard.image = "tennis.png";
      } else if (
        entity.properties.kategorie == "Zürifit Anlagen" ||
        entity.properties.kategorie == "Stadion" ||
        entity.properties.kategorie == "Sporthalle" ||
        entity.properties.kategorie == "Sportgarderobe"
      ) {
        entity.billboard.image = "fit.png";
      } else if (entity.properties.kategorie == "Eisbahn") {
        entity.billboard.image = "skate.png";
      } else if (entity.properties.kategorie == "Skateranlage") {
        entity.billboard.image = "skateboard.png";
      } else if (entity.properties.kategorie == "Bike-Park") {
        entity.billboard.image = "bike.png";
      } else if (entity.properties.kategorie == "Beachvolleyball") {
        entity.billboard.image = "volley.png";
      }
      entity.billboard.scale = 0.25;
      // scale the billboard by distance
      entity.billboard.scaleByDistance = new Cesium.NearFarScalar(
        1.5e1,
        1.5,
        1.0e5,
        0.0
      );
    }
  }
}

export async function addSportsLineGeoJSON() {
  var len = viewer.dataSources.length;
  var layers = [];
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      layers.push(viewer.dataSources.get(i)._name);
    }
  }
  // check if lineLayer exists
  if (layers.indexOf("lineLayer") == -1) {
    const geoJSONURL = await Cesium.IonResource.fromAssetId(247997);
    const lineLayer = await Cesium.GeoJsonDataSource.load(geoJSONURL, {
      clampToGround: true
    });
    const dataSource = await viewer.dataSources.add(lineLayer);
    viewer.flyTo(dataSource);
    lineLayer._name = "lineLayer";
    // different kinds of sports routes are symbolized by different colored lines
    for (const entity of dataSource.entities.values) {
      entity.polyline.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
      if (entity.properties.kategorie == "mountainbike") {
        entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.BLUE,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE
        });
      } else if (entity.properties.kategorie == "vitaparcours") {
        entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.ORANGERED,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE
        });
      } else if (entity.properties.kategorie == "lehrpfad") {
        entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.GREEN,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE
        });
      } else if (entity.properties.kategorie == "schlittelweg") {
        entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.PINK,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE
        });
      } else if (entity.properties.kategorie == "finnenbahn") {
        entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.PURPLE,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE
        });
      } else if (entity.properties.kategorie == "waldlauf") {
        entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.ORANGE,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE
        });
      }
      entity.polyline.width = 7;
    }
  }
}

export function removeSportsPointGeoJSON() {
  var len = viewer.dataSources.length;
  // remove pointLayer
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      var dataSource = viewer.dataSources.get(i);
      if (dataSource._name && dataSource._name == "pointLayer") {
        viewer.dataSources.remove(dataSource);
      }
    }
  }
  // remove the selected start point
  if (viewer.entities.getById("startPoint")) {
    viewer.entities.removeById("startPoint");
  }
  // remove the routing routes
  if (viewer.entities.getById("routingLine")) {
    viewer.entities.removeById("routingLine");
  }
}

export function removeSportsLineGeoJSON() {
  var len = viewer.dataSources.length;
  // remove lineLayer
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      var dataSource = viewer.dataSources.get(i);
      if (dataSource._name && dataSource._name == "lineLayer") {
        viewer.dataSources.remove(dataSource);
      }
    }
  }
}

export function remove3DModel() {
  var len = viewer.dataSources.length;
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      var dataSource = viewer.dataSources.get(i);
      if (dataSource._name && dataSource._name == "3dModelLayer") {
        viewer.dataSources.remove(dataSource);
      }
    }
  }
}

export function create3DModel(czmlFilePath) {
  var len = viewer.dataSources.length;
  var layers = [];
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      layers.push(viewer.dataSources.get(i)._name);
    }
  }
  // check if 3dModelLayer exists
  if (layers.indexOf("3dModelLayer") == -1) {
    var entity;
    var modelLayer = new Cesium.CzmlDataSource();
    viewer.dataSources.add(modelLayer);
    modelLayer._name = "3dModelLayer";
    var czmlPath = czmlFilePath;
    // model animation using CZML file
    modelLayer.process(czmlPath).then(function() {
      entity = modelLayer.entities.getById("CesiumMan");
      viewer.trackedEntity = entity;
      entity.model.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
    });
  }
}
