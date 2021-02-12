export const fields = {
  NUMBER: 'number',
  NAME: 'name',
  TAGS: 'tags',
}

export const defaultValues = {
  [fields.NUMBER]: '',
  [fields.NAME]: '',
  [fields.TAGS]: [],
}

export const getInitialValues = (languages: Array<string>) => {
  return Object.assign({}, defaultValues, {
    [fields.NAME]: languages.map((lang) => ({
      [lang]: defaultValues[fields.NAME],
    })),
  })
}
