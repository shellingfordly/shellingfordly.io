<script lang="ts" setup>
import { useStore } from "@/store";
import * as moment from "moment";
import { getRouteMap } from "../contants";

const store = useStore();

const navList = [
  {
    title: "Home",
    path: "/home",
    date: new Date(),
    tag: "blog",
    author: "shellingfordly",
  },
  {
    title: "Article",
    path: "/article",
    date: new Date(),
    tag: "web",
    author: "shellingfordly",
  },
  {
    title: "Travel",
    path: "/travel",
    date: new Date(),
    tag: "travel",
    author: "shellingfordly",
  },
  {
    title: "About",
    path: "/about",
    date: new Date(),
    tag: "about",
    author: "shellingfordly",
  },
];

const deteFormat = (time) => moment(time).format("YYYY/MM/DD");

const router = useRouter();

console.log("router", router.getRoutes());

function go(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="nav-bar">
    <ul class="list">
      <li class="item" v-for="(item, index) in navList">
        <span>--rw-r-r</span>
        <span>{{ index }}</span>
        <span>{{ item.author }}</span>
        <span>{{ item.tag }}</span>
        <span>{{ deteFormat(item.date) }}</span>
        <span class="title" @click="go(item.path)">{{ item.title }}</span>
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
