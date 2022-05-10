<script lang="ts" setup>
const searchRef = ref();

onMounted(() => {
  if (searchRef) {
    console.log("searchRef.value", searchRef.value.focus());
  }
});
</script>

<template>
  <div class="search">
    <span class="arrow">➜</span>
    <span class="path">~</span>
    <input ref="searchRef" type="text" />
  </div>
</template>

<style scoped lang="less">
.search {
  span {
    vertical-align: middle;
  }

  .arrow {
    font-size: 12px;
    margin-right: 20px;
    color: #8cf57b;
  }

  .path {
    margin-right: 10px;
    color: #8dfafd;
  }

  input {
    background-color: black;
    color: #e2e2e2;
    font-size: 16px;
    font-weight: 500;
    min-width: calc(100% - 55px);
  }
}
</style>
