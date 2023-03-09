<script lang="ts" setup>
import { commandList, handleCommand, useCommand } from "@/hooks/command";
import { ResultType } from "@/enum";
import { useStore } from "@/store";

const router = useRouter();
const store = useStore();

useCommand();

store.setRouteMap(router.getRoutes());
store.initFilesMap(router.getRoutes() as any[]);

function onEnter(value: string) {
  handleCommand(value);
}
</script>

<template>
  <Command1 @on-enter="onEnter" />
  <div></div>
</template>
