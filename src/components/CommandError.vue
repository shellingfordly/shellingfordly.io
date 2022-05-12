<script lang="ts" setup>
import { ErrorType } from "@/enum";

const props = defineProps<{
  errorType: ErrorType;
  errorValue?: string;
}>();

const errorMessage = computed(() => {
  switch (props.errorType) {
    case ErrorType.Command:
      return "Command not found:";
    case ErrorType.Route:
      return "Path not found:";
    case ErrorType.Page:
      return "Page not found:";
    default:
      return "Unknown command:";
  }
});
</script>

<template>
  <div class="error">{{ errorMessage }} {{ errorValue }}</div>
</template>
