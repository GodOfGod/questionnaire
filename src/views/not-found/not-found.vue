<template>
  <div class="not-found">
    <div class="content">
      <img src="@assets/logo.png" />
      <div class="tip-text">这是一个空页面</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.not-found {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;

    img {
      margin-bottom: 20px;
      width: 300px;
      height: 300px;
    }

    .tip-text {
      font-size: 24px;
      color: #666;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
