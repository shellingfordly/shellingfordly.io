<script lang="ts" setup>
import { useCommand } from "@/hooks/useCommand";
import { ResultType } from "@/enum";
import { useStore } from "@/store";

const router = useRouter();
const store = useStore();

store.setRouteMap(router.getRoutes());

const commandList = reactive<any[]>([]);
const handleCommand = useCommand();

function onEnter(value: string) {
  const command = handleCommand(value);
  if (command.type === ResultType.Page) {
    router.push(command.content.path);
  }
  commandList.push(command);
}
</script>

<template>
  <Command @on-enter="onEnter" />
  <template v-for="command in commandList">
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
  </template>
</template>
