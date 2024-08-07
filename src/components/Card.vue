<script setup>
import { ref, computed, onBeforeMount, onMounted, watch, watchEffect } from "vue";
import { DateTime } from "luxon";
import VueSlider from "vue-slider-component";

import EditIcon from "./icons/EditIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";
import { useTimeStore, useTimeFormatStore } from "../stores/useTimeStore";

const luxonNow = ref("");
const { localMinuteOfDay, luxonDateTime } = useTimeStore();
// const locationMinuteOfDay = ref(0);
const locationDateTime = ref(null);
const vueLoaded = ref(false);
const { timeFormat } = useTimeFormatStore();
const marks = ref({
  0: "00",
  360: "06",
  720: "12",
  1080: "18",
  1435: "24",
});
const emit = defineEmits(["removeLocation", "updateOffset"]);

// define the props
const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
  offset: {
    type: Number,
    required: true,
  },
});

function removeLocation() {
  emit("removeLocation", props.location);
}

function minuteOfDayToDateTime(minuteOfDay) {
  const hours = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  return DateTime.local().setZone(props.location.timezoneIdentifier).set({ hours, minutes });
}

onMounted(() => {
  vueLoaded.value = true;
});

onBeforeMount(() => {
  locationDateTime.value = DateTime.local().setZone(props.location.timezoneIdentifier).plus({ minutes: props.offset });
  // locationMinuteOfDay.value = locationDateTime.value.hour * 60 + locationDateTime.value.minute;
});

// computed
const locationMinuteOfDay = computed({
  get() {
    const dt = DateTime.local().setZone(props.location.timezoneIdentifier).plus({ minutes: props.offset });
    const mofday = Math.round(dt.hour * 60 + dt.minute);
    return dt.hour * 60 + dt.minute;
  },
  set(value) {
    if (value === 0) {
      return;
    }
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const newDateTime = DateTime.local().setZone(props.location.timezoneIdentifier).set({ hours, minutes });
    const diff = newDateTime.diff(locationDateTime.value, "minutes").minutes.toFixed(0);
    emit("updateOffset", parseInt(diff));
  }
});

const locationDateTimeFromMinuteOfDay = computed(() => {
  const hours = Math.floor(locationMinuteOfDay.value / 60);
  const minutes = locationMinuteOfDay.value % 60;
  return DateTime.local().setZone(props.location.timezoneIdentifier).set({ hours, minutes });
});

const formattedLocationTime = computed(() => {
  return locationDateTimeFromMinuteOfDay.value.toLocaleString(DateTime.TIME_SIMPLE);
});

const formattedUTCOffset = computed(() => {
  const offset = locationDateTimeFromMinuteOfDay.value.offset / 60;
  return offset > 0 ? `UTC+${offset}` : `UTC${offset}`;
});

const formattedLocationDate = computed(() => {
  return locationDateTimeFromMinuteOfDay.value.toLocaleString(DateTime.DATE_MED);
});

// watchers
// watch(locationMinuteOfDay, (newValue, oldValue) => {
//   if (!vueLoaded.value) {
//     return;
//   }
//   const hours = Math.floor(newValue / 60);
//   const minutes = newValue % 60;
//   const newDateTime = DateTime.local().setZone(props.location.timezoneIdentifier).set({ hours, minutes });
//   const diff = newDateTime.diff(locationDateTime.value, "minutes").minutes.toFixed(0);
//   // console.log(locationDateTime.value.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS))
//   // console.log(newDateTime.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS))
//   // console.log(locationMinuteOfDay.value, diff);
//   emit("updateOffset", parseInt(diff));
// });

// watchEffect(props.offset, (newValue, oldValue) => {
//   if (!vueLoaded.value) {
//     return;
//   }
//   locationDateTime.value = DateTime.local().setZone(props.location.timezoneIdentifier).plus({ minutes: newValue });
//   locationMinuteOfDay.value = locationDateTime.value.hour * 60 + locationDateTime.value.minute;
//   conosle.log(locationMinuteOfDay.value);
// });
</script>

<template>
  <div
    class="card card-compact min-h-40 w-100 bg-base-100 shadow-xl m-2 hover:border hover:border-indigo-400"
  >
    <div class="card-body">
      {{ locationMinuteOfDay }}
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
        {{ formattedLocationTime }}
      </div>
      <div class="text-sm">
        <span>{{ formattedUTCOffset }}</span> | <span>{{ formattedLocationDate }}</span>
      </div>
      <div class="mx-1 mt-3 mb-4">
        <vue-slider
          v-model="locationMinuteOfDay"
          :min="0"
          :max="1440"
          :tooltip="'none'"
          :interval="1"
          :marks="marks"
        />
      </div>
    </div>
  </div>
</template>
