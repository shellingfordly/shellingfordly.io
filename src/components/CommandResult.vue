<script lang="ts" setup>
import { RouteMap } from "@/types";
import * as moment from "moment";

const props = defineProps<{
  routeMap?: RouteMap;
}>();

const deteFormat = (time) => moment(time).format("YYYY/MM/DD");

const routeList = computed(() => {
  return Object.values(props.routeMap).sort((a, b) => +a.name - +b.name);
});

const router = useRouter();

function go(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="nav-bar">
    <ul class="list">
      <li class="item" v-for="(item, index) in routeList">
        <span>{{ item.permission }}</span>
        <span>{{ index + 1 }}</span>
        <span>{{ item.author }}</span>
        <span>{{ item.tag }}</span>
        <span>{{ deteFormat(item.date) }}</span>
        <span class="title" @click="go(item.path)">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.nav-bar {
  .list {
    .item {
      > span {
        margin-right: 30px;
      }

      .title {
        color: @linkText;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
