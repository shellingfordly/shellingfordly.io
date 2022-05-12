<script lang="ts" setup>
import { CommandType } from "@/enum";
import { commandValue } from "@/hooks/useCommand";

const props = defineProps<{
  type?: CommandType;
  path?: string;
  value?: string;
}>();

const searchRef = ref();
const searchValue = ref("");
const emit = defineEmits(["onEnter"]);
const isText = ref(!!props.value);
const path = ref("~");

onMounted(async () => {
  if (searchRef.value) {
    searchRef.value.focus();
  }
  await nextTick();
  if (props.type === CommandType.Route || commandValue.value) {
    path.value = props.path || commandValue.value;
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
    <span class="path">{{ path }}</span>
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
    max-width: calc(100% - 70px);
    min-width: calc(100% - 200px);
  }
}
</style>
