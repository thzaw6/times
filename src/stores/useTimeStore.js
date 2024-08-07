import { computed, ref } from "vue";
import { createInjectionState } from "@vueuse/core";
import { DateTime } from "luxon";

const [useProvideTimeStore, useTimeStore] = createInjectionState((initalValue) => {
  const localMinuteOfDay = ref(initalValue);

  const luxonDateTime = ref(DateTime.local().startOf("day").plus({
    hours: Math.floor(localMinuteOfDay.value / 60),
    minutes:localMinuteOfDay.value
  }));

  return { localMinuteOfDay, luxonDateTime };
});

const [useProvideTimeFormatStore, useTimeFormatStore] = createInjectionState((initialValue) => {
  const timeFormat = ref(initialValue);

  const isTwelveHourFormat = computed(() => timeFormat.value === "12h");

  return { timeFormat, isTwelveHourFormat };
});

export { useProvideTimeStore, useTimeStore };
export { useProvideTimeFormatStore, useTimeFormatStore };
