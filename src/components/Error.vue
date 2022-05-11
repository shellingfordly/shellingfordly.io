<script lang="ts" setup>
defineProps<{ errorValue: string }>();
</script>

<template>
  <div class="error">command not found: {{ errorValue }}</div>
</template>

<style scoped lang="less"></style>
