<script setup>
import { defineComponent, onBeforeMount, reactive } from "vue";

import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import NewCard from "./components/NewCard.vue";
import { useProvideTimeStore, useProvideTimeFormatStore } from "./stores/useTimeStore";

useProvideTimeStore(0);
useProvideTimeFormatStore("12h"); // default to 12-hour format
defineComponent({
  components: {
    Card,
    Navbar,
    NewCard,
  },
});
const userLocations = reactive([]);

function addNewLocation(location) {
  userLocations.push(location);
}

onBeforeMount(() => {
  userLocations.push({
    city: "London",
    country: "United Kingdom",
    timezoneIdentifier: "Europe/London",
    utcOffset: "UTC+0",
  });
});
</script>

<template>
  <div class="container mx-auto">
    <Navbar />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card v-for="location in userLocations" :key="location.city" :location="location" />
      <NewCard @new-location="addNewLocation" />
    </div>
  </div>
  {{ userLocations }}
</template>

<style scoped></style>
