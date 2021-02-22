<template>
  <div id="trackPopUp" v-show="line.show">
    <div id="trackPopUpContent" class="leaflet-popup">
      <vs-card type="3">
        <template #title>
          <h3>{{ line.category }}</h3>
        </template>
        <template #img>
          <img :src="line.image" alt="" />
        </template>
        <template #text>
          <table cellspacing="8">
            <tr>
              <i class="bx bx-current-location" style="white-space:nowrap">
                Current location:</i
              >
            </tr>
            <tr>
              <font size="2" color="grey">{{ line.currentLocation }}</font>
            </tr>
            <tr>
              <i class="bx bx-stats"> Route length:</i>
            </tr>
            <tr>
              <font size="2" color="grey">{{ line.routeLength }}</font>
            </tr>
          </table>

          <vs-button
            primary
            flat
            @click="explore"
            v-show="showExplore"
            class="element-center"
          >
            <i class="bx bx-street-view"></i> Explore
          </vs-button>

          <vs-button
            primary
            flat
            @click="stop"
            v-show="showStop"
            class="element-center"
          >
            <i class="bx bx-stop-circle"></i> Stop
          </vs-button>
        </template>
      </vs-card>
      <a class="leaflet-popup-close-button" @click="popupClose()" href="#">×</a>
    </div>
  </div>
</template>
<script>
import * as Cesium from "cesium";
import eventVue from "../../eventVue.js";
import { remove3DModel, create3DModel } from "../../cesium.js";

var pickedEntityColor = Cesium.Color(0, 0, 0, 0);
var line_id = "";

export default {
  mounted() {
    this.setdata();
  },
  data() {
    return {
      line: {
        show: false,
        currentLocation: ""
      },
      showExplore: true,
      showStop: false,
      pickedEntityID: "",
      status: 0
    };
  },

  methods: {
    // set data for the popup
    setdata() {
      var _self = this;
      // close current popup when going to base map or sport routes map
      eventVue.$on("LinePopup", function() {
        if (_self.status == 1) {
          _self.popupClose();
        }
      });
      viewer.scene.globe.depthTestAgainstTerrain = true;
      var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      var cartesian = null;
      var ellipsoid = viewer.scene.globe.ellipsoid;
      handler3D.setInputAction(function(movement) {
        cartesian = viewer.scene.pickPosition(movement.position);

        var pick = viewer.scene.pick(movement.position);

        if (pick && pick.id && pick.id.polyline) {
          // close current popup when selecting another point
          if (_self.status == 1) {
            _self.popupClose();
          }
          _self.status = 1;
          remove3DModel();

          // construct the coordinate of selected point for reverse geocoding
          var cartographictest = ellipsoid.cartesianToCartographic(cartesian);
          var longitudeString = Cesium.Math.toDegrees(
            cartographictest.longitude
          );
          var latitudeString = Cesium.Math.toDegrees(cartographictest.latitude);
          var height = cartographictest.height;
          var queryPoint =
            latitudeString + "," + longitudeString + "," + height;
          _self.ReverseEncode(queryPoint);

          _self.line.show = true;

          _self.line.routeLength = pick.id.properties.length._value + "m";
          _self.pickedEntityID = pick.id._id;
          line_id = pick.id.properties.poi_id;
          pickedEntityColor = pick.id.polyline.material.color;

          // highlight selected line
          pick.id.polyline.material = new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: pickedEntityColor
          });
          pick.id.polyline.width = 30;

          if (pick.id.properties.kategorie == "mountainbike") {
            _self.line.image = "mountainbike.png";
            _self.line.category = "Mountain Bike";
          }
          if (pick.id.properties.kategorie == "vitaparcours") {
            _self.line.image = "vitaparcours.png";
            _self.line.category = "Vita Parcours";
          }
          if (pick.id.properties.kategorie == "lehrpfad") {
            _self.line.image = "lehrpfad.png";
            _self.line.category = "Educational Trail";
          }
          if (pick.id.properties.kategorie == "schlittelweg") {
            _self.line.image = "schlittelweg.png";
            _self.line.category = "Toboggan Run";
          }
          if (pick.id.properties.kategorie == "finnenbahn") {
            _self.line.image = "finnenbahn.png";
            _self.line.category = "Woodchip Track";
          }
          if (pick.id.properties.kategorie == "waldlauf") {
            _self.line.image = "waldlauf.png";
            _self.line.category = "Waldlauf";
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    ReverseEncode(queryPoint) {
      var _self = this;
      // instantiate a map and platform object
      var platform = new window.H.service.Platform({
        apikey: "UUHAawTlSxeIF5S0Tw76vTCJxUBfjgk_gcz7joXpefs"
      });

      // get an instance of the search service
      var service = platform.getSearchService();

      // call the reverse geocode method with the geocoding parameters,
      // the callback and an error callback function (called if a
      // communication error occurs)
      service.reverseGeocode(
        {
          at: queryPoint
        },
        result => {
          _self.line.currentLocation = result.items[0].address.label
            .split(",", 2)
            .join(",");
        },
        alert
      );
    },

    popupClose() {
      this.status = 0;
      this.showExplore = true;
      this.showStop = false;
      this.line.show = false;

      remove3DModel();

      var lineData = viewer.dataSources.getByName("lineLayer");
      // Restore the original style of selected polyline
      lineData[0].entities.getById(
        this.pickedEntityID
      ).polyline.material = new Cesium.PolylineOutlineMaterialProperty({
        color: pickedEntityColor,
        outlineWidth: 3,
        outlineColor: Cesium.Color.WHITE
      });
      lineData[0].entities.getById(this.pickedEntityID).polyline.width = 7;
    },
    explore() {
      this.showExplore = false;
      this.showStop = true;
      // select different CZML files according to the id of the line
      var czmlPath = "routes_czml/" + line_id + ".czml";
      create3DModel(czmlPath);
    },
    stop() {
      this.showStop = false;
      this.showExplore = true;
      remove3DModel();
    }
  }
};
</script>

<style scoped>
.element-center {
  margin: 0px auto;
}
.leaflet-popup {
  position: fixed;
  left: 50%;
  bottom: -100px;
  transform: translate(-50%, -50%);
  margin: 0 auto;
}
.leaflet-popup-close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 4px 0 0;
  text-align: center;
  width: 18px;
  height: 14px;
  font: 16px/14px Tahoma, Verdana, sans-serif;
  color: #c3c3c3;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
}
a {
  text-decoration: none;
}
</style>
