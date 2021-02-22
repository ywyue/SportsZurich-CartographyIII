<template>
  <div id="trackPopUp" v-show="point.show">
    <div id="trackPopUpContent" class="leaflet-popup">
      <a class="leaflet-popup-close-button" @click="popupClose()" href="#">×</a>
      <div class="leaflet-popup-content-wrapper">
        <div
          id="trackPopUpLink"
          class="leaflet-popup-content"
          style="max-width: 600px;"
        >
          <table cellspacing="8">
            <tr>
              <td><i class="bx bx-home"></i></td>
              <td>{{ point.name }}</td>
            </tr>
            <tr>
              <td><i class="bx bx-map"></i></td>
              <td>{{ point.address }}</td>
            </tr>
            <tr>
              <td><i class="bx bx-phone"></i></td>
              <td>{{ point.telephone }}</td>
            </tr>
            <tr>
              <td><i class="bx bx-envelope"></i></td>
              <td>{{ point.email }}</td>
            </tr>
            <tr>
              <td><i class="bx bx-world"></i></td>
              <td><a :href="point.website" target="_blank">Website</a></td>
              <td>
                <a :href="point.zvvlink" target="_blank"
                  ><img src="zvv.png" width="50"
                /></a>
              </td>
            </tr>
          </table>

          <vs-button
            primary
            flat
            :active="active == 4"
            @click="selectOrigin"
            v-show="showGoButton"
            class="element-center"
          >
            <i class="bx bx-navigation"></i> Go There
          </vs-button>
          <table v-show="showTravelMode" class="element-center" cellspacing="8">
            <tr>
              <td>
                <vs-button
                  circle
                  icon
                  primary
                  flat
                  :active="active == 1"
                  @click="Routing('car')"
                  ><i class="bx bx-car"></i
                ></vs-button>
              </td>
              <td>
                <vs-button
                  circle
                  icon
                  primary
                  flat
                  :active="active == 2"
                  @click="Routing('publicTransport')"
                  ><i class="bx bx-train"></i
                ></vs-button>
              </td>
              <td>
                <vs-button
                  circle
                  icon
                  primary
                  flat
                  :active="active == 3"
                  @click="Routing('pedestrian')"
                  ><i class="bx bx-walk"></i
                ></vs-button>
              </td>
            </tr>
          </table>

          <table cellspacing="8" v-show="showTravelDetail">
            <tr>
              <td><i class="bx bx-stats"> Total distance:</i></td>
              <td>
                <font size="3" color="grey">{{ totalDistance }}</font>
              </td>
            </tr>
            <tr>
              <td><i class="bx bx-time"> Travel Time:</i></td>
              <td>
                <font size="3" color="grey">{{ travelTime }}</font>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Cesium from "cesium";
