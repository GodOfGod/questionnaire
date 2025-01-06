<template>
  <div class="create-question" :class="{ 'is-creating': isCreatingQuestionnaire }">
    <div v-if="isCreatingQuestionnaire">
      <h3>问卷标题</h3>
      <el-input v-model="questionnaireTitle"></el-input>
      <h3>问题</h3>
      <div class="questionnaire-item-list">
        <el-tag
          v-for="item in newQuestionnaire"
          :key="item.field"
          closable
          effect="dark"
          type="success"
          @close="$emit('on-remove-question', item)"
          >{{ item.title }}</el-tag
        >
      </div>
    </div>

    <CreateOptBtns
      :is-creating="isCreatingQuestionnaire"
      create-text="创建问卷"
      @on-cancel="cancelCreate"
      @on-confirm="saveNewQuestionnaire"
      @on-create="createQuestionnaire"
    ></CreateOptBtns>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import CreateOptBtns from './create-opt-btns.vue'
import { ref } from 'vue'
import type { CustomConfigField, QuestionnaireItem } from '@/models/components/questionnair-item'
import axios from '@/utils/axios'

/** 正在新建的问卷标题 */
const questionnaireTitle = ref('')
/** 是否正在创建问卷 */
const isCreatingQuestionnaire = ref(false)
/** 正在新建的问卷 */
// const newQuestionnaire = ref<QuestionnaireItem[]>([])
const emits = defineEmits<{
  (e: 'on-add-config', config: CustomConfigField): void
  (e: 'on-remove-question', config: QuestionnaireItem): void
  (e: 'on-clear-new-question'): void
}>()
const { newQuestionnaire } = defineProps<{
  newQuestionnaire: QuestionnaireItem[]
}>()

/**
 * 开始创建问卷
 */
const createQuestionnaire = () => {
  // TODO: 跳转到创建问卷页面
  isCreatingQuestionnaire.value = true
}

/**
 * 取消创建
 */
const cancelCreate = () => {
  isCreatingQuestionnaire.value = false
  emits('on-clear-new-question')
  questionnaireTitle.value = ''
}

/**
 * 保存问卷
 */
const saveNewQuestionnaire = async () => {
  if (newQuestionnaire.length <= 0) {
    return
  }
  if (!questionnaireTitle.value) {
    ElMessage({
      message: '请填写问卷标题',
      type: 'warning',
    })
    return
  }
  const { data } = await axios.post('/question/create_questionnaire', {
    config_fields: JSON.stringify(newQuestionnaire.map((q) => q.field)),
    title: questionnaireTitle.value,
  })
  if (data.config_fields.length) {
    emits('on-add-config', {
      ...data,
      config_fields: JSON.parse(data.config_fields),
    })
    // customConfigList.value.push({
    //   ...data,
    //   config_fields: JSON.parse(data.config_fields),
    // })
  }
  ElMessage({
    message: '创建问卷成功',
    type: 'success',
  })
  isCreatingQuestionnaire.value = false
  emits('on-clear-new-question')
  questionnaireTitle.value = ''
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

  .questionnaire-item-list {
    min-height: 80px;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 18px;
    padding: 4px;

    .el-tag {
      margin: 8px 8px 8px 0;
    }
  }
}
</style>
