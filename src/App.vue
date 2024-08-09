<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
import { DateTime } from "luxon";

import locations from "../data/locations.json";
import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import NewCard from "./components/NewCard.vue";
import { useProvideTimeFormatStore } from "./stores/useTimeStore";

const userLocation = locations.find((location) => location.timezoneIdentifier === DateTime.local().zoneName);
const addedLocations = reactive([]);
const offset = ref(0);

function addNewLocation(location) {
  addedLocations.push(location);
}

function removeLocation(location) {
  const index = addedLocations.findIndex((loc) => loc.city === location.city);
  addedLocations.splice(index, 1);
}

onBeforeMount(() => {
  const localDateTime = DateTime.local();
  useProvideTimeFormatStore("12h"); // default to 12-hour format
  locations.find((location) => {
    if (location.timezoneIdentifier === localDateTime.zoneName) {
      addedLocations.push(location);
    }
  });
});

// if user location is empty, reset the offset
watch(addedLocations, (newLocations) => {
  if (newLocations.length === 0) {
    offset.value = 0;
  }
});
</script>

<template>
  <div class="container mx-auto">
    <Navbar />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        v-for="location in addedLocations"
        :key="location.city"
        :location="location"
        :offset="offset"
        :user-location="userLocation"
        @remove-location="removeLocation"
        @update-offset="offset = $event"
      />
      <NewCard :locations="locations" @new-location="addNewLocation" />
    </div>
  </div>
</template>

<style scoped></style>
