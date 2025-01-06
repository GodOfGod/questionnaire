type inputType = 'input' | 'number' | 'textarea' | 'radio' | 'checkbox' | ''

type Field =
  | 'phone'
  | 'name'
  | 'age'
  | 'gender'
  | 'fertile'
  | 'vaccine'
  | 'health'
  | 'personality'
  | 'play'
  | 'food'

export interface QuestionnaireItem {
  field: Field | string
  title: string
  required?: boolean
  inputType: inputType
  needRemark: boolean
  options?: string[] | string
}

export interface QuestionnaireResponse {
  id: string
  date: string
  config_id: string
  questionnaire: string
}

export interface CustomConfigField {
  id: string
  title: string
  config_fields: string
}
