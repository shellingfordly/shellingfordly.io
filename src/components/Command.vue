<script lang="ts" setup>
import { RootRoute } from "@/contants";
import { ResultType } from "@/enum";
import { getHistoryRoute } from "@/hooks/useCommand";

const props = defineProps<{
  type?: ResultType;
  path?: string;
  value?: string;
}>();

const searchRef = ref();
const searchValue = ref("");
const emit = defineEmits(["onEnter"]);
const isText = ref(!!props.value);
const path = ref(RootRoute);

onMounted(async () => {
  if (searchRef.value) {
    searchRef.value.focus();
  }
  await nextTick();
  const route = getHistoryRoute();

  if ((props.type === ResultType.Route && props.path) || route) {
    path.value = props.path || (route.name as string) || RootRoute;
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
