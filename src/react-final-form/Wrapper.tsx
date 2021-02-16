import React from 'react'
import pathOr from 'ramda/src/pathOr'
import { Field, useField, useForm, useFormState } from 'react-final-form'
import type { WrapperProps } from '../shared/types'
import { getInputName, getPathFromKey, setLanguages } from '../shared/utils'
import { MultiInputChangeFn } from '../shared/inputs/MultiInput'

const RegisterField: React.FC<{ name: string }> = ({ name }) => {
  useField(name)
  return null
}

function MultiLangWrapper<P>({
  name,
  component: Component,
  ...rest
}: WrapperProps<P> & { languages: Array<string> }): React.ReactElement {
  const { change } = useForm()
  const { values, errors } = useFormState({
    subscription: { values: true, errors: true },
  })

  const { languages } = rest
  const handleChange: MultiInputChangeFn = (lang, value) => {
    const formFieldName = getInputName(name, lang)
    change(formFieldName, value)
  }
  const componentProps = {
    ...rest,
    name,
    handleChange,
    languages,
    values: setLanguages(languages, (lang) =>
      pathOr('', getPathFromKey(getInputName(name, lang)), values)
    ),
    errors: setLanguages(languages, (lang) =>
      pathOr('', getPathFromKey(getInputName(name, lang)), errors)
    ),
  }
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

  if (languages && languages.length) {
    return <MultiLangWrapper name={name} component={Component} {...rest} />
  }

  return (
    <Field name={name}>
      {({ input, meta }) => {
        // Fields are "touched" after blur, and touched state is reset when switching tabs
        const error = meta.touched ? meta.error : undefined
        let props = {
          ...rest,
          error,
        }
        if (valueType === 'array') {
          const handleChange = (val: unknown) => {
            input.onChange(val)
          }
          props = Object.assign({}, props, {
            input: {
              name,
              id: name,
              value: input.value,
              onChange: input.onChange,
            },
            value: input.value,
            handleChange,
          })
        } else {
          props = Object.assign({}, props, {
            input,
          })
        }
        return <Component {...props} />
      }}
    </Field>
  )
}
