<script lang="ts" setup>
import { LAST_LOGIN } from "@/contants";
import moment from "moment";

let nowLogin = moment();
const ll = localStorage.getItem(LAST_LOGIN);
const lastLogin = ll ? moment(JSON.parse(ll)) : nowLogin;

if (!ll) {
  localStorage.setItem(LAST_LOGIN, JSON.stringify(nowLogin));
}
</script>

<template>
  <div class="header">
    <p>Last Login: {{ lastLogin }}</p>
    <p>
      The old version of the Blog:
      <a
        class="old-blog"
        href="https://shellingfordly.gitee.io/"
        target="_blank"
      >
        shellingfordly
      </a>
    </p>
  </div>
</template>

<style lang="less" scoped>
.old-blog {
  color: @commonText;
}
</style>
