import React, { useEffect } from 'react'
import path from 'ramda/src/path'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { MultiInputChangeFn } from '../shared/MultiInput'
import { getInputName, getPathFromKey } from '../shared/utils'
import type { WrapperProps } from '../shared/types'

const simplifyError = (obj?: Record<string, unknown>) => {
  return obj && obj.message ? obj.message : obj
}

export function Wrapper<P>({
  name,
  component: Component,
  valueType,
  ...rest
}: WrapperProps<P>): React.ReactElement {
  const { register, control, errors, setValue, unregister } = useFormContext()

  const { languages } = rest

  const isMultiLanguage = languages && languages.length

  const watches = useWatch({
    control,
    name:
      languages && languages.length
        ? languages.map((x) => getInputName(name, x))
        : [name],
  })
  const inputValues = isMultiLanguage
    ? Object.keys(watches).reduce(
        (obj: Record<string, string>, key: string) => {
          const newKey = key.split('.').pop() as string
          obj[newKey] = watches[key]
          return obj
        },
        {}
      )
    : watches[name]

  useEffect(() => {
    if (isMultiLanguage) {
      languages?.forEach((language: string) => {
        const inputName = getInputName(name, language)
        //console.log('register', inputName)
        register({ name: inputName, type: 'custom' })
      })

      return () => {
        languages?.forEach((language: string) => {
          const inputName = getInputName(name, language)
          //console.log('unregister', inputName)
          unregister(inputName)
        })
      }
    }
  }, [languages])

  const EMPTY_ERROR = {}

  const currentError: Record<string, unknown> | undefined = path(
    getPathFromKey(name),
    errors
  )
  const error = isMultiLanguage
    ? currentError
      ? Object.keys(currentError).reduce((acc, curr) => {
          acc[curr] = simplifyError(
            currentError[curr] as Record<string, unknown>
          )
          return acc
        }, {} as Record<string, unknown>)
      : EMPTY_ERROR
    : simplifyError(currentError)

  return (
    <Controller
      control={control}
      name={name}
      render={(
        input
        //{ invalid, isTouched, isDirty }
      ) => {
        let innerProps = {
          ...rest,
        }
        if (isMultiLanguage) {
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

            console.log(
              'Wrapper multilang setValue',
              name,
              lang,
              getInputName(name, lang),
              value
            )

            setValue(getInputName(name, lang), value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          innerProps = Object.assign(innerProps, {
            languages,
            name,
            values: inputValues,
            handleChange,
            errors: error,
          })
        } else {
          innerProps = Object.assign(innerProps, {
            input,
            error,
          })
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
        }
        return <Component {...((innerProps as unknown) as P)} />
      }}
    />
  )
}
