<template>
  <Transition>
    <div v-if="show" class="complete">
      <div class="logo-container">
        <img src="@assets/logo.png" alt="" />
        <div class="tip-text">提交成功</div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { show } = defineProps({
  show: Boolean,
})
</script>

<style lang="less" scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.3s ease;
  transform: scale(1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0);
}
.complete {
  z-index: 100;
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo-container {
    margin-bottom: 100px;
  }

  img {
    width: 300px;
    display: block;
    margin: 0 auto;
  }

  .tip-text {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #303133;
  }
}
</style>
