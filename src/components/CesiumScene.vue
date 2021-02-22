<template>
  <div class="cesium-scene">
    <CesiumViewer />
    <CesiumOverlay />
  </div>
</template>

<script>
import CesiumViewer from "./CesiumViewer.vue";
import CesiumOverlay from "./CesiumOverlay.vue";

export default {
  components: {
    CesiumViewer,
    CesiumOverlay
  }
};
</script>

<style scoped></style>
