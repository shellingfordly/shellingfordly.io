<script lang="ts" setup>
import Header from "./layout/Header.vue";
import Command from "./components/Command.vue";
import Result from "./components/Result.vue";
import { CommandType, useCommand } from "./hooks/useCommand";
import Error from "./components/Error.vue";

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
    <Result />
    <Command @on-enter="onEnter" />
    <div v-for="command in commandList">
      <Result v-if="command.type === CommandType.Route" />
      <Error
        v-if="command.type === CommandType.ErrorCommand"
        :error-value="command.value"
      />
      <Command @on-enter="onEnter" />
    </div>
  </div>
</template>
