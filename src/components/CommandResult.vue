<script lang="ts" setup>
import { FileType, ResultType } from "@/enum";
import { RouteItem, RouteMap } from "@/types";
import moment from "moment";
import { PropType } from "vue";

const props = defineProps({
  content: {
    type: Object as PropType<RouteMap | Record<string, string>>,
  },
  type: {
    type: Number as PropType<ResultType>,
    default: ResultType.Route,
  },
});

const deteFormat = (time) => moment(time).format("YYYY/MM/DD");
const titleClass = (type: FileType) => [
  "title",
  type === FileType.Page && "link-text",
];

const sort = (list: any[]) => list.sort((a, b) => a.index - b.index);

const list = computed(() => {
  if (!props.content) {
    return [];
  }

  if (props.type === ResultType.Help) {
    return Object.entries(props.content);
  }

  if (props.content.type === undefined) {
    return sort(Object.values(props.content));
  } else {
    return sort(Object.values(props.content.children));
  }
});

const router = useRouter();
function go(item: RouteItem) {
  item.fileType === FileType.Page && router.push(item.path);
}
</script>

<template>
  <div class="nav-bar">
    <ul class="list">
      <li class="item" v-for="(item, index) in list">
        <template v-if="type === ResultType.Route">
          <span class="file-type">{{ item.fileType }}</span>
          <span>{{ index + 1 }}</span>
          <span>{{ deteFormat(item.date) }}</span>
          <span>{{ item.key }}</span>
          <span :class="titleClass(item.fileType)" @click="go(item)">
            {{ item.name }}
          </span>
        </template>
        <template v-else-if="type === ResultType.Help">
          <span class="command">{{ item[0] }}:</span>
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
        @media screen and (max-width: 720px) {
          margin-right: 10px;
        }
      }

      .file-type {
        width: 135px;

        @media screen and (max-width: 720px) {
          width: 80px;
        }
      }

      .title {
        color: @linkText;
      }

      .link-text {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .command {
        width: 60px;
      }
    }
  }
}
</style>
