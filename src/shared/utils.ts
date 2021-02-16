import flatten from 'ramda/src/flatten'

export const getPathFromKey = (
  path: string,
  obj?: Record<string, unknown>
): Array<string | number> => {
  const match = path.match(/\[(\d+)\]/)
  let p: Array<string | number> = path.split('.')
  if (match) {
    // array
    const parts = path.split(match[0] + '.')
    // support only first level arrays
    if (obj && !Array.isArray(obj[parts[0]])) {
      obj[parts[0]] = []
    }
    p = [
      parts[0],
      Number(match[1]),
      ...flatten(parts.slice(1).map((x) => x.split('.'))),
    ]
  }
  return p
}

export const getInputName = (
  name: string,
  lang?: string,
  objForm = true
): string => `${name}${objForm ? '.' : '-'}${lang}`

interface LangValueFn {
  (language: string): string
}

export const setLanguages = (
  languages: Array<string>,
  valueFn?: LangValueFn
): Record<string, ReturnType<LangValueFn>> =>
  languages.reduce((acc, lang) => {
    acc[lang] = valueFn ? valueFn(lang) : ''
    return acc
  }, {} as Record<string, string>)
