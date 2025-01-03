<template>
  <div class="manage-home">
    <div class="main-component">
      <router-view></router-view>
    </div>
    <BottomNavBar :nav-list="navList"></BottomNavBar>
  </div>
</template>

<script setup lang="ts">
import BottomNavBar from '@/components/bottom-nav-bar/bottom-nav-bar.vue'
const navList = [
  {
    title: '订单',
    path: '/manage-home',
  },
  {
    title: '配置',
    path: '/manage-home/config-list',
  },
]
</script>

<style lang="less" scoped>
.manage-home {
  height: 100%;

  .main-component {
    padding-top: 60px;
    height: calc(100% - 51px);
    overflow: auto;
  }
}
</style>
