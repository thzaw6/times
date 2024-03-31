<script setup>
import { ref, computed, onBeforeMount } from "vue";
import VueSlider from "vue-slider-component";

import EditIcon from "./icons/EditIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";
import { useTimeStore, useTimeFormatStore } from "../stores/useTimeStore";

const currentDate = ref("");
const { minuteOfDay } = useTimeStore();
const { timeFormat } = useTimeFormatStore();
const marks = ref({
  0: "00",
  360: "06",
  720: "12",
  1080: "18",
  1435: "24",
});
const emit = defineEmits(["removeLocation"]);

// define the props
const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
});

function getDate() {
  const options = {
    month: "short",
    day: "numeric",
  };
  return new Date().toLocaleDateString("en-US", options);
}

function removeLocation() {
  emit("removeLocation", props.location);
}

onBeforeMount(() => {
  const now = new Date();
  minuteOfDay.value = now.getHours() * 60 + now.getMinutes();
  currentDate.value = getDate();
});

// convert minuteOfDay to time
const time = computed(() => {
  const hours = Math.floor(minuteOfDay.value / 60);
  const minuteOfDays = minuteOfDay.value % 60;
  const period = hours < 12 || hours === 24 ? "AM" : "PM";

  if (timeFormat.value === "24h") {
    return `${hours}:${minuteOfDays < 10 ? `0${minuteOfDays}` : minuteOfDays}`;
  }
  let hoursIn12HourFormat = hours % 12;
  if (hoursIn12HourFormat === 0) {
    hoursIn12HourFormat = 12;
  }

  // Pad minuteOfDays with leading zero if less than 10
  const minuteOfDaysPadded = minuteOfDays < 10 ? `0${minuteOfDays}` : minuteOfDays;

  return `${hoursIn12HourFormat}:${minuteOfDaysPadded} ${period}`;
});
</script>

<template>
  <div
    class="card card-compact min-h-40 w-100 bg-base-100 shadow-xl m-2 hover:border hover:border-indigo-400"
  >
    <div class="card-body">
      <div class="flex flex-row">
        <div>{{ location.city }}, {{ location.country }}</div>
        <button class="btn btn-xs ms-auto bg-dark-100">
          <EditIcon />
        </button>
        <button class="btn btn-xs" @click="removeLocation">
          <TrashIcon />
        </button>
      </div>
      <div class="text-2xl font-bold">
        {{ time }}
      </div>
      <div class="text-sm">
        <span>{{ location.utcOffset }}</span> | <span>{{ currentDate }}</span>
      </div>
      <div class="mx-1 mt-3 mb-4">
        <vue-slider
          v-model="minuteOfDay"
          :min="0"
          :max="1435"
          :tooltip="'none'"
          :interval="5"
          :marks="marks"
        />
      </div>
    </div>
  </div>
</template>
