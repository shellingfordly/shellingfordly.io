<script lang="ts" setup>
import Header from "./layout/Header.vue";
import Command from "./components/Command.vue";
import CommandResult from "./components/CommandResult.vue";
import CommandError from "./components/CommandError.vue";
import { useCommand } from "./hooks/useCommand";
import { ResultType } from "@/enum";
import { useStore } from "./store";

const router = useRouter();
const store = useStore();

store.setRouteMap(router.getRoutes());

console.log("store", store.routeMap);

const commandList = reactive<any[]>([]);
const handleCommand = useCommand();

function onEnter(value: string) {
  const command = handleCommand(value);
  console.log("command", command);
  if (command.type === ResultType.Page) {
    router.push(command.content.path);
  }
  commandList.push(command);
}
</script>

<template>
  <div class="layout">
    <Header />
    <Command value="ll" />
    <CommandResult :content="store.routeMap" />
    <Command @on-enter="onEnter" />
    <div v-for="command in commandList">
      <CommandResult
        v-if="
          command.type === ResultType.Route || command.type === ResultType.Help
        "
        :type="command.type"
        :content="command.content"
      />
      <CommandError
        v-else-if="command.type === ResultType.Error"
        v-bind="command"
      />
      <Command :type="command.type" :path="command.value" @on-enter="onEnter" />
    </div>
  </div>
</template>
