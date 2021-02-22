<template>
  <div class="cesium-overlay">
    <PointPopupOverlay />
    <LinePopupOverlay />
    <ChangeBaseLayerOverlay />
  </div>
</template>
<script>
import PointPopupOverlay from "./overlay/PointPopupOverlay.vue";
import LinePopupOverlay from "./overlay/LinePopupOverlay.vue";
import ChangeBaseLayerOverlay from "./overlay/ChangeBaseLayerOverlay.vue";

export default {
  components: {
    PointPopupOverlay,
    LinePopupOverlay,
    ChangeBaseLayerOverlay
  }
};
</script>

<style scoped>
.cesium-overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>
