<template>
  <CompleteEnding :show="isComplete" />
  <div v-if="!isComplete" class="scroll-container" ref="containerRef">
    <div v-if="init" class="questionnaire-container" :class="{ 'is-modifying': isModifying }">
      <NavBar v-if="showNavBar" :title="navTitle" :scrollerRef="containerRef" />

      <img class="logo" src="@/assets/logo.png" alt="" />

      <div class="main-title">上门喂养信息收集</div>

      <QuestionnairItem
        v-for="(item, index) in customConfigFields"
        :order="index + 1"
        :key="index"
        v-bind="item"
        v-model="questionnaireConfig[item.field].value"
      ></QuestionnairItem>

      <template v-if="isModifying">
        <div class="remark">
          <el-text type="danger" :style="{ fontSize: '28px' }">备注</el-text>
          <el-input type="textarea" v-model="remark" :autosize="{ minRows: 5 }"></el-input>
        </div>

        <div class="custom-title">
          <el-text type="danger" :style="{ fontSize: '28px' }">标题</el-text>
          <el-input v-model="mainTitle"></el-input>
        </div>
      </template>

      <el-button class="submit-btn" type="primary" @click="handleConfirm">{{
        isModifying ? '修改' : '交给你啦'
      }}</el-button>
      <el-button v-if="isModifying" class="submit-btn" type="danger" @click="handleDelete"
        >删除</el-button
      >
      <div class="info-text">
        <el-text type="info">我们将严格保密您的信息，仅用于服务安排。</el-text>
      </div>
    </div>
  </div>

  <el-dialog v-model="showDeleteDialog">
    <template #header>
      <span>删除</span>
    </template>
    <span>确认删除该问卷</span>
    <template #footer>
      <el-button type="danger" @click="handleDeleteConfirm">确认</el-button>
      <el-button @click="showDeleteDialog = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import QuestionnairItem from './questionnair-item.vue'
import { type QuestionnaireConfigObj, generateQuestionnaireConfig } from './data'
import { ref, onMounted, computed, useTemplateRef } from 'vue'
import axios from '@axios'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import type {
  QuestionnaireItem,
  QuestionnaireResponse,
} from '@/models/components/questionnair-item'
import NavBar from '@/components/nav-bar/nav-bar.vue'
import CompleteEnding from './complete-ending.vue'
import router from '@/router'

/** 用户填写的问卷数据 */
const questionnaireConfig = ref<QuestionnaireConfigObj>({})
/** 记录原本的问卷数据，用于管理员编辑问卷时的数据回填 */
const originalConfig = ref<QuestionnaireResponse>()
const route = useRoute()
/** 管理员备注 */
const remark = ref('')
/** 管理员自定义标题 */
const mainTitle = ref('')
/** 初始化 */
const init = ref(false)
/** 问题项 */
const customConfigFields = ref<QuestionnaireItem[]>([])
/** scroll元素 */
const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
/** 问卷配置id */
const configId = ref('')
/** 问卷是否已经提交 */
const isComplete = ref(false)
/** 展示删除提示框 */
const showDeleteDialog = ref(false)

/** 导航浪标题 */
const navTitle = computed(() => {
  if (route.query.type === 'edit') {
    return '编辑'
  }
  if (route.query.type === 'check') {
    return '查看'
  }
  return ''
})

/** 是否展示导航栏 */
const showNavBar = computed(() => {
  if (route.query) {
    // 管理员查看和编辑时需要导航栏
    return ['edit', 'check'].includes(route.query.type as string)
  }
  return false
})

/** 是否管理员正在编辑 */
const isModifying = computed(() => !!route.params.id)

/** 获取问卷配置 */
const fetchQuestionnaireConfig = async (configId: string = '') => {
  try {
    const { data } = await axios.get('/question/get_questionnaire_config_by_id', {
      params: {
        config_id: configId,
      },
    })
    const configFields = JSON.parse(data.custom_config_fields) as string[]
    customConfigFields.value = configFields.map((field) =>
      data.questionnaire_item_list.find((config: QuestionnaireItem) => config.field === field),
    )

    // 编辑时不需要该配置
    if (!isModifying.value) {
      questionnaireConfig.value = generateQuestionnaireConfig(
        configFields,
        data.questionnaire_item_list,
      )
    }
  } catch (error) {
    console.log(error)
  }
}

