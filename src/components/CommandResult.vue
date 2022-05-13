<script lang="ts" setup>
import { ResultType } from "@/enum";
import { RouteMap } from "@/types";
import * as moment from "moment";
import { PropType } from "vue";

const props = defineProps({
  content: {
    type: Object as PropType<RouteMap>,
  },
  type: {
    type: Number as PropType<ResultType>,
    default: ResultType.Route,
  },
});

const deteFormat = (time) => moment(time).format("YYYY/MM/DD");

const list = computed(() => {
  if (!props.content) {
    return [];
  }

  if (props.type === ResultType.Help) {
    return Object.entries(props.content);
  }

  if (props.content.type === undefined) {
    return Object.values(props.content);
  } else {
    return Object.values(props.content.children);
  }
});

const router = useRouter();

function go(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="nav-bar">
    <ul class="list">
      <li class="item" v-for="(item, index) in list">
        <template v-if="type === ResultType.Route">
          <span>{{ item.fileType }}</span>
          <span>{{ index + 1 }}</span>
          <span>{{ item.author }}</span>
          <span>{{ item.tag }}</span>
          <span>{{ deteFormat(item.date) }}</span>
          <span class="title">{{ item.name }}</span>
        </template>
        <template v-else-if="type === ResultType.Help">
          <span>{{ item[0] }}:</span>
          <span>{{ item[1] }}</span>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.nav-bar {
  .list {
    .item {
      > span {
        display: inline-block;
        margin-right: 30px;
      }

      > span:first-child {
        width: 135px;
      }

      @media screen and (max-width: 720px) {
        > span {
          margin-right: 10px;
        }
      }

      .title {
        color: @linkText;
      }
    }
  }
}
</style>
