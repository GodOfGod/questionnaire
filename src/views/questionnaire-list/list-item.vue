<template>
  <div class="questionnaire-item" @click="goToDetail(order.id)">
    <div class="title-container">
      <div class="title">
        <span>{{ index + 1 }}、</span>
        <span v-if="mainTitle" class="custom-title">{{ mainTitle }}</span>
        <span v-else>宠物：{{ questionnaire.name.value }}</span>
      </div>
      <div class="date">{{ order.date }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuestionnaireResponse } from '@models/components/questionnair-item'
import type { QuestionnaireConfigObj } from '@/views/questionnaire/data'
import { computed } from 'vue'
import router from '@/router'
const { order, index } = defineProps<{ order: QuestionnaireResponse; index: number }>()

const questionnaire = computed(() => {
  return JSON.parse(order.questionnaire) as QuestionnaireConfigObj
})

const mainTitle = computed(() => {
  return (questionnaire.value as { main_title: string } & QuestionnaireConfigObj).main_title
})

const goToDetail = (id: string) => {
  try {
    router.push({
      name: 'questionnaire',
      params: { id },
      query: { type: 'edit', config_id: order.config_id },
    })
    // router.push({ name: 'order-detail', params: { id } })
  } catch (error) {
    console.error('Error navigating to order detail:', error)
  }
}
</script>

<style lang="less" scoped>
.questionnaire-item {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 4px;
}

.title-container {
  width: 100%;
  position: relative;
}

.title {
  font-weight: bold;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 8px;

  .custom-title {
    color: #f56c6c;
  }
}

.date {
  font-size: 12px;
  color: #888;
}

.opts-container {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}
</style>
