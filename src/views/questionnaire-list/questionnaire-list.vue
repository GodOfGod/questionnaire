<template>
  <div class="main-title">订单信息</div>
  <div class="list-container">
    <ListItem
      v-for="(order, index) in questionnaires"
      :key="order.id"
      :order="order"
      :index="index"
    />
  </div>
</template>

<script setup lang="ts">
import axios from '@axios'
import { ref, onMounted } from 'vue'
import type { QuestionnaireResponse } from '@models/components/questionnair-item'
import ListItem from './list-item.vue'

const questionnaires = ref<QuestionnaireResponse[]>([])
const getQuestionnaires = async () => {
  try {
    const { data } = await axios.get('/question/get_all_questionnaire')
    questionnaires.value = data
  } catch (error) {
    console.error('Error fetching questionnaires:', error)
  }
}
onMounted(async () => {
  getQuestionnaires()
})
</script>

<style lang="less" scoped>
.main-title {
  font-size: 20px;
  font-weight: bold;
  padding: 12px;
  width: 100%;
  text-align: center;
}

.list-container {
  margin: 0 12px;
  border-top: 1px solid #dcdfe6;
}
</style>
