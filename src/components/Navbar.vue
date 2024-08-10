<script setup>
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
import { DateTime } from "luxon";

import Bars3Icon from "./icons/Bars3Icon.vue";
import MoonIcon from "./icons/MoonIcon.vue";
import SunIcon from "./icons/SunIcon.vue";

const props = defineProps({
  isTwelveHourFormat: Boolean,
});

const emit = defineEmits(["toggleTimeFormat"]);

const currentTime = ref(null);

function getCurrentTime() {
  return DateTime.local().setLocale("en-US");
}

const currentTimeFormatted = computed(() => {
  const format = props.isTwelveHourFormat ? DateTime.TIME_SIMPLE : DateTime.TIME_24_SIMPLE;
  return currentTime.value.toLocaleString(format);
});

let intervalId;
onBeforeMount(() => {
  currentTime.value = getCurrentTime();
  intervalId = setInterval(() => {
    currentTime.value = getCurrentTime();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="navbar">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <Bars3Icon />
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52"
        >
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">Timezones</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <label class="swap swap-rotate me-2">
        <input type="checkbox" class="theme-controller" value="synthwave" />
        <SunIcon />
        <MoonIcon />
      </label>
      <a class="btn btn-sm btn-ghost pointer-events-none">{{ currentTimeFormatted }}</a>
      <button class="btn btn-sm btn-ghost" @click="$emit('toggleTimeFormat')">
        <template v-if="props.isTwelveHourFormat"> 24 Hr </template>
        <template v-else> 12 Hr </template>
      </button>
    </div>
  </div>
</template>
