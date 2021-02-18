import React from 'react'
import pathOr from 'ramda/src/pathOr'
import { Field, useField, useFormikContext } from 'formik'
import { MultiInputChangeFn } from '../shared/inputs/MultiInput'
import { getInputName, getPathFromKey, setLanguages } from '../shared/utils'
import { CheckboxesWrapperProps, WrapperProps } from '../shared/types'

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

function CheckboxesWrapper<P>({
  name,
  component: Component,
  checkboxes,
  context,
  ...rest
}: CheckboxesWrapperProps<P>) {
  const { values, setFieldValue } = useFormikContext()
  const isCheckbox = rest.type === 'checkbox'
  const groupValues = values[name]
  const inputs = checkboxes.map(
    ({ name: checkboxName, disabled: isDisabled }) => {
      const id = `${name}.${checkboxName}`
      const disabled = isDisabled ? isDisabled(groupValues) : false
      const contextName = `${name}.${context}`
      const props = {
        name: isCheckbox ? id : contextName,
        id: isCheckbox ? id : `${contextName}.${checkboxName}`,
        onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
          if (isCheckbox) {
            setFieldValue(id, evt.target.checked)
          } else {
            setFieldValue(contextName, evt.target.value)
          }
        },
        label: checkboxName,
        value: checkboxName,
        checked: isCheckbox
          ? !!groupValues[checkboxName]
          : groupValues[context] === checkboxName,
        disabled,
      }
      return props
    }
  )
  const componentProps = { ...rest, inputs }
  return <Component {...componentProps} />
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

  const { checkboxes } = rest
  if (typeof checkboxes !== 'undefined') {
    return <CheckboxesWrapper name={name} component={Component} {...rest} />
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
