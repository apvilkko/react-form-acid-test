import { fields } from './fields'
import { FormShape } from './types'

type ValidateConfig = {
  languages: Array<string>
}

export const validate = ({ languages }: ValidateConfig) => (obj: FormShape) => {
  const errors: Record<string, string | Record<string, string>> = {}

  if (obj) {
    if (!obj[fields.NUMBER]) {
      errors[fields.NUMBER] = 'required'
    } else if (isNaN(Number(obj[fields.NUMBER]))) {
      errors[fields.NUMBER] = 'nan'
    }

    // Multilanguage error is indicated with setting error on the first field
    if (obj[fields.NAME]) {
      const val = obj[fields.NAME] as Record<string, string>
      console.log(
        val,
        Object.keys(val).filter((lang) => !!val[lang])
      )
      const amountFilled = Object.keys(val).filter((lang) => !!val[lang]).length
      if (amountFilled > 0 && amountFilled !== languages.length) {
        errors[fields.NAME] = { [languages[0]]: 'multilang' }
      }
    }
  }

  console.log('validate result', errors)

  return Object.keys(errors).length === 0 ? {} : errors
}
