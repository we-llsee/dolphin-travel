<script>
import TripGallery from "../components/TripGallery.vue";

export default {
  name: "HomeView",
  components: {
    TripGallery,
  },

  methods: {
    // deleteTrip(id) {
    //   this.$emit("delete-trip", id);
    // },
  },
};
</script>

<template>
  <main>
    <TripGallery />
  </main>
</template>
