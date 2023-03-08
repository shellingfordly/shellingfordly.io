<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import moment from "moment";

const isDark = useDark();
const time = ref(moment());

const timer = setInterval(() => {
  time.value = moment();
}, 1000);

onUnmounted(() => {
  clearInterval(timer);
});

function onClick() {
  isDark.value = !isDark.value;
}
</script>

<template>
  <div class="header">
    <div class="left">
      <p>{{ time }}</p>
      <p>
        The old version of the blog:
        <a
          class="old-blog"
          href="https://shellingfordly.gitee.io/"
          target="_blank"
        >
          shellingfordly
        </a>
      </p>
    </div>
    <div class="right">
      <Icon
        v-if="isDark"
        icon="ic:baseline-light-mode"
        width="20px"
        @click="onClick"
      />
      <Icon v-else icon="ic:sharp-dark-mode" width="20px" @click="onClick" />
      <Icon icon="mdi:github" width="20px" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.old-blog {
  color: @commonText;
}

.right {
  svg {
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
