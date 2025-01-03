type inputType = 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'radio' | 'checkbox'

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
  field: Field
  title: string
  required?: boolean
  inputType: inputType[]
  needRemark: boolean
  options?: string[]
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
