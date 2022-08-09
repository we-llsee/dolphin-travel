import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHatWizard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "./assets/main.css";
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
library.add(faHatWizard);

app.use(router);
app.mount("#app");
