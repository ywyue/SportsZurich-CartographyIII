<template>
  <div>
    <CesiumScene />
    <Sidebar />
  </div>
</template>

<script>
import CesiumScene from "./components/CesiumScene.vue";
import Sidebar from "./components/Sidebar.vue";
export default {
  name: "App",
  components: {
    CesiumScene,
    Sidebar
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
