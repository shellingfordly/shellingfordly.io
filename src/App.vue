<script lang="ts" setup>
import Header from "./layout/Header.vue";
import Command from "./components/Command.vue";
import CommandResult from "./components/CommandResult.vue";
import CommandError from "./components/CommandError.vue";
import { useCommand } from "./hooks/useCommand";
import { CommandType } from "@/enum";
import { useStore } from "./store";

const router = useRouter();
const store = useStore();

store.setRouteMap(router.getRoutes());

const commandList = reactive<any[]>([]);
const handleCommand = useCommand();

function onEnter(value: string) {
  const command = handleCommand(value);
  commandList.push(command);
}
</script>

<template>
  <div class="layout">
    <Header />
    <Command value="ll" />
    <CommandResult />
    <Command @on-enter="onEnter" />
    <div v-for="command in commandList">
      <CommandResult v-if="command.type === CommandType.Route" />
      <CommandError
        v-else-if="command.type === CommandType.Error"
        v-bind="command"
      />
      <Command :type="command.type" :path="command.value" @on-enter="onEnter" />
    </div>
  </div>
</template>
