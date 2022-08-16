import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AddNewTrip from "../views/AddNewTrip.vue";
import TripView from "../views/TripView.vue";
import CurrentTrips from "../views/CurrentTrips.vue";
import PreviousTrips from "../views/PreviousTrips.vue";
import TripMap from "../views/TripMap.vue";
import LoginPage from "../views/LoginPage.vue";
import AddNewDay from "../views/AddNewDay.vue";

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
      path: "/current-trips",
      name: "currenttrips",
      component: CurrentTrips,
    },
    {
      path: "/previous-trips",
      name: "previoustrips",
      component: PreviousTrips,
    },
    {
      path: "/trips/:tripId",
      name: "tripview",
      component: TripView,
    },
    {
      path: "/trips/:tripId/map",
      name: "tripmap",
      component: TripMap,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    // {
    //   path:'/trip/:tripId/acitivites',
    //   name:'activities',
    //   component:''
    // }
    {
      path: "/trips/:tripId/add-day",
      name: "addday",
      component: AddNewDay,
    },
  ],
});

export default router;
