import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createStore } from "vuex";
import "./assets/main.css";

const store = createStore({
  state() {
    return {
      loggedInUser: "GUEST",
      loggedInUserObj: {_id:'Guest',avatarURL:'https://upload.wikimedia.org/wikipedia/commons/6/60/Dolphin-logo.svg'}
    };
  },
  mutations: {
    login(state, username) {
      state.loggedInUser = username;
    },
  },
});

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
