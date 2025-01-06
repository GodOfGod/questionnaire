<template>
  <div class="opt-btns">
    <template v-if="isCreating">
      <el-button type="primary" @click="emits('onConfirm')"> {{ confirmText }} </el-button>
      <el-button type="danger" @click="emits('onCancel')"> {{ cancelText }} </el-button>
    </template>
    <el-button v-else type="primary" @click="emits('onCreate')">{{ createText }} </el-button>
  </div>
</template>

<script setup lang="ts">
const {
  isCreating,
  createText = '创建',
  confirmText = '保存',
  cancelText = '取消',
} = defineProps({
  isCreating: Boolean,
  createText: String,
  confirmText: String,
  cancelText: String,
})

const emits = defineEmits(['onCreate', 'onCancel', 'onConfirm'])
</script>

<style lang="less" scoped>
.opt-btns {
  width: 100%;
  display: flex;
  margin-bottom: 12px;

  .el-button {
    flex: 1;
  }
}
</style>
