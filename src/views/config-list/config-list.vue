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

    <div class="create-questionnaire" :class="{ is_creating: isCreating }">
      <template v-if="isCreating">
        <el-text :style="{ fontSize: '16px', fontWeight: 'bold' }">问卷标题</el-text>
        <el-input v-model="questionnaireTitle" class="title-input"></el-input>
        <el-text :style="{ fontSize: '16px', fontWeight: 'bold' }">问题</el-text>
        <div class="questionnaire-item-list new-questionnaire">
          <el-tag
            v-for="item in newQuestionnaire"
            :key="item.field"
            closable
            effect="dark"
            type="success"
            @close="removeQuestionnaireItem(item)"
            @click="addToQuestionnaire(item)"
            >{{ item.title }}</el-tag
          >
        </div>
      </template>

      <div class="opt-btns">
        <template v-if="isCreating">
          <el-button type="primary" @click="saveNewQuestionnaire"> 保存 </el-button>
          <el-button type="danger" @click="cancelCreate"> 取消 </el-button>
        </template>
        <el-button v-else type="primary" @click="createQuestionnaire"> 创建问卷 </el-button>
      </div>

      <div class="opt-btns">
        <template v-if="isCreating">
          <el-button type="primary" @click="saveNewQuestionnaire"> 保存 </el-button>
          <el-button type="danger" @click="cancelCreate"> 取消 </el-button>
        </template>
        <el-button v-else type="primary" @click="createQuestionnaire"> 创建问题 </el-button>
      </div>
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

const questionnairItemList = ref<QuestionnaireItem[]>()

const newQuestionnaire = ref<QuestionnaireItem[]>([])

const isCreating = ref(false)

const customConfigList = ref<CustomConfigField[]>([])

const questionnaireTitle = ref('')

const showDeleteConfigDialog = ref({
  configId: '',
  show: false,
})

onMounted(() => {
  fetchConfigList()
})

/**
 * 获取配置，包括问题项和所有问卷
 */
const fetchConfigList = async () => {
  const { data } = await axios.get('/question/get_questionnaire_config')

  questionnairItemList.value = data.questionnaire_item_list
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
 * 开始创建问卷
 */
const createQuestionnaire = () => {
  // TODO: 跳转到创建问卷页面
  isCreating.value = true
}

/**
 * 添加问题项到问卷
 * @param item
 */
const addToQuestionnaire = (item: QuestionnaireItem) => {
  if (!isCreating.value) return
  // TODO: 验证该问题项是否已存在于 newQuestionnaire.value
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
 * 移除问题项
 * @param item
 */
const removeQuestionnaireItem = (item: QuestionnaireItem) => {
  newQuestionnaire.value = newQuestionnaire.value.filter((v) => v.field != item.field)
}

/**
 * 取消创建
 */
const cancelCreate = () => {
  isCreating.value = false
  newQuestionnaire.value = []
  questionnaireTitle.value = ''
}

/**
 * 保存问卷
 */
const saveNewQuestionnaire = async () => {
  if (newQuestionnaire.value.length <= 0) {
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
    config_fields: JSON.stringify(newQuestionnaire.value.map((q) => q.field)),
    title: questionnaireTitle.value,
  })
  if (data.config_fields.length) {
    customConfigList.value.push({
      ...data,
      config_fields: JSON.parse(data.config_fields),
    })
  }
  ElMessage({
    message: '创建问卷成功',
    type: 'success',
  })
  isCreating.value = false
  newQuestionnaire.value = []
  questionnaireTitle.value = ''
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

.create-questionnaire {
  margin: 20px 0;
  // border: 2px solid #67c23a;
  border-radius: 4px;
  padding: 12px;

  .title-input {
    margin: 12px 0;
  }

  .opt-btns {
    width: 100%;
    display: flex;
    margin-bottom: 12px;

    .el-button {
      flex: 1;
    }
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
