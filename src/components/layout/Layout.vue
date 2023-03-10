<script lang="ts" setup>
import { RootDir } from "@/contants";
import { CommandResultType } from "@/enum";
import {
  commandResultList,
  getPathCache,
  handleCommand,
  useCommand,
} from "@/hooks/command";
import { useStore } from "@/store";

const router = useRouter();
const store = useStore();

const resultList = computed(() => commandResultList?.value || []);

store.initFilesMap(router.getRoutes() as any[]);

useCommand();

function onEnter(value: string) {
  handleCommand(value);
}
</script>

<template>
  <CommandValue v-if="!resultList.length" @on-enter="onEnter" />
  <div v-for="result in resultList">
    <CommandValue :path="result.path" :commandStr="result.command.original" />
    <commandResult v-bind="result" />
  </div>
  <CommandValue v-if="resultList.length" @on-enter="onEnter" />
</template>
