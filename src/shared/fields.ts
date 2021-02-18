import { CommonOptionType, FormShape } from './types'
import { setLanguages } from './utils'

export const fields = {
  NUMBER: 'number',
  NAME: 'name',
  TAGS: 'tags',
  TAYNES: 'taynes',
  TABLE: 'table',
  ACTIVE: 'active',
  OPTIONS: 'options',
}

export const createNew = (languages: Array<string>) => (): Record<
  string,
  unknown
> => ({
  id: Math.round(Math.random() * 100000 + 1),
  number: '',
  name: setLanguages(languages),
})

const createItem = (languages: Array<string>) => (number: number) => ({
  id: number,
  number: String(number),
  name: setLanguages(languages, (lang) => `table item ${number} name ${lang}`),
})

// emulate situation where backend values are different from ui values
// FormShape is not strictly typed currently
type BackendShape = FormShape

export const initialValues = (languages: Array<string>): BackendShape => ({
  [fields.NUMBER]: '34343434',
  [fields.NAME]: languages.reduce((acc, lang) => {
    acc[lang] = `Beta ${lang}`
    return acc
  }, {} as Record<string, string>),
  [fields.TAGS]: ['Beta'],
  [fields.TAYNES]: ['Tayne3', 'Tayne4'],
  [fields.TABLE]: [createItem(languages)(4), createItem(languages)(5)],
  [fields.ACTIVE]: { Oyster: true },
  [fields.OPTIONS]: { Oyster: 'smiling' },
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

const toFormFormat = (obj: BackendShape, refData: RefData): FormShape => {
  return {
    ...(obj || {}),
    [fields.TAGS]: getOptions(obj, fields.TAGS, refData.tagOptions),
    [fields.TAYNES]: getOptions(obj, fields.TAYNES, refData.tayneOptions),
  }
}

export const getInitialValues = (
  languages: Array<string>,
  refData: RefData
): FormShape => {
  return toFormFormat(initialValues(languages), refData)
}
