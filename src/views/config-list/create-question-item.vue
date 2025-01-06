<template>
  <div class="create-question" :class="{ 'is-creating': isCreatingQuestionItem }">
    <div v-if="isCreatingQuestionItem" class="question-container">
      <h3>问题</h3>
      <el-input v-model="newQuestion.title" placeholder="问题"></el-input>
      <h3>问题类型</h3>
      <el-select placeholder="问题类型" v-model="newQuestion.inputType">
        <el-option
          v-for="item in inputTypeMap"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <template v-if="['radio', 'checkbox'].includes(newQuestion.inputType)">
        <h3>选项</h3>
        <el-input-tag v-model="newQuestion.options" draggable clearable />
      </template>

      <div class="preview">
        <h3>预览</h3>
        <div>{{ newQuestion.title }}</div>
        <el-input
          v-if="['input', 'textarea'].includes(newQuestion.inputType)"
          :type="newQuestion.inputType"
          :min-line="4"
          v-model="previewValue.str"
        ></el-input>
        <el-radio-group v-if="newQuestion.inputType === 'radio'" v-model="previewValue.str">
          <el-radio
            v-for="(item, index) in newQuestion.options"
            :key="item + index"
            :value="item"
            >{{ item }}</el-radio
          >
        </el-radio-group>

        <el-checkbox-group v-if="newQuestion.inputType === 'checkbox'" v-model="previewValue.arr">
          <el-checkbox
            v-for="(item, index) in newQuestion.options"
            :key="item + index"
            :label="item"
            >{{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>
    <CreateOptBtns
      :is-creating="isCreatingQuestionItem"
      create-text="创建问题"
      @on-cancel="cancelCreateQuestion"
      @on-confirm="saveNewQuestionItem"
      @on-create="createQuestionItem"
    ></CreateOptBtns>
  </div>
</template>

<script setup lang="ts">
import type { QuestionnaireItem } from '@/models/components/questionnair-item'
import CreateOptBtns from './create-opt-btns.vue'
import { ref, defineEmits } from 'vue'
import { ElInput } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import axios from '@axios'
/** 新问题 */
const inputTypeMap = [
  {
    label: '文本',
    value: 'input',
  },
  {
    label: '单选',
    value: 'radio',
  },
  {
    label: '多选',
    value: 'checkbox',
  },
  {
    label: '长文本',
    value: 'textarea',
  },
]
const newQuestion = ref<QuestionnaireItem>({
  field: '',
  title: '',
  required: true,
  inputType: 'input',
  needRemark: false,
  options: [],
})

const previewValue = ref({
  str: '',
  arr: [],
})

/** 是否正在创建问题 */
const isCreatingQuestionItem = ref(false)

const emits = defineEmits(['on-confirm'])

/**
 * 开始创建问题
 */
const createQuestionItem = () => {
  isCreatingQuestionItem.value = true
}

/**
 * 保存新建问题
 */
const saveNewQuestionItem = async () => {
  isCreatingQuestionItem.value = false
  await axios.post('/question/create_new_question', {
    ...newQuestion.value,
    field: uuidv4(),
    input_type: newQuestion.value.inputType,
    options: JSON.stringify(newQuestion.value.options),
  })
  previewValue.value.arr = []
  previewValue.value.str = ''
  newQuestion.value.field = ''
  newQuestion.value.title = ''
  newQuestion.value.inputType = ''
  newQuestion.value.options = []

  emits('on-confirm')
}

/**
 * 取消创建
 */
const cancelCreateQuestion = () => {
  isCreatingQuestionItem.value = false
}
</script>

<style lang="less" scoped>
.create-question {
  width: 100%;
}

.is-creating {
  background-color: #e6a23c4f;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 12px;

  h3 {
    margin: 8px 0;
  }

  .preview {
    margin-bottom: 18px;
  }
}
</style>
