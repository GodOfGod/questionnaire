<template>
  <div class="nav-bar" :class="{ shadow: showShadow }">
    <div v-if="showBackIcon" class="back-icon" @click="handleBack">
      <el-icon><ArrowLeft /></el-icon>返回
    </div>
    <div class="title-text">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { onUnmounted, ref, watch } from 'vue'
const {
  title,
  scrollerRef,
  showBackIcon = true,
} = defineProps<{
  title: string
  scrollerRef?: HTMLDivElement | null
  showBackIcon?: boolean
}>()

const showShadow = ref(false)

watch(
  () => scrollerRef,
  (newVal) => {
    console.log(newVal)

    if (newVal) {
      newVal.addEventListener('scroll', handleScroll)
    }
  },
  {
    once: true,
  },
)

onUnmounted(() => {
  if (scrollerRef) {
    scrollerRef.removeEventListener('scroll', handleScroll)
  }
})

const handleScroll = () => {
  if (scrollerRef) {
    showShadow.value = scrollerRef.scrollTop != 0
    console.log(scrollerRef.scrollTop)
  }
}

const handleBack = () => {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.shadow {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
}
.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #dcdfe6;

  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  background-color: #fff;
  z-index: 1000;

  .title-text {
    font-size: 20px;
    font-weight: bold;
  }

  .back-icon {
    position: absolute;
    left: 16px;
    display: flex;
    align-items: center;
  }
}
</style>
