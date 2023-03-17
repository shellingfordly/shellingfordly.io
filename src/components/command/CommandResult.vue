<script lang="ts" setup>
import {
  CommandHandleCode,
  CommandHandleType,
  FileType,
  CommandResultType,
} from "@/enum";
import { errorMessageHandle } from "@/hooks/command/errorMessage";
import { FileInfo, FilesMap, TreeFileItem, CommandInfo } from "@/types";
import moment from "moment";

const props = defineProps<{
  code: CommandHandleCode;
  type?: CommandHandleType;
  resultType?: CommandResultType;
  content?: FilesMap | TreeFileItem[] | FileInfo[] | string;
  command: CommandInfo;
  path?: string;
}>();

const deteFormat = (time: number) => moment(time).format("YYYY/MM/DD");
const titleClass = (type: FileType) => [
  "title",
  type === FileType.File && "link-text",
];

const contentList = computed(() => {
  if (props.resultType === CommandResultType.ViewDir && props.content) {
    return Object.values(props.content);
  }
  return [];
});

const message = computed(() => {
  if (props.resultType === CommandResultType.String) {
    return props.content;
  } else if (props.code > CommandHandleCode.Ok) {
    return errorMessageHandle(
      props.code,
      props.command.command,
      props.command.value
    );
  }
});

const router = useRouter();
function go(item: FileInfo) {
  if (item.type === FileType.File && item.path) {
    router.push(item.path);
  }
}
</script>

<template>
  <div class="nav-bar">
    <div v-if="message">
      {{ message }}
    </div>
    <ul v-else-if="resultType === CommandResultType.ViewDir" class="list">
      <li class="item" v-for="item in contentList">
        <span class="file-type">{{ item.type }}</span>
        <span>{{ deteFormat(item.date) }}</span>
        <span>{{ item.fileName }}</span>
        <span :class="titleClass(item.type)" @click="() => go(item)">
          {{ item.title }}
        </span>
      </li>
    </ul>
    <ul v-else-if="resultType === CommandResultType.Help">
      <li v-for="(item, key) in content">
        <span class="command">{{ key }}:</span>
        <span>{{ item }}</span>
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
        min-width: 130px;
        margin-right: 20px;
        @media screen and (max-width: 720px) {
          margin-right: 10px;
        }
      }

      .index {
        min-width: 30px;
      }

      .file-type {
        width: 135px;

        @media screen and (max-width: 720px) {
          width: 80px;
        }
      }

      .title {
        color: @linkText;
        margin-right: 0;
      }

      .link-text {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.command {
  display: inline-block;
  width: 65px;
}
</style>
