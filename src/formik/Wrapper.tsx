import React from 'react'
import pathOr from 'ramda/src/pathOr'
import { Field, useField, useFormikContext } from 'formik'
import { MultiInputChangeFn } from '../shared/MultiInput'
import { getInputName, getPathFromKey, setLanguages } from '../shared/utils'
import { WrapperProps } from '../shared/types'

const RegisterField: React.FC<{ name: string }> = ({ name }) => {
  useField(name)
  return null
}

function MultiLangWrapper<P>({
  name,
  component: Component,
  ...rest
}: WrapperProps<P> & { languages: Array<string> }): React.ReactElement {
  const { languages } = rest
  const { values, errors, setFieldValue } = useFormikContext()
  const handleChange: MultiInputChangeFn = (lang, value) => {
    const formFieldName = getInputName(name, lang)
    setFieldValue(formFieldName, value)
  }
  console.log('wrapper', name, values, getPathFromKey(getInputName(name, 'fi')))
  const props = {
    values: setLanguages(languages, (lang) =>
      pathOr('', getPathFromKey(getInputName(name, lang)), values)
    ),
    errors: setLanguages(languages, (lang) =>
      pathOr('', getPathFromKey(getInputName(name, lang)), errors)
    ),
    handleChange,
    name,
  }
  const componentProps = ({
    ...rest,
    ...props,
  } as unknown) as P
  return (
    <>
      {languages.map((lang) => {
        const fieldName = getInputName(name, lang)
        return <RegisterField key={fieldName} name={fieldName} />
      })}
      <Component {...componentProps} />
    </>
  )
}

export function Wrapper<P>({
  name,
  component: Component,
  valueType,
  ...rest
}: WrapperProps<P>): React.ReactElement {
  const { languages } = rest

  const { setFieldValue } = useFormikContext()

  if (languages && languages.length) {
    return <MultiLangWrapper name={name} component={Component} {...rest} />
  }

  return (
    <Field name={name}>
      {({ field, meta }) => {
        const error = meta.touched ? meta.error : undefined
        let props = {
          ...rest,
          error,
        }

        if (valueType === 'array') {
          const handleChange = (val: unknown) => {
            setFieldValue(name, val)
          }
          props = Object.assign({}, props, {
            input: {
              name,
              id: name,
              value: field.value,
              onChange: handleChange,
            },
            value: field.value,
            handleChange,
          })
        } else {
          props = Object.assign({}, props, {
            input: field,
          })
        }

        // N.B. touched (for field) is set to true on blur, not immediately on change
        return <Component {...props} />
      }}
    </Field>
  )
}
