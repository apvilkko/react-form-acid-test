import assocPath from 'ramda/src/assocPath'
import { fields } from './fields'
import { FormShape } from './types'
import { getPathFromKey } from './utils'

type ValidateConfig = {
  languages: Array<string>
}

const applyError = (
  obj: Record<string, unknown>,
  path: string,
  value: unknown
) => {
  return assocPath(getPathFromKey(path, obj), value, obj)
}

const getErrorField = (name: string, parent?: string, index?: number) => {
  const prefix = parent ? `${parent}[${index}].` : ''
  return `${prefix}${name}`
}

const validateNumber = (
  obj: Record<string, unknown>,
  name: string,
  errors: Record<string, unknown>,
  parent?: string,
  index?: number
) => {
  let err = errors
  const value = obj[name]
  const field = getErrorField(name, parent, index)
  if (!value) {
    err = applyError(err, field, 'required')
  } else if (isNaN(Number(value))) {
    err = applyError(err, field, 'nan')
  }
  return err
}

const validateMultiLang = (
  languages: Array<string>,
  obj: Record<string, unknown>,
  name: string,
  errors: Record<string, unknown>,
  parent?: string,
  index?: number
) => {
  let err = errors
  const value = obj[name] as Record<string, string>
  const field = getErrorField(name, parent, index)
  if (value) {
    const amountFilled = Object.keys(value).filter((lang) => !!value[lang])
      .length
    if (amountFilled > 0 && amountFilled !== languages.length) {
      // Multilanguage error is indicated with setting error on the first field
      err = applyError(err, field, { [languages[0]]: 'multilang' })
    }
  }
  return err
}

export const validate = ({ languages }: ValidateConfig) => (
  obj: FormShape
): Record<string, unknown> => {
  let errors: Record<string, unknown> = {}

  if (obj) {
    errors = validateNumber(obj, fields.NUMBER, errors)
    errors = validateMultiLang(languages, obj, fields.NAME, errors)
  }

  if (obj[fields.TABLE]) {
    ;(obj[fields.TABLE] as Array<Record<string, unknown>>).forEach(
      (item, i) => {
        if (item) {
          errors = validateNumber(item, fields.NUMBER, errors, fields.TABLE, i)
          errors = validateMultiLang(
            languages,
            item,
            fields.NAME,
            errors,
            fields.TABLE,
            i
          )
        }
      }
    )
  }

  return Object.keys(errors).length === 0 ? {} : errors
}
