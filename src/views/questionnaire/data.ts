import type { QuestionnaireItem } from '@models/components/questionnair-item'

const questionnaireConfigList: Array<QuestionnaireItem> = [
  {
    field: 'name',
    title: '宠物昵称',
    required: true,
    inputType: ['text'],
    needRemark: false,
  },
  {
    field: 'age',
    title: '宠物年龄',
    required: true,
    inputType: ['text'],
    needRemark: false,
  },
  {
    field: 'gender',
    title: '宠物性别',
    required: true,
    inputType: ['radio'],
    needRemark: false,
    options: ['Boy', 'Girl'],
  },
  {
    field: 'fertile',
    title: '是否绝育',
    required: true,
    inputType: ['radio'],
    needRemark: false,
    options: ['纯原生', '已噶'],
  },
  {
    field: 'vaccine',
    title: '疫苗情况',
    required: true,
    inputType: ['text'],
    needRemark: false,
  },
  {
    field: 'health',
    title: '健康情况',
    required: true,
    inputType: ['text'],
    needRemark: false,
  },
  {
    field: 'personality',
    title: '性格',
    required: true,
    inputType: ['text'],
    needRemark: false,
  },
  {
    field: 'play',
    title: '是否需要陪玩',
    required: true,
    inputType: ['radio'],
    needRemark: false,
    options: ['需要', '不用啦'],
  },
  {
    field: 'food',
    title: '食物偏好及食量',
    required: true,
    inputType: ['text'],
    needRemark: false,
  },
  {
    field: 'phone',
    title: '手机号',
    required: true,
    inputType: ['text'],
    needRemark: false,
  },
]

// type GenerateQuestionnaireConfig<T extends { field: string; title: string }[]> = {
//   [K in T[number]['field']]: { value: string; title: string }
// }

// export type QuestionnaireConfig = GenerateQuestionnaireConfig<typeof questionnaireConfigList>

export interface QuestionnaireConfigObj {
  [k: string]: { value: string; title: string }
}

/**
 *
 * @param configFields ['name', 'age'], 根据这个字段生成对应的配置，包括顺序
 * @param externalConfigList 额外的配置，
 * @returns
 */
const generateQuestionnaireConfig = (
  configFields: string[],
  externalConfigList: Array<QuestionnaireItem>,
): QuestionnaireConfigObj => {
  const obj: QuestionnaireConfigObj = {}
  const configList = externalConfigList.concat(questionnaireConfigList)
  configFields.map((field) => {
    const config = configList.find((item) => item.field === field)
    if (config) {
      obj[field] = { value: '', title: config.title }
    }
  })
  return obj
}

export { questionnaireConfigList, generateQuestionnaireConfig }
