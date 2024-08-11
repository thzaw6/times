<script setup>
import { ref, watch } from "vue";
import Autocomplete from "@trevoreyre/autocomplete-vue";

import CrossIcon from "./icons/CrossIcon.vue";
import PlusIcon from "./icons/PlusIcon.vue";
import SearchIcon from "./icons/SearchIcon.vue";

// props
const props = defineProps({
  locations: Array,
});

// emits
const emit = defineEmits(["newLocation"]);

// reactive data
const state = ref("idle");
const selectedLocation = ref(null);

// methods
function addLocation(location) {
  emit("newLocation", location);
  state.value = "idle";
}

function handleKeyDown(event) {
  if (event.key === "Escape") {
    state.value = "idle";
  }
}

function searchCities(input) {
  if (input.length < 1) return [];
  return props.locations
    .filter((location) => {
      return (
        location.city.toLowerCase().startsWith(input.toLowerCase()) ||
        location.country.toLowerCase().startsWith(input.toLowerCase())
      );
    })
    .slice(0, 10);
}

function getResultValue(location) {
  return `${location.city}, ${location.country}`;
}

watch(selectedLocation, (location) => {
  console.log(location.city);
});

// custom directives
const vFocus = {
  mounted(el) {
    el.focus();
  },
};
</script>

<template>
  <div
    class="card card-compact min-h-40 m-2 text-sm w-100 bg-base-100 shadow-xl border-2 border-dashed border-gray-500 hover:border-solid hover:border-indigo-400 hover:cursor-pointer"
    @click="state = 'search'"
  >
    <div class="card-body" :class="state === 'idle' ? 'flex items-center justify-center' : ''">
      <div v-if="state === 'idle'" class="flex flex-col items-center justify-center">
        <PlusIcon />
        <div class="">Add Location</div>
      </div>
      <div v-else-if="state === 'search'">
        <Autocomplete
          :search="searchCities"
          :get-result-value="getResultValue"
          @submit="addLocation"
        >
          <template
            #default="{
              inputProps,
              inputListeners,
              resultListProps,
              resultListListeners,
              results,
              resultProps,
              rootProps,
            }"
          >
            <div v-bind="rootProps" class="flex flex-col">
              <div class="dropdown">
                <label tabindex="0" class="input input-sm flex flex-row items-center">
                  <SearchIcon />
                  <input
                    v-bind="inputProps"
                    v-on="inputListeners"
                    v-focus
                    class="grow"
                    placeholder="Search for a city"
                    @keydown="handleKeyDown"
                  />
                  <button type="button" class="rounded" @click.stop="state = 'idle'">
                    <CrossIcon />
                  </button>
                </label>
                <ul
                  tabindex="0"
                  v-bind="resultListProps"
                  v-on="resultListListeners"
                  class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li
                    v-for="(result, index) in results"
                    :key="resultProps[index].id"
                    v-bind="resultProps[index]"
                  >
                    <span>{{ getResultValue(result) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </Autocomplete>
      </div>
    </div>
  </div>
</template>