import eventVue from "../../eventVue.js";
export default {
  mounted() {
    this.setdata();
  },
  data() {
    return {
      point: {
        show: false,
        name: ""
      },
      active: 0,
      origin: "",
      destination: "",
      pickedEntityIcon: "",
      pickedEntityID: "",
      totalDistance: "",
      travelTime: "",
      showTravelDetail: false,
      showTravelMode: false,
      showGoButton: true,
      status: 0
    };
  },

  methods: {
    // set data for the popup
    setdata() {
      var _self = this;
      // close current popup when going to base map or sport routes map
      eventVue.$on("PointPopup", function() {
        if (_self.status == 1) {
          _self.popupClose();
        }
      });
      viewer.scene.globe.depthTestAgainstTerrain = true;
      var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler3D.setInputAction(function(movement) {
        var pick = viewer.scene.pick(movement.position);

        if (pick && pick.id && pick.id.billboard) {
          // close current popup when selecting another point
          if (_self.status == 1) {
            _self.popupClose();
          }

          _self.status = 1;
          _self.pickedEntityIcon = pick.id.billboard.image._value;
          _self.pickedEntityID = pick.id._id;
          _self.point.show = true;
          _self.point.name = pick.id.name;
          _self.point.address = pick.id.properties.adresse;
          _self.point.telephone = pick.id.properties.tel;
          _self.point.email = pick.id.properties.mail;
          _self.point.website = pick.id.properties.www;
          _self.point.zvvlink = pick.id.properties.zvv_link;

          // Change the image of selected billboard
          pick.id.billboard.image = "selected.png";
          pick.id.billboard.scale = 0.25;

          // construct the coordinate of end point for routing
          var cartographic = Cesium.Cartographic.fromCartesian(
            pick.id.position._value
          );
          var lon = Cesium.Math.toDegrees(cartographic.longitude);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          _self.destination = lat + "," + lon;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    selectOrigin() {
      this.active = 4;
      this.$vs.notification({
        icon: "<i class='bx bx-target-lock' ></i>",
        color: "primary",
        position: "bottom-center",
        title: "Choose a starting point",
        text: `Use the mouse to click on the map to select a starting point`
      });

      viewer._container.style.cursor = "crosshair";
      var _self = this;
      var cartesian = null;
      var ellipsoid = viewer.scene.globe.ellipsoid;
      viewer.scene.globe.depthTestAgainstTerrain = true;
      var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler3D.setInputAction(function(movement) {
        var pick = viewer.scene.pick(movement.position);
        // cancel the selection when clicking another sports facility
        if (pick && pick.id && pick.id.billboard) {
          viewer._container.style.cursor = "default";
        } else {
          cartesian = viewer.scene.pickPosition(movement.position);
          // add a new billboard where the user clicks
          viewer.entities.add({
            id: "startPoint",
            name: "testpoint",
            position: cartesian,
            billboard: {
              image: "start.png",
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              scale: 0.25,
              // scale the billboard by distance
              scaleByDistance: new Cesium.NearFarScalar(1.5e1, 1.5, 1.0e5, 0.0)
            }
          });

          viewer._container.style.cursor = "default";
          _self.showGoButton = false;
          _self.showTravelMode = true;
          _self.$vs.notification({
            icon: "<i class='bx bx-trip' ></i>",
            color: "primary",
            position: "bottom-center",
            title: "Choose a travel mode",
            text: ``
          });
          // construct the coordinate of starting point for routing
          var cartographictest = ellipsoid.cartesianToCartographic(cartesian);
          var longitudeString = Cesium.Math.toDegrees(
            cartographictest.longitude
          );
          var latitudeString = Cesium.Math.toDegrees(cartographictest.latitude);
          _self.origin = latitudeString + "," + longitudeString;
        }
        handler3D.destroy();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    Routing(mode) {
      if (mode == "car") {
        this.active = 1;
      } else if (mode == "publicTransport") {
        this.active = 2;
      } else if (mode == "pedestrian") {
        this.active = 3;
      }
      // instantiate a map and platform object
      const platform = new window.H.service.Platform({
        apikey: "UUHAawTlSxeIF5S0Tw76vTCJxUBfjgk_gcz7joXpefs"
      });
      const H = window.H;
      const request = {
        mode: "fastest;" + mode,
        waypoint0: "geo!" + this.origin,
        waypoint1: "geo!" + this.destination,
        representation: "display"
      };
      //Initialize routing service
      const router = platform.getRoutingService();
      router.calculateRoute(request, response => {
        //Parse the route's shape
        const shape = response.response.route[0].shape.map(x => x.split(","));
        const linestring = new H.geo.LineString();
        shape.forEach(s => linestring.pushLatLngAlt(s[1], s[0]));

        //Create a polyline with the shape
        if (viewer.entities.getById("routingLine")) {
          viewer.entities.removeById("routingLine");
        }

        var routeLine = viewer.entities.add({
          id: "routingLine",
          name: "Routing line on terrain",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(linestring.X),
            width: 30,
            clampToGround: true
          }
        });

        // Set different styles for the polyline according to the travel mode
        if (mode == "car") {
          routeLine.polyline.material = new Cesium.PolylineGlowMaterialProperty(
            {
              glowPower: 0.1,
              color: Cesium.Color.BLUE.withAlpha(0.9)
            }
          );
        } else if (mode == "publicTransport") {
          routeLine.polyline.material = new Cesium.PolylineGlowMaterialProperty(
            {
              glowPower: 0.1,
              color: Cesium.Color.GOLDENROD.withAlpha(0.9)
            }
          );
        } else if (mode == "pedestrian") {
          routeLine.polyline.material = new Cesium.PolylineGlowMaterialProperty(
            {
              glowPower: 0.1,
              color: Cesium.Color.LIMEGREEN.withAlpha(0.9)
            }
          );
        }
        routeLine.polyline.classificationType =
          Cesium.ClassificationType.TERRAIN;
        // Parse the travel length and time
        var leg = response.response.route[0].leg[0];
        let duration = 0;
        let distance = 0;
        leg.maneuver.forEach(maneuver => {
          distance += maneuver.length;
          duration += maneuver.travelTime;
        });

        this.showTravelDetail = true;
        this.totalDistance = distance + " m";
        this.travelTime = duration.toMMSS();
      });
      Number.prototype.toMMSS = function() {
        return Math.floor(this / 60) + " minutes " + (this % 60) + " seconds";
      };
    },

    popupClose() {
      this.status = 0;
      this.active = 0;
      this.point.show = false;
      this.showTravelDetail = false;
      this.showTravelMode = false;
      this.showGoButton = true;
      var pointData = viewer.dataSources.getByName("pointLayer");
      // Restore the original style of selected billboard
      pointData[0].entities.getById(
        this.pickedEntityID
      ).billboard.image = this.pickedEntityIcon;
      pointData[0].entities.getById(this.pickedEntityID).billboard.scale = 0.25;
      // remove the selected start point
      if (viewer.entities.getById("startPoint")) {
        viewer.entities.removeById("startPoint");
      }
      // remove the routing routes
      if (viewer.entities.getById("routingLine")) {
        viewer.entities.removeById("routingLine");
      }
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
  text-align: center;
  bottom: 5%;
  right: 2%;
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
.leaflet-popup-content-wrapper {
  text-align: center;
  max-height: 600px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  padding: 1px;
  text-align: left;
  border-radius: 12px;
}
.leaflet-popup-content {
  margin: 13px 19px;
  line-height: 1.4;
}
a {
  text-decoration: none;
}
</style>
