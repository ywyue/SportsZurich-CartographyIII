<template>
  <div class="cesium-scene">
    <div id="cesium" />
  </div>
</template>
<script>
import { Viewer, Rectangle } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import CesiumNavigation from "cesium-navigation-es6";
import { add3Dbuildings } from "../cesium.js";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkM2E0N2RjMi1hZjg0LTRjOWYtOTk1My1mNzYxYzk4Y2Y0ZmUiLCJpZCI6MzUzNjEsImlhdCI6MTYwMTg5ODM3Mn0.eJ8DcDAtBJRV_DZhbk0eu2wmct1syzZ-6kXZIgr-OIc";

const _cesium = {
  viewer: null
};

export default {
  data() {
    return {
      viewerObserver: null,
      viewerWidth: 0,
      viewerHeight: 0
    };
  },
  computed: {
    _cesium() {
      return _cesium;
    }
  },
  mounted() {
    if (_cesium.viewer === null) {
      this.createViewer();
      this.addNavigationPlugin();
      this.observeSize();
      this.loadScene();
    }
  },
  methods: {
    createViewer() {
      let dark = new Cesium.UrlTemplateImageryProvider({
        url:
          "https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieXVleXVhbndlbiIsImEiOiJja2pwd3puN3kyenp0MnNxb3ZtZ2NmZHFqIn0.dbwhPQFBqto1vB1x4OtREg"
      });
      _cesium.viewer = new Viewer("cesium", {
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: Cesium.IonResource.fromAssetId(168510)
        }),
        imageryProvider: dark,
        shouldAnimate: true,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fulllscreenButtond: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false
      });

      if (window) {
        window.viewer = _cesium.viewer;
      }
      viewer.scene.postProcessStages.fxaa.enabled = false;
      viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
      viewer._cesiumWidget._forceResize = true;
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        var vtxf_dpr = window.devicePixelRatio;
        // reduce the resolution moderately
        while (vtxf_dpr >= 2.0) {
          vtxf_dpr /= 2.0;
        }
        viewer.resolutionScale = vtxf_dpr;
      }
      viewer._cesiumWidget._creditContainer.style.display = "none";
    },
    addNavigationPlugin() {
      var options = {};
      options.defaultResetView = Rectangle.fromDegrees(
        8.30566,
        47.46119,
        8.73646,
        47.29432
      );
      options.enableCompass = true;
      options.enableZoomControls = true;
      options.enableDistanceLegend = true;
      options.enableCompassOuterRing = true;
      CesiumNavigation(_cesium.viewer, options);
    },
    observeSize() {
      this.viewerObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { width, height } = entry.contentRect;
          this.viewerWidth = width;
          this.viewerWidth = height;
          this.$nextTick(() => this.onResize());
        });
      });
      this.viewerObserver.observe(this.$el);
    },
    onResize() {
      if (_cesium.viewer) {
        _cesium.viewer.resize();
      }
    },
    async loadScene() {
      console.log(`START: loadScene`);
      try {
        add3Dbuildings();
      } catch (error) {
        console.log(`ERROR: loadScene`, error);
      } finally {
        console.log(`END: loadScene`);
      }
    }
  }
};
</script>

<style scoped>
.cesium-scene,
#cesium {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
