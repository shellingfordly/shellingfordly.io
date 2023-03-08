<script lang="ts" setup>
const route = useRoute();
const contentClass = computed(() =>
  route.path !== "/" ? "content" : "layout"
);
</script>

<template>
  <Header />
  <div :class="contentClass">
    <router-view />
  </div>
</template>

<style lang="less">
.layout {
  width: 100%;
}
.content {
  padding-top: 20px;
  width: 70%;

  @media screen and (max-width: 720px) {
    width: 100%;
  }
}
</style>
