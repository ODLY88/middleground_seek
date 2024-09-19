vue
<template>
  <div class="index-page">
    <a-input-search
      v-model:value="state.searchParams.searchText"
      placeholder="请输入所需搜索内容"
      enter-button="搜 索"
      size="large"
      @search="onSearch"
    />
    <MSDivider />
    <a-tabs v-model:activeKey="state.activeKey" @change="onTabChange">
      <a-tab-pane key="Comprehensive" tab="综合">
        <ComprehensiveList />
      </a-tab-pane>
      <a-tab-pane key="Video" tab="视频">
        <VideoList />
      </a-tab-pane>
      <a-tab-pane key="Picture" tab="图片">
        <PictureList :picture-list="state.pictureList" />
      </a-tab-pane>
      <a-tab-pane key="Post" tab="文章">
        <PostList :post-list="state.postList" />
      </a-tab-pane>
      <a-tab-pane key="User" tab="用户">
        <UserList :user-list="state.userList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";
import PostList from "@/components/PostList.vue";
import UserList from "@/components/UserList.vue";
import PictureList from "@/components/PictureList.vue";
import MSDivider from "@/components/MSDivider.vue";
import { useRoute, useRouter } from "vue-router";
import msAxios from "@/plugins/msAxios";
import ComprehensiveList from "@/components/ComprehensiveList.vue";
import VideoList from "@/components/VideoList.vue";

// 使用 reactive 来管理状态
const state = reactive({
  postList: [],
  userList: [],
  pictureList: [],
  activeKey: "",
  isLastPage: false,
  searchParams: {
    type: "Comprehensive",
    searchText: "",
    pageSize: 35,
    current: 1,
  },
});

// 路由和路由器
const router = useRouter();
const route = useRoute();

// 通用的 API 请求函数
const fetchAllData = async (type: string) => {
  const searchUrl = "search/all";
  try {
    const response = await msAxios.post(searchUrl, state.searchParams);
    if (response.data) {
      state[`${type.toLowerCase()}List`] = response.data.dataPage.records; // 动态赋值
      // state.userList = response.data.userVOList ? response.data.userVOList : [];
      // state.postList = response.data.postList ? response.data.postVOList : [];
      // state.pictureList = response.data.pictureVOList
      //   ? response.data.pictureVOList
      //   : [];
      state.isLastPage = response.data.records.length === 0;
    }
  } catch (error) {
    console.error("数据请求失败:", error);
  }
};

// 加载数据
const load = () => {
  fetchAllData(state.activeKey);
};

// 处理选项卡变化
const onTabChange = (key: string) => {
  state.searchParams.type = key;
  router.push({
    path: `/${key}`,
    query: state.searchParams,
    params: { category: state.activeKey },
  });
};

// 处理搜索
const onSearch = (searchValue: string) => {
  state.searchParams.searchText = searchValue;
  state.searchParams.current = 1;
  router.push({
    name: "home",
    params: { category: state.activeKey },
    query: state.searchParams,
  });
  load();
};

// 加载下一页
// const nextPage = () => {
//   if (!state.isLastPage) {
//     state.searchParams.current += 1;
//     router.push({ path: `/${state.activeKey}`, query: state.searchParams });
//   }
// };

// 组件挂载时初始化数据
onMounted(() => {
  state.activeKey = route.params.category as string;
  state.searchParams.type = route.params.category as string;
  state.searchParams.searchText = (route.query.searchText as string) || "";
  state.searchParams.pageSize = Number(route.query.pageSize) || 35;
  state.searchParams.current = Number(route.query.current) || 1;
  load();
});

// 监视路由变化
watch(route, () => {
  state.isLastPage = false;
  load();
});
</script>
