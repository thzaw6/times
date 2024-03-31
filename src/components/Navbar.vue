<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from "vue";

import Bars3Icon from "./icons/Bars3Icon.vue";
import MoonIcon from "./icons/MoonIcon.vue";
import SunIcon from "./icons/SunIcon.vue";
import { useTimeFormatStore } from "../stores/useTimeStore";

const currentTime = ref("");
const { timeFormat, isTwelveHourFormat } = useTimeFormatStore();

function getTime() {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: isTwelveHourFormat.value,
  };
  return new Date().toLocaleTimeString("en-US", options);
}

function toggleTimeFormat() {
  timeFormat.value = timeFormat.value === "12h" ? "24h" : "12h";
  currentTime.value = getTime();
}

let intervalId;
onBeforeMount(() => {
  currentTime.value = getTime();
  intervalId = setInterval(() => {
    currentTime.value = getTime();
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
      <a class="btn btn-sm btn-ghost pointer-events-none">{{ currentTime }}</a>
      <button class="btn btn-sm btn-ghost" @click="toggleTimeFormat">
        <template v-if="timeFormat === '12h'"> 12 Hr </template>
        <template v-else> 24 Hr </template>
      </button>
    </div>
  </div>
</template>