/** 获取订单信息（用户的问卷数据） */
const fetchOrderInfo = async (id: string) => {
  try {
    const response = await axios.get(`/question/get_questionnaire_by_id`, {
      params: { id },
    })
    originalConfig.value = response.data
    const detailObj = JSON.parse(response.data?.questionnaire ?? JSON.stringify({}))
    questionnaireConfig.value = detailObj

    remark.value = detailObj?.remark ?? ''
    mainTitle.value = detailObj?.main_title ?? ''
  } catch (error) {
    console.error('Error fetching order info:', error)
  }
}

onMounted(async () => {
  const query = route.params
  if (query.id) {
    await fetchOrderInfo(query.id as string)
  }
  configId.value = (route.query.config_id ?? '') as string
  await fetchQuestionnaireConfig(route.query.config_id as string)
  init.value = true
})

/** 点击提交按钮 */
const handleConfirm = async () => {
  if (!configId.value) {
    ElMessage({
      message: '啊哦～出现了一些问题',
      type: 'error',
    })
    return
  }
  try {
    isComplete.value = true
    if (isModifying.value) {
      await handleUpdate()
    } else {
      await handleSubmit()
    }
  } catch (error) {
    isComplete.value = false
    console.log(error)
  }
}

/** 用户提交问卷 */
const handleSubmit = async () => {
  try {
    await axios.post('/question/submit_questionnaire', {
      questionnaire: JSON.stringify(questionnaireConfig.value),
      date: new Date().toLocaleDateString(),
      config_id: configId.value,
    })
    ElMessage({
      message: '提交成功',
      type: 'success',
      offset: 100,
    })
  } catch (e) {
    console.log(e)

    ElMessage({
      message: '提交失败，请直接联系我',
      type: 'error',
      offset: 100,
    })
  }
}

/** 管理员修改问卷 */
const handleUpdate = async () => {
  try {
    await axios.post('/question/update_questionnaire', {
      id: route.params.id,
      questionnaire: JSON.stringify({
        ...questionnaireConfig.value,
        remark: remark.value,
        main_title: mainTitle.value, // Add mainTitle to the questionnaire
      }),
      date: originalConfig.value?.date,
    })
    ElMessage({
      message: '修改成功',
      type: 'success',
      offset: 100,
    })
  } catch (e) {
    console.log(e)

    ElMessage({
      message: '修改失败，请直接联系我',
      type: 'error',
      offset: 100,
    })
  }
}

/** 管理员删除问卷 */
const handleDelete = async () => {
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await axios.delete(`/question/delete_questionnaire_by_id`, {
      params: {
        id: route.params.id,
      },
    })
    ElMessage({
      message: '删除成功',
      type: 'success',
      offset: 100,
    })
    // Redirect to the questionnaire list page
    router.push({
      name: 'manage-home',
    })
  } catch (error) {
    console.log(error)

    ElMessage({
      message: '删除失败，请直接联系我',
      type: 'error',
      offset: 100,
    })
  }
}
</script>

<style lang="less">
.scroll-container {
  height: 100%;
  overflow: auto;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
}
.is-modifying {
  padding-top: 60px !important;
}
.questionnaire-container {
  min-height: 100%;
  margin: 0 auto;
  padding: 20px 30px 40px 30px;
  background: rgba(255, 255, 255, 0.5);
  box-sizing: content-box;
  opacity: 0.9;

  .logo {
    width: 150px;
    margin: 0 auto;
    display: block;
  }

  .main-title {
    font-family: xiao-xiong-ruan-tang;
    margin: 0 auto;
    text-align: center;
    font-size: 32px;
    color: #ff6f61;
  }

  .submit-btn {
    margin: 20px 0 !important;
    width: 100%;
    & > span {
      font-weight: 800;
    }
  }

  .info-text {
    width: 100%;
    text-align: center;
  }
}
</style>
