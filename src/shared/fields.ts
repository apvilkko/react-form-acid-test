import { CommonOptionType, FormShape } from './types'

export const fields = {
  NUMBER: 'number',
  NAME: 'name',
  TAGS: 'tags',
  TAYNES: 'taynes',
  TABLE: 'table',
}

export const defaultValues = {
  [fields.NUMBER]: '',
  [fields.NAME]: '',
  [fields.TAGS]: [],
  [fields.TAYNES]: [],
  [fields.TABLE]: [],
}

interface LangValueFn {
  (language: string): string
}

const setLanguages = (languages: Array<string>, valueFn?: LangValueFn) =>
  languages.reduce((acc, lang) => {
    acc[lang] = valueFn ? valueFn(lang) : ''
    return acc
  }, {} as Record<string, string>)

export const createNew = (languages: Array<string>) => () => ({
  id: Math.round(Math.random() * 100000 + 1),
  number: '',
  name: setLanguages(languages),
})

const createItem = (languages: Array<string>) => (number: number) => ({
  id: number,
  number: String(number),
  name: setLanguages(languages, (lang) => `table item ${number} name ${lang}`),
})

export const initialValues = (languages: Array<string>) => ({
  [fields.NUMBER]: '34343434',
  [fields.NAME]: languages.reduce((acc, lang) => {
    acc[lang] = `Beta ${lang}`
    return acc
  }, {} as Record<string, string>),
  [fields.TAGS]: ['Beta'],
  [fields.TAYNES]: ['Tayne3', 'Tayne4'],
  [fields.TABLE]: [createItem(languages)(4), createItem(languages)(5)],
})

const getOptions = (
  obj: Record<string, unknown>,
  field: string,
  opts: Array<CommonOptionType>
) =>
  ((obj[field] || []) as Array<string>).map((v: string) =>
    opts.find((x) => x.value === v)
  )

type RefData = {
  [x: string]: Array<CommonOptionType>
}

const toFormFormat = (
  obj: Record<string, unknown>,
  refData: RefData
): FormShape => {
  return {
    ...(obj || {}),
    [fields.TAGS]: getOptions(obj, fields.TAGS, refData.tagOptions),
    [fields.TAYNES]: getOptions(obj, fields.TAYNES, refData.tayneOptions),
  }
}

export const getInitialValues = (
  languages: Array<string>,
  refData: RefData
) => {
  return toFormFormat(initialValues(languages), refData)
}
