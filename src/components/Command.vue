<script lang="ts" setup>
const props = defineProps<{
  value?: string;
}>();

const searchRef = ref();
const searchValue = ref("");
const emit = defineEmits(["onEnter"]);
const isText = ref(!!props.value);

onMounted(() => {
  if (searchRef.value) {
    searchRef.value.focus();
  }
});

function onKeyup(e: any) {
  const code = e.keyCode;
  if (code === 13) {
    isText.value = true;
    emit("onEnter", searchValue.value);
  }
}
</script>

<template>
  <div class="command">
    <span class="arrow">➜</span>
    <span class="path">~</span>
    <span v-if="isText">{{ value || searchValue }}</span>
    <input
      v-else
      ref="searchRef"
      type="text"
      v-model="searchValue"
      @keyup="onKeyup"
    />
  </div>
</template>

<style scoped lang="less">
.command {
  span {
    vertical-align: middle;
  }

  .arrow {
    font-size: 12px;
    margin-right: 20px;
    color: @toolColor;
  }

  .path {
    margin-right: 10px;
    color: @linkText;
  }

  input {
    background-color: @bgColor;
    color: @commonText;
    font-size: 22px;
    font-weight: 500;
    min-width: calc(100% - 70px);
  }
}
</style>
