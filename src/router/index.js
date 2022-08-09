import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AddNewTrip from "../views/AddNewTrip.vue";
import TripView from "../views/TripView.vue";
import CurrentTrips from "../views/CurrentTrips.vue";
import PreviousTrips from "../views/PreviousTrips.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/add-new-trip",
      name: "addnewtrip",
      component: AddNewTrip,
    },
    {
      path: "/trip-view",
      name: "tripview",
      component: TripView,
    },
    {
      path: "/current-trips",
      name: "currenttrips",
      component: CurrentTrips,
    },
    {
      path: "/previous-trips",
      name: "previoustrips",
      component: PreviousTrips,
    },
  ],
});

export default router;
