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

<style lang="less">
.content {
  padding-top: 20px;
  width: 70%;
  margin: auto;

  @media screen and (max-width: 720px) {
    width: 100%;
  }
}
</style>
