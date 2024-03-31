<script setup>
import { onBeforeMount, reactive } from "vue";
import { DateTime } from "luxon";

import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import NewCard from "./components/NewCard.vue";
import locations from "../data/locations.json";
import { useProvideTimeStore, useProvideTimeFormatStore } from "./stores/useTimeStore";

useProvideTimeStore(0);
useProvideTimeFormatStore("12h"); // default to 12-hour format
const userLocations = reactive([]);

function addNewLocation(location) {
  userLocations.push(location);
}

function removeLocation(location) {
  const index = userLocations.findIndex((loc) => loc.city === location.city);
  userLocations.splice(index, 1);
}

onBeforeMount(() => {
  const zoneIdentifier = DateTime.now().zoneName;
  locations.find((location) => {
    if (location.timezoneIdentifier === zoneIdentifier) {
      userLocations.push(location);
    }
  });
});
</script>

<template>
  <div class="container mx-auto">
    <Navbar />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        v-for="location in userLocations"
        :key="location.city"
        :location="location"
        @remove-location="removeLocation"
      />
      <NewCard :locations="locations" @new-location="addNewLocation" />
    </div>
  </div>
</template>

<style scoped></style>
