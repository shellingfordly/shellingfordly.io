<script lang="ts" setup>
import { RootRoute } from "@/contants";
import { ResultType } from "@/enum";
import { getHistoryRoute } from "@/hooks/useCommand";
import { COMMAND_HISTORY } from "@/contants";

const props = defineProps<{
  type?: ResultType;
  path?: string;
  value?: string;
}>();

const searchRef = ref();
const searchValue = ref("");
const emit = defineEmits(["onEnter"]);
const isText = ref(false);
const path = ref(RootRoute);
let history = getCommandHistory();
let index = history.length;

onMounted(async () => {
  if (searchRef.value) {
    searchRef.value.focus();
  }
  await nextTick();
  const route = getHistoryRoute();

  if ((props.type === ResultType.Route && props.path) || route) {
    path.value = props.path || (route?.key as string) || RootRoute;
  } else if (props.type === ResultType.Empty) {
    isText.value = false;
    console.log(1111)
    searchValue.value = "";
    searchRef.value.focus();
  }
});

function getCommandHistory(): string[] {
  return JSON.parse(sessionStorage.getItem(COMMAND_HISTORY) || "[]");
}

function setCommandHistory(value: string) {
  if (!value) {
    return;
  }
  const h = getCommandHistory().filter((v) => v);
  h.push(value);
  sessionStorage.setItem(COMMAND_HISTORY, JSON.stringify(h));
}

function onKeyup(e: any) {
  const keyCode = e.keyCode;

  switch (keyCode) {
    case 13:
      isText.value = true;
      setCommandHistory(searchValue.value);
      history = getCommandHistory();
      emit("onEnter", searchValue.value);
      break;
    case 38:
      searchValue.value = history[index > 0 ? --index : 0];
      break;
    case 40:
      searchValue.value = index < history.length ? history[++index] : "";
    default:
      break;
  }
}
</script>

<template>
  <div class="command">
    <span class="arrow">➜</span>
    <span class="path">{{ path }}</span>
    <span v-if="isText && (value || searchValue)">
      {{ value || searchValue }}
    </span>
    <div class="input" v-else>
      <input
        ref="searchRef"
        type="text"
        v-model="searchValue"
        @keyup="onKeyup"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.command {
  display: flex;
  align-items: center;

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

  .input {
    flex: 1;

    input {
      background-color: var(--c-bg);
      color: var(--c-text);
      font-size: 16px;
      font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
      font-weight: 500;
      width: 100%;
    }
  }
}
</style>
