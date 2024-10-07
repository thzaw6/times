<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import { DateTime } from "luxon";
import VueDatePicker from "@vuepic/vue-datepicker";
import VueSlider from "vue-slider-component";
import "@vuepic/vue-datepicker/dist/main.css";

import EditIcon from "./icons/EditIcon.vue";
import ResetIcon from "./icons/ResetIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";

// props
const props = defineProps({
  sharedCustomDate: Object,
  location: Object,
  isTwelveHourFormat: Boolean,
  darkMode: Boolean,
  offset: Number,
  userLocation: Object,
});

// emits
const emit = defineEmits(["customDateSet", "removeLocation", "updateOffset"]);

// reactive data
const customDate = ref(null);
const changedLocationDateTime = ref(null);
const initialLocationDateTime = ref(null);
const hourDiffFromUserLocation = ref(null);
const marks = ref({
  0: "00",
  360: "06",
  720: "12",
  1080: "18",
  1435: "24",
});

// methods
function removeLocation() {
  emit("removeLocation", props.location);
}

function minuteOfDayToDateTime(minuteOfDay) {
  const hours = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  return DateTime.local().setLocale("en-US").setZone(props.location.timezoneIdentifier).set({ hours, minutes });
}

function resetLocationDateTime() {
  initialLocationDateTime.value = DateTime.local()
    .setLocale("en-US")
    .setZone(props.location.timezoneIdentifier)
    .plus({ minutes: props.offset });
  changedLocationDateTime.value = initialLocationDateTime.value;
  emit("updateOffset", 0);
  emit("customDateSet", null);
}

function setLocationHourDifference() {
  if (!props.userLocation || props.userLocation.timezoneIdentifier === props.location.timezoneIdentifier) {
    return;
  }
  const userLocationDateTime = DateTime.local().setZone(props.userLocation.timezoneIdentifier);
  const thisLocationDateTime = DateTime.local().setZone(props.location.timezoneIdentifier);

  const userOffset = userLocationDateTime.offset;
  const locationOffset = thisLocationDateTime.offset;

  hourDiffFromUserLocation.value = (userOffset - locationOffset) / 60; // difference in hours
}

function onSetCustomDate(value) {
  customDate.value = value;
  const newDateTime = DateTime.fromJSDate(value);
  changedLocationDateTime.value = changedLocationDateTime.value.set({
    year: newDateTime.year,
    month: newDateTime.month,
    day: newDateTime.day,
  });
  emit("customDateSet", newDateTime);
}

// lifecycle hooks
onBeforeMount(() => {
  initialLocationDateTime.value = DateTime.local()
    .setLocale("en-US")
    .setZone(props.location.timezoneIdentifier)
    .plus({ minutes: props.offset });
  changedLocationDateTime.value = initialLocationDateTime.value;
  setLocationHourDifference();
});

// computed
const locationMinuteOfDay = computed({
  get() {
    const dt = DateTime.local().setZone(props.location.timezoneIdentifier).plus({ minutes: props.offset });
    return Math.round(dt.hour * 60 + dt.minute);
  },
  set(value) {
    const newDateTime = minuteOfDayToDateTime(value);
    const diff = newDateTime.diff(initialLocationDateTime.value, "minutes").minutes.toFixed(0);
    emit("updateOffset", parseInt(diff));
  },
});

const locationDateTimeFromMinuteOfDay = computed(() => {
  return minuteOfDayToDateTime(locationMinuteOfDay.value);
});

const formattedLocationTime = computed(() => {
  const format = props.isTwelveHourFormat ? DateTime.TIME_SIMPLE : DateTime.TIME_24_SIMPLE;
  return locationDateTimeFromMinuteOfDay.value.toLocaleString(format);
});

const formattedUTCOffset = computed(() => {
  const utcOffset = locationDateTimeFromMinuteOfDay.value.offset / 60;
  return utcOffset > 0 ? `UTC+${utcOffset}` : `UTC${utcOffset}`;
});

const formattedLocationDate = computed(() => {
  return changedLocationDateTime.value.toLocaleString(DateTime.DATE_MED);
});


watch(
  () => props.offset,
  (newOffset) => {
    if (props.sharedCustomDate) {
      changedLocationDateTime.value = props.sharedCustomDate
        .setLocale("en-US")
        .setZone(props.location.timezoneIdentifier)
        .plus({ minutes: newOffset });
    } else {
      changedLocationDateTime.value = DateTime.local()
        .setLocale("en-US")
        .setZone(props.location.timezoneIdentifier)
        .plus({ minutes: newOffset });
    }
  }
);

watch(
  () => props.sharedCustomDate,
  (newDate) => {
    if (newDate) {
      changedLocationDateTime.value = changedLocationDateTime.value.set({
        year: newDate.year,
        month: newDate.month,
        day: newDate.day,
      });
    }
  }
);
</script>

<template>
  <div class="card card-compact min-h-40 w-100 bg-base-100 shadow-xl m-2 hover:border hover:border-indigo-400">
    <div class="card-body">
      <div class="flex flex-row">
        <div class="truncate">{{ location.city }}, {{ location.country }}</div>
        <button
          type="button"
          class="btn btn-xs btn-ghost ms-auto bg-dark-100 tooltip"
          title="Reset"
          data-tip="Reset"
          @click="resetLocationDateTime"
        >
          <ResetIcon />
        </button>
        <button
          type="button"
          class="btn btn-xs btn-ghost tooltip"
          title="Delete"
          data-tip="Delete"
          @click="removeLocation"
        >
          <TrashIcon />
        </button>
      </div>
      <div class="flex flex-row items-end">
        <div class="text-2xl font-bold py-0">
          {{ formattedLocationTime }}
        </div>
        <div v-if="hourDiffFromUserLocation" class="text-xs opacity-60 ms-auto">
          {{
            hourDiffFromUserLocation > 0
              ? `${hourDiffFromUserLocation} hours behind`
              : `${-hourDiffFromUserLocation} hours ahead`
          }}
        </div>
      </div>
      <div class="flex flex-row text-sm items-center">
        <span class="flex-auto whitespace-nowrap">{{ formattedUTCOffset }}</span>
        <span class="mx-1">|</span>
        <VueDatePicker
          :model-value="customDate"
          position="right"
          :offset="5"
          :enable-time-picker="false"
          :dark="darkMode"
          @update:model-value="onSetCustomDate"
        >
          <template #trigger>
            <div class="flex flex-row cursor-pointer items-center">
              {{ formattedLocationDate }}
              <EditIcon class="ms-1" />
            </div>
          </template>
        </VueDatePicker>
      </div>
      <div class="mx-1 mt-3 mb-4">
        <vue-slider v-model="locationMinuteOfDay" :min="0" :max="1439" :tooltip="'none'" :interval="1" :marks="marks" />
      </div>
    </div>
  </div>
</template>
