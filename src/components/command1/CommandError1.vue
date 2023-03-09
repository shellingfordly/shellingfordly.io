<script lang="ts" setup>
import { ErrorType } from "@/enum";

const props = defineProps<{
  errorType: ErrorType;
  errorValue?: string;
}>();

const errorMessage = computed(() => {
  const value = props.errorValue;
  switch (props.errorType) {
    case ErrorType.Command:
      return `cmd: command not found: ${value}. See 'help'.`;
    case ErrorType.Route:
      return `cmd: path not found: ${value}`;
    case ErrorType.Page:
      return `cmd: page not found: ${value}`;
    case ErrorType.NotRoute:
      return `cd: not a directory: ${value}`;
    case ErrorType.NotPage:
      return `cat: not a article: ${value}`;
    case ErrorType.NotFindRouteOrPage:
      return `cd: no such file or directory: ${value}`;
    case ErrorType.NotFind:
      return `find: no find article: ${value}`;
    default:
      return `Unknown command: ${value}`;
  }
});
</script>

<template>
  <div class="error">{{ errorMessage }}</div>
</template>
