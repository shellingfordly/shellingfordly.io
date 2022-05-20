<script lang="ts" setup>
const route = useRoute();
const contentClass = computed(() => (route.path !== "/" ? "content" : ""));
</script>

<template>
  <Header />
  <div :class="contentClass">
    <router-view />
  </div>
</template>

<style>
.content {
  padding-top: 20px;
}
</style>
