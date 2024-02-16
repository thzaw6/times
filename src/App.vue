<script setup>
import { defineComponent } from "vue";

import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import NewCard from "./components/NewCard.vue";

defineComponent({
  components: {
    Card,
    Navbar,
    NewCard,
  },
});
</script>


<template>
  <div class="container mx-auto">
    <Navbar />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card />
      <Card />
      <Card />
      <NewCard />
    </div>
  </div>
</template>

<style scoped></style>
