<script lang="ts" setup>
import { RootDir } from "@/contants";
import { CommandHandleCode } from "@/enum";
import { getCommandCache, handleCommand, getPathCache } from "@/hooks/command";

const emit = defineEmits(["onEnter"]);
const props = defineProps<{
  code: CommandHandleCode;
  path: string;
}>();

const commandRef = ref();
const isActive = ref(true);
const command = ref("");
let commandCache: string[] = [];
let index = -1;

const currentPath = computed(() => {
  if (props.path) return props.path;
  const paths = getPathCache();
  if (paths.length) {
    return paths[paths.length - 1];
  } else {
    return RootDir;
  }
});

watch(
  () => props.code,
  () => {
    if (props.code >= 0) {
      isActive.value = false;
    }
  }
);

function onKeyup(e: any) {
  const key = e.key;
  // enter
  if (key === "Enter") {
    // 处理指令
    handleCommand(e.target.value);
    // 重新获取缓存
    commandCache = getCommandCache();
    // 更新 历史指令index
    index = commandCache.length;
    isActive.value = false;
  }
  // 方向键 上
  else if (key === "ArrowUp") {
    command.value = commandCache[index > 0 ? --index : 0];
  }
  // 方向键下
  else if (key === "ArrowDown") {
    command.value = index < commandCache.length ? commandCache[++index] : "";
  }
}

onMounted(() => {
  // 聚焦
  if (commandRef.value) {
    commandRef.value.focus();
  }
});
</script>

<template>
  <div class="command">
    <span class="arrow"> ➜ </span>
    <span class="path"> {{ currentPath }} </span>
    <span v-if="!isActive"> {{ command }} </span>
    <div v-else class="input">
      <input ref="commandRef" type="text" v-model="command" @keyup="onKeyup" />
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
