<template>
  <div class="hidden">
    <vs-sidebar absolute hover-expand reduce v-model="active" open>
      <template #logo>
        <img src="logo.svg" />
      </template>
      <i @click="removeData">
        <vs-sidebar-item id="home">
          <template #icon>
            <i class="bx bx-map-alt"></i>
          </template>
          Base map
        </vs-sidebar-item>
      </i>
      <i @click="addSportsPoint">
        <vs-sidebar-item id="market">
          <template #icon>
            <i class="bx bx-football"></i>
          </template>
          Sports facility
        </vs-sidebar-item>
      </i>
      <i @click="addSportsLine">
        <vs-sidebar-item id="market2">
          <template #icon>
            <i class="bx bx-trip"></i>
          </template>
          Sports track
        </vs-sidebar-item>
      </i>
      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <i class="bx bx-info-circle"></i>
            </template>
            About
          </vs-sidebar-item>
        </template>
        <i @click="active2 = !active2">
          <vs-sidebar-item id="project">
            <template #icon>
              <i class="bx bx-layout"></i>
            </template>
            Project
          </vs-sidebar-item>
        </i>
        <i @click="active3 = !active3">
          <vs-sidebar-item id="author">
            <template #icon>
              <i class="bx bx-user-circle"></i>
            </template>
            Author
          </vs-sidebar-item>
        </i>
        <i @click="active4 = !active4">
          <vs-sidebar-item id="legalnotice">
            <template #icon>
              <i class="bx bx-file"></i>
            </template>
            Legal & privacy notice
          </vs-sidebar-item>
        </i>
      </vs-sidebar-group>
    </vs-sidebar>

    <vs-dialog width="550px" not-center v-model="active2">
      <template #header>
        <h4 class="not-margin">About the project</h4>
      </template>
      <div class="con-content">
        <img src="logo.svg" class="element-center" />
        <p>
          This is the final project for the lecture
          <a
            href="https://karto.ethz.ch/en/education/courses.html"
            target="_blank"
            >Cartography III</a
          >
          at ETH Zurich. The main purpose of this project is to develop an
          interesting and attractive 3D web map to encourage teenagers to go
          outdoors and help them find sports more easily. <br /><br />
          The terrain and building data in the project are provided by
          <a href="https://geovite.ethz.ch/" target="_blank">GeoVITe</a>, and
          the sports data is provided by
          <a href="https://www.stadt-zuerich.ch/geodaten/" target="_blank"
            >stadt Zurich</a
          >.<br /><br />
          Data status:<br />
          - sports facilities: Feb 14, 2019<br />
          - sports routes: July 1, 2017
        </p>
      </div>
    </vs-dialog>

    <vs-dialog width="550px" not-center v-model="active3">
      <template #header>
        <h4 class="not-margin">About me</h4>
      </template>
      <div class="con-content">
        <p>
          This website is created by Yuanwen Yue, a MSc student of Geomatics
          Engineering at ETH Zurich. <br /><br />
          If you have any questions, please contact me by
          <a href="mailto:yuayue@ethz.ch">yuayue@ethz.ch</a>.
        </p>
      </div>
    </vs-dialog>

    <vs-dialog width="550px" not-center v-model="active4">
      <template #header>
        <h4 class="not-margin">Legal & privacy notice</h4>
      </template>

      <div class="con-content">
        <p>
          Contents published on this website by the author are subject to Swiss
          copyright laws. Reproducing, editing, distribution and using outside
          the scope of the copyright law require the permission of the author.
          The commercial use of the content without permission of the author is
          prohibited.<br /><br />
          The website does not collect any user data or collect any cookies.
        </p>
      </div>
    </vs-dialog>
  </div>
</template>
<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import legend from "./overlay/LineLegendOverlay.vue";
import eventVue from "../eventVue.js";

import {
  addSportsPointGeoJSON,
  addSportsLineGeoJSON,
  removeSportsPointGeoJSON,
  removeSportsLineGeoJSON,
  remove3DModel
} from "../cesium.js";

var noti = null;
export default {
  data: () => ({
    active: "home",
    active2: false,
    active3: false,
    active4: false
  }),
  methods: {
    addSportsPoint() {
      eventVue.$emit("LinePopup", false);
      addSportsPointGeoJSON();
      remove3DModel();
      removeSportsLineGeoJSON();
      if (noti != null) {
        noti.close();
      }
      noti = null;
    },
    addSportsLine() {
      eventVue.$emit("PointPopup", false);
      if (noti == null) {
        addSportsLineGeoJSON();
        removeSportsPointGeoJSON();
        noti = this.$vs.notification({
          buttonClose: true,
          duration: "none",
          content: legend
        });
      }
    },
    removeData() {
      eventVue.$emit("PointPopup", false);
      eventVue.$emit("LinePopup", false);
      viewer.dataSources.removeAll();
      if (noti != null) {
        noti.close();
      }
      noti = null;
    }
  }
};
</script>
<style scoped>
.element-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
}
</style>
