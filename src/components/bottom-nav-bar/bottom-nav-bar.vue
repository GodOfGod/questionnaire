<template>
  <div class="bottom-nav-bar">
    <div class="nav-item" v-for="item in navList" :key="item.path" @click="handleClick(item.path)">
      {{ item.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

const { navList } = defineProps<{
  navList: Array<{
    title: string
    path: string
  }>
}>()

const handleClick = (path: string) => {
  router.push({
    path,
  })
}
</script>

<style lang="less" scoped>
.bottom-nav-bar {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #dcdfe6;

  & > .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    border-right: 1px solid #dcdfe6;
    height: 100%;
    align-items: center;
  }

  &:last-child {
    border-right: none;
  }
}
</style>
