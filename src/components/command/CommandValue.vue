<script lang="ts" setup>
import { RootDir } from "@/contants";
import { getCommandCache, handleCommand, getPathCache } from "@/hooks/command";

const props = defineProps<{
  path: string;
  commandStr: string;
}>();

const commandRef = ref();
const isActive = ref(true);
const command = ref("");
// 输入指令 历史缓存
let commandCache: string[] = getCommandCache();
let index = commandCache.length;

const currentPath = () => {
  if (props.path) {
    if (props.path.includes("/")) return RootDir;
    return props.path;
  } else {
    const path = getPathCache().pop();
    return path || RootDir;
  }
};

watch(
  () => props.commandStr,
  (commandStr) => {
    if (props.commandStr) {
      isActive.value = false;
      command.value = commandStr;
    }
  },
  {
    immediate: true,
  }
);

function onKeyup(e: any) {
  const code = e.keyCode;
  // enter
  if (code == 13) {
    // 处理指令
    handleCommand(e.target.value);
    // 重新获取缓存
    commandCache = getCommandCache();
    // 更新 历史指令index
    index = commandCache.length;
    command.value = "";
  }
  // 方向键 上
  else if (code == 38) {
    command.value = commandCache[index > 0 ? --index : 0];
  }
  // 方向键下
  else if (code == 40) {
    command.value = index < commandCache.length ? commandCache[++index] : "";
  }
}

onMounted(() => {
  // 聚焦
  if (commandRef.value) commandRef.value.focus();

  // 滚动
  const layout = document.getElementsByClassName("layout")[0];
  if (layout) document.body.scrollTop = layout.scrollHeight;
});
</script>

<template>
  <div class="command">
    <span class="arrow"> ➜ </span>
    <span class="path"> {{ currentPath() }} </span>
    <span v-if="commandStr"> {{ commandStr }} </span>
    <input
      v-else
      ref="commandRef"
      type="text"
      v-model="command"
      @keyup="onKeyup"
    />
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

  input {
    flex: 1;
    background-color: var(--c-bg);
    color: var(--c-text);
    font-size: 16px;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    font-weight: 500;
    width: 100%;
  }
}
</style>
