import React, { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

const simplifyError = (obj?: Record<string, string>) =>
  obj && obj.message ? obj.message : obj

const getInputName = (name: string, lang?: string, objForm = true) =>
  `${name}${objForm ? '.' : '-'}${lang}`

type WrapperProps<P> = {
  name: string
  component: React.ComponentType<P>
  languages?: Array<string>
  handleChange?: any
  valueType?: string
} & Partial<P>

export function Wrapper<P>({
  name,
  component: Component,
  valueType,
  ...rest
}: WrapperProps<P>) {
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
        console.log('register', inputName)
        register({ name: inputName, type: 'custom' })
      })

      return () => {
        languages?.forEach((language: string) => {
          const inputName = getInputName(name, language)
          console.log('unregister', inputName)
          unregister(inputName)
        })
      }
    }
  }, [languages])

  const EMPTY_ERROR = {}

  const currentError = errors[name]
  const error = isMultiLanguage
    ? currentError
      ? Object.keys(currentError).reduce((acc, curr) => {
          acc[curr] = simplifyError(currentError[curr])
          return acc
        }, {} as Record<string, unknown>)
      : EMPTY_ERROR
    : simplifyError(currentError)

  console.log('error', name, error, errors)

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
          innerProps = Object.assign(innerProps, {
            languages,
            name,
            values: inputValues,
            handleChange: (lang: string, value: string) => {
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
            },
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
              value: inputValues,
            })
          }
        }
        return <Component {...((innerProps as unknown) as P)} />
      }}
    />
  )
}
