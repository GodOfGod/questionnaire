<template>
  <div class="config-list-container">
    <NavBar :show-back-icon="false" title="问卷配置"></NavBar>
    <div class="questionnaire-item-container">
      <el-text :style="{ fontSize: '28px' }">问题项</el-text>
      <div class="questionnaire-item-list">
        <el-tag
          v-for="item in questionnairItemList"
          :key="item.field"
          @click="addToQuestionnaire(item)"
          >{{ item.title }}</el-tag
        >
      </div>
    </div>

    <div class="create-questionnaire create-container">
      <CreateQuestionItem @on-confirm="fetchQuestionnaireItemList"></CreateQuestionItem>
      <CreateQuestionnaireItem
        :new-questionnaire="newQuestionnaire"
        @on-add-config="handleAddConfig"
        @on-clear-new-question="handleClearNewQuestion"
        @on-remove-question="handleRemoveQuestion"
      ></CreateQuestionnaireItem>
    </div>

    <div class="config-list">
      <div
        class="config-item"
        v-for="(item, index) in customConfigList"
        :key="item.id"
        :underline="false"
        @click="goToQuestionnaireDetail(item.id)"
      >
        <span>{{ index + 1 }}、{{ item.title }}</span>
        <div class="opts">
          <el-link type="primary" @click.stop="copyLink(item.id)">复制链接</el-link>
          <el-link type="danger" @click.stop="handleDeleteConfigItem(item.id)">删除</el-link>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showDeleteConfigDialog.show">
    <template #header>
      <span>删除</span>
    </template>
    <span>确认删除该问卷配置</span>
    <template #footer>
      <el-button type="danger" @click="handleDeleteConfigConfirm">确认</el-button>
      <el-button @click="cancelDelete">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from '@axios'
import { onMounted, ref } from 'vue'
import type { QuestionnaireItem, CustomConfigField } from '@models/components/questionnair-item'
import { ElMessage } from 'element-plus'
import NavBar from '@/components/nav-bar/nav-bar.vue'
import router from '@/router'
import CreateQuestionItem from './create-question-item.vue'
import CreateQuestionnaireItem from './create-questionnaire.vue'

/** 所有的问题项 */
const questionnairItemList = ref<QuestionnaireItem[]>()

/** 自定义的问卷列表 */
const customConfigList = ref<CustomConfigField[]>([])

/** 正在新建的问卷 */
const newQuestionnaire = ref<QuestionnaireItem[]>([])

/** 删除问卷配置提示框 */
const showDeleteConfigDialog = ref({
  configId: '',
  show: false,
})

onMounted(() => {
  fetchConfigList()
  fetchQuestionnaireItemList()
})

const fetchQuestionnaireItemList = async () => {
  const { data } = await axios.get('/question/get_questionnaire_item_list')
  questionnairItemList.value = data
}

/**
 * 获取配置，包括问题项和所有问卷
 */
const fetchConfigList = async () => {
  const { data } = await axios.get('/question/get_questionnaire_config')

  // questionnairItemList.value = data.questionnaire_item_list
  if (data.custom_config_list?.length) {
    customConfigList.value = data.custom_config_list.map(
      (item: { id: string; config_fields: string }) => ({
        ...item,
        config_fields: JSON.parse(item.config_fields),
      }),
    )
  }
}

/**
 * 跳转到问卷详情页
 * @param configId
 */
const goToQuestionnaireDetail = (configId: string) => {
  router.push({ name: 'questionnaire', query: { config_id: configId, type: 'check' } })
}

/**
 * 删除问卷配置 确认
 * @param configId
 */
const handleDeleteConfigConfirm = async () => {
  showDeleteConfigDialog.value.show = false
  const index = customConfigList.value.findIndex(
    (config) => config.id == showDeleteConfigDialog.value.configId,
  )
  if (index >= 0) {
    customConfigList.value.splice(index, 1)
  } else {
    ElMessage({
      message: '删除问卷配置失败',
      type: 'error',
    })
    return
  }
  await axios.delete('/question/delete_questionnaire_config_by_id', {
    params: {
      config_id: showDeleteConfigDialog.value.configId,
    },
  })
  ElMessage({
    message: '删除问卷配置成功',
    type: 'success',
  })
}

/**
 * 删除问卷配置项 提示
 * @param configId
 */
const handleDeleteConfigItem = (configId: string) => {
  showDeleteConfigDialog.value.configId = configId
  showDeleteConfigDialog.value.show = true
}

/**
 * 取消删除
 */
const cancelDelete = () => {
  showDeleteConfigDialog.value.show = false
  showDeleteConfigDialog.value.configId = ''
}

/**
 * 复制问卷链接
 * @param configId
 */
const copyLink = async (configId: string) => {
  try {
    const textContent = import.meta.env.PROD
      ? `${window.location.origin}/questionnaire/v1#questionnaire?config_id=${configId}`
      : `${window.location.origin}${window.location.pathname}#questionnaire?config_id=${configId}`
    await navigator.clipboard.writeText(textContent)
    ElMessage({
      message: '复制链接成功',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      message: '复制链接失败',
      type: 'error',
    })
    console.error('Error copying text to clipboard:', error)
  }
}

/**
 * 添加问题项到问卷
 * @param item
 */
const addToQuestionnaire = (item: QuestionnaireItem) => {
  // 验证该问题项是否已存在于 newQuestionnaire.value
  const exist = newQuestionnaire.value.find((v) => v.field == item.field)
  if (exist) {
    ElMessage({
      message: '该问题项已添加',
      type: 'warning',
    })
    return
  }
  newQuestionnaire.value.push(item)
}

/**
 * 添加新问卷
 * @param item
 */
const handleAddConfig = (item: CustomConfigField) => {
  customConfigList.value.push(item)
}

/**
 * 移除问题项
 * @param item
 */
const handleRemoveQuestion = (item: QuestionnaireItem) => {
  const index = newQuestionnaire.value.findIndex((v) => v.field == item.field)
  if (index >= 0) {
    newQuestionnaire.value.splice(index, 1)
  }
}

/**
 * 清空newQuestinonaire
 */
const handleClearNewQuestion = () => {
  newQuestionnaire.value = []
}
</script>

<style lang="less" scoped>
.config-list-container {
  padding: 0 12px 20px;
}

.questionnaire-item-list {
  .el-tag {
    margin: 8px 8px 8px 0;
  }
}

.is_creating {
  background-color: #409eff29;
}

.create-container {
  margin: 20px 0;
  border-radius: 4px;
}

.create-questionnaire {
  .title-input {
    margin: 12px 0;
  }

  .new-questionnaire {
    background-color: #fff;
    margin: 20px 0;
    padding: 8px;
    border-radius: 4px;
    min-height: 100px;
  }
}
.config-list {
  .config-item {
    border-bottom: 1px solid #dcdfe6;
    padding: 8px 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .opts {
      .el-link {
        margin: 0 8px;
      }
    }
  }
}
</style>
