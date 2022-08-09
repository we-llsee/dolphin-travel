import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "leaflet/dist/leaflet.css";

import "./assets/main.css";

// import Vue from "vue";
// import { LMap, LTileLayer, LMarker } from "vue-leaflet";

// Vue.component("l-map", LMap);
// Vue.component("l-tile-layer", LTileLayer);
// Vue.component("l-marker", LMarker);
const app = createApp(App);

app.use(router);
app.mount("#app");
