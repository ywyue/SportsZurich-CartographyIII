<template>
  <div id="test">
    <div class="changeImage">
      <img :src="changeImage" width="70px" v-on:click="changeBaseLayer" />
    </div>
  </div>
</template>
<script>
import * as Cesium from "cesium";

let basemap = 1;

export default {
  data() {
    return {
      changeImage: "dark2sat.png"
    };
  },
  methods: {
    changeBaseLayer() {
      let dark = new Cesium.UrlTemplateImageryProvider({
        url:
          "https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieXVleXVhbndlbiIsImEiOiJja2pwd3puN3kyenp0MnNxb3ZtZ2NmZHFqIn0.dbwhPQFBqto1vB1x4OtREg"
      });
      let satellite = new Cesium.UrlTemplateImageryProvider({
        url:
          "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieXVleXVhbndlbiIsImEiOiJja2pwd3puN3kyenp0MnNxb3ZtZ2NmZHFqIn0.dbwhPQFBqto1vB1x4OtREg"
      });
      var imageryLayers = viewer.imageryLayers;
      var currentBaseLayer = imageryLayers.get(0);
      basemap = !basemap;
      if (basemap == true) {
        this.changeImage = "dark2sat.png";
        imageryLayers.remove(currentBaseLayer);
        viewer.imageryLayers.addImageryProvider(dark);
      } else {
        this.changeImage = "sat2dark.png";
        imageryLayers.remove(currentBaseLayer);
        viewer.imageryLayers.addImageryProvider(satellite);
      }
    }
  }
};
</script>

<style scoped>
.changeImage {
  float: right;
  margin: 0em 0em 0em 0em;
  padding: 0.7em;
}
</style>
