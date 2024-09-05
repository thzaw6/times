<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
import { DateTime } from "luxon";

import locations from "../data/locations.json";
import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import NewCard from "./components/NewCard.vue";

const userLocation = locations.find((location) => location.timezoneIdentifier === DateTime.local().zoneName);
const addedLocations = reactive([]);
const customDate = ref(null);
const offset = ref(0);
const isTwelveHourFormat = ref(true);
const darkMode = ref(false);

function addNewLocation(location) {
  addedLocations.push(location);
}

function removeLocation(location) {
  const index = addedLocations.findIndex((loc) => loc.city === location.city);
  addedLocations.splice(index, 1);
}

function setTheme(isDarkMode) {
  darkMode.value = isDarkMode;
  const theme = isDarkMode ? "dark" : "light";
  document.getElementById("base-html").setAttribute("data-theme", theme);
}

function setTimeFormat(format) {
  isTwelveHourFormat.value = format === "12hr";
}

onBeforeMount(() => {
  // check if there are stored locations in local storage
  const storedLocations = JSON.parse(localStorage.getItem("locations"));
  if (storedLocations && storedLocations.length) {
    storedLocations.forEach((location) => {
      addedLocations.push(location);
    });
  } else {
    // if no stored locations, add user's current location
    const localDateTime = DateTime.local();
    locations.find((location) => {
      if (location.timezoneIdentifier === localDateTime.zoneName) {
        addedLocations.push(location);
      }
    });
  }
});

// if user location is empty, reset the offset
watch(addedLocations, (locs) => {
  if (locs.length === 0) {
    offset.value = 0;
  }
  localStorage.setItem("locations", JSON.stringify(locs));
});
</script>

<template>
  <Navbar :is-twelve-hour-format="isTwelveHourFormat" @toggle-time-format="setTimeFormat" @theme-changed="setTheme" />
  <div class="container mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        v-for="location in addedLocations"
        :key="location.city"
        :location="location"
        :dark-mode="darkMode"
        :is-twelve-hour-format="isTwelveHourFormat"
        :offset="offset"
        :user-location="userLocation"
        :shared-custom-date="customDate"
        @custom-date-set="customDate = $event"
        @remove-location="removeLocation"
        @update-offset="offset = $event"
      />
      <NewCard :locations="locations" @new-location="addNewLocation" />
    </div>
  </div>
</template>

<style scoped></style>
