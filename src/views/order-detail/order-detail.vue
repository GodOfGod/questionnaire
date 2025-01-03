<template>
  <div class="main-title">订单信息</div>
  <div v-if="orderDetailList.length" class="order-detail-container">
    <div class="detail-item" v-for="item in orderDetailList" :key="item.title">
      <div class="title">{{ item.title }}</div>
      <div class="value">{{ item.value }}</div>
    </div>
  </div>

  <div class="remark">
    <el-text type="info" :style="{ fontSize: '28px' }">备注</el-text>
    <el-input type="textarea" v-model="remark" :autosize="{ minRows: 5 }"></el-input>
  </div>

  <div class="opt-btn">
    <el-button type="primary">保存</el-button>
    <el-button type="danger">删除</el-button>
    <el-button type="success">去修改</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@axios'
import type { QuestionnaireResponse } from '@/models/components/questionnair-item'
import type { QuestionnaireConfigObj } from '@/views/questionnaire/data'

const route = useRoute()
const orderInfo = ref<QuestionnaireResponse>()
const remark = ref('')

onMounted(() => {
  const query = route.params
  if (query.id) {
    fetchOrderInfo(query.id as string)
  }
})

const orderDetailList = computed(() => {
  const detailObj = JSON.parse(
    orderInfo.value?.questionnaire ?? JSON.stringify({}),
  ) as QuestionnaireConfigObj
  return Object.keys(detailObj).map((key) => {
    return {
      title: detailObj[key as keyof QuestionnaireConfigObj].title,
      value: detailObj[key as keyof QuestionnaireConfigObj].value,
    }
  })
})

const fetchOrderInfo = async (id: string) => {
  try {
    const response = await axios.get(`/question/get_questionnaire_by_id`, {
      params: { id },
    })
    orderInfo.value = response.data
    try {
      const detailObj = JSON.parse(response.data?.questionnaire ?? JSON.stringify({}))
      remark.value = detailObj?.remark ?? ''
    } catch (error) {
      console.log('Failed to parse order info:', error)
    }
  } catch (error) {
    console.error('Failed to fetch order info:', error)
  }
}
</script>

<style lang="less" scoped>
.order-detail-container {
  border: 1px solid #dcdfe6;
  margin: 20px 12px;

  .detail-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d4d7de;

    &:last-child {
      border-bottom: none;
    }

    .title {
      width: 150px;
      background-color: #f0f2f5;
      text-align: center;
      padding: 8px 12px;
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .value {
      flex: 1;
      padding: 8px 12px;
      text-align: center;
      word-break: break-all;
    }
  }
}

.remark {
  margin: 0 12px;
}

.opt-btn {
  display: flex;
  justify-content: space-between;
  margin: 20px 12px;
}
</style>
