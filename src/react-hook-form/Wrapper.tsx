import React, { useEffect } from 'react'
import path from 'ramda/src/path'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { MultiInputChangeFn } from '../shared/inputs/MultiInput'
import { getInputName, getPathFromKey } from '../shared/utils'
import type { CheckboxesWrapperProps, WrapperProps } from '../shared/types'

const simplifyError = (obj?: Record<string, unknown>) => {
  return obj && obj.message ? obj.message : obj
}

const EMPTY_ERROR = {}

function MultiLangWrapper<P>({
  name,
  component: Component,
  ...rest
}: WrapperProps<P> & { languages: Array<string> }): React.ReactElement {
  const { register, control, errors, setValue, unregister } = useFormContext()
  const { languages } = rest
  const watches = useWatch({
    control,
    name: languages.map((x) => getInputName(name, x)),
  })
  const inputValues = Object.keys(watches).reduce(
    (obj: Record<string, string>, key: string) => {
      const newKey = key.split('.').pop() as string
      obj[newKey] = watches[key]
      return obj
    },
    {}
  )

  const currentError: Record<string, unknown> | undefined = path(
    getPathFromKey(name),
    errors
  )

  const error = currentError
    ? Object.keys(currentError).reduce((acc, curr) => {
        acc[curr] = simplifyError(currentError[curr] as Record<string, unknown>)
        return acc
      }, {} as Record<string, unknown>)
    : EMPTY_ERROR

  useEffect(() => {
    languages?.forEach((language: string) => {
      const inputName = getInputName(name, language)
      register({ name: inputName, type: 'custom' })
    })

    return () => {
      languages?.forEach((language: string) => {
        const inputName = getInputName(name, language)
        unregister(inputName)
      })
    }
  }, [languages])

  return (
    <Controller
      control={control}
      name={name}
      render={() => {
        const handleChange: MultiInputChangeFn = (lang, value) => {
          // setValue needs to be used to set "touched" and trigger validation
          if (lang !== languages?.[0]) {
            // need of setTimeout seems like a hack, maybe sequential setValues are batched?
            setTimeout(() => {
              setValue(
                getInputName(name, languages?.[0]),
                (inputValues || {})[languages?.[0] || ''] || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
            }, 20)
          }

          setValue(getInputName(name, lang), value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        const innerProps = {
          ...rest,
          languages,
          name,
          values: inputValues,
          handleChange,
          errors: error,
        }

        return <Component {...((innerProps as unknown) as P)} />
      }}
    />
  )
}

function CheckboxesWrapper<P>({
  name,
  component: Component,
  checkboxes,
  context,
  ...rest
}: CheckboxesWrapperProps<P>) {
  const { control, setValue } = useFormContext()
  const watch = useWatch({ control, name })
  const isCheckbox = rest.type === 'checkbox'
  const inputs = checkboxes.map(
    ({ name: checkboxName, disabled: isDisabled }) => {
      const id = `${name}.${checkboxName}`
      const disabled = isDisabled ? isDisabled(watch) : false
      const contextName = `${name}.${context}`
      const props = {
        name: isCheckbox ? id : contextName,
        id: isCheckbox ? id : `${contextName}.${checkboxName}`,
        onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
          if (isCheckbox) {
            setValue(id, evt.target.checked)
          } else {
            setValue(contextName, evt.target.value)
          }
        },
        label: checkboxName,
        value: checkboxName,
        checked: isCheckbox
          ? !!watch[checkboxName]
          : watch[context] === checkboxName,
        disabled,
      }
      return props
    }
  )

  const componentProps = {
    inputs,
    ...rest,
  }

  return <Component {...componentProps} />
}

export function Wrapper<P>({
  name,
  component: Component,
  valueType,
  ...rest
}: WrapperProps<P>): React.ReactElement {
  const { control, errors, setValue } = useFormContext()

  const { languages } = rest

  if (languages && languages.length) {
    return <MultiLangWrapper name={name} component={Component} {...rest} />
  }

  const { checkboxes } = rest
  if (typeof checkboxes !== 'undefined') {
    return <CheckboxesWrapper name={name} component={Component} {...rest} />
  }

  const currentError: Record<string, unknown> | undefined = path(
    getPathFromKey(name),
    errors
  )
  const error = simplifyError(currentError)

  return (
    <Controller
      control={control}
      name={name}
      render={(input) => {
        let innerProps = {
          ...rest,
          input,
          error,
        }

        if (valueType === 'array') {
          innerProps = Object.assign(innerProps, {
            handleChange: (value: unknown) => {
              setValue(name, value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            },
            value: input.value,
          })
        }
        return <Component {...((innerProps as unknown) as P)} />
      }}
    />
  )
}
