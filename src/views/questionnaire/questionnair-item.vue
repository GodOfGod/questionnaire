<template>
  <div class="questionnaire-item">
    <div class="title-container">
      <span class="title-order">{{ order }}、</span>
      <span class="title-string">{{ title }}</span>
      <span v-if="required" class="required-icon">*</span>
    </div>

    <div class="input-container">
      <el-radio-group v-if="inputType.includes('radio')" v-model="modelValue">
        <el-radio v-for="option in options" :key="option" :value="option">{{ option }}</el-radio>
      </el-radio-group>
      <el-input v-else-if="inputType.includes('text')" v-model="modelValue"></el-input>
    </div>

    <div v-if="needRemark" class="remark-container">
      <el-text type="info">备注</el-text>
      <el-input type="textarea"></el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuestionnaireItem } from '@models/components/questionnair-item'
const { order, required, title, needRemark, inputType, options } = defineProps<
  {
    order: number
  } & QuestionnaireItem
>()

const modelValue = defineModel()

// const updateValue = (value: string) => {
//   console.log(value, modelValue.value)

//   modelValue.value = value
// }
</script>

<style lang="less" scoped>
.questionnaire-item {
  margin: 12px 0;

  .title-container {
    .title-order {
      font-weight: bold;
    }

    .required-icon {
      color: red;
    }
  }

  .input-container {
    margin: 8px 0;
  }

  .remark-container {
  }
}
</style>
