import React, { useState } from 'react'
import {
  DeepMap,
  FieldError,
  FormProvider,
  Resolver,
  useForm,
} from 'react-hook-form'
import { getInitialValues } from '../shared/fields'
import { tagOptions, tayneOptions } from '../shared/options'
import { getPages } from '../shared/pages'
import { Pre } from '../shared/Pre'
import { SubmitButton } from '../shared/SubmitButton'
import { TabbedForm } from '../shared/TabbedForm'
import { FormComponentProps, FormShape } from '../shared/types'
import { validate } from '../shared/validate'
import { DebugFormValues } from './DebugFormValues'
import { FieldArrayWrapper } from './FieldArrayWrapper'
import { Wrapper } from './Wrapper'

function formatErrors(obj: Record<string, unknown>) {
  return Object.keys(obj).reduce((acc, curr) => {
    if (typeof obj[curr] === 'string') {
      acc[curr] = { type: 'foo', message: obj[curr] }
    } else {
      acc[curr] = formatErrors(obj[curr] as Record<string, unknown>)
    }
    return acc
  }, {} as Record<string, unknown>)
}

function getResolver<T>(languages: Array<string>): Resolver<T> {
  return (values) => {
    const formValues = values || {}
    const result = validate({ languages })(formValues)
    const errors = formatErrors(result) as DeepMap<T, FieldError>
    //console.log('resolver errors', errors)
    return {
      values: formValues,
      errors,
    }
  }
}

export const FormComponent: React.FC<FormComponentProps> = ({ languages }) => {
  const initialValues = getInitialValues(languages, {
    tagOptions,
    tayneOptions,
  })

  console.log('initialValues', initialValues)

  const methods = useForm<FormShape>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
    resolver: getResolver<FormShape>(languages),
    shouldUnregister: false, // this will be removed in v7
  })

  const [submitted, setSubmitted] = useState<FormShape>()

  const pages = getPages(languages, Wrapper, FieldArrayWrapper)

  const onSubmit = (data: FormShape) => {
    setSubmitted({ ...data })
  }

  const { isValid } = methods.formState

  return (
    <FormProvider {...methods}>
      <TabbedForm pages={pages} formVariant="react-hook-form" />

      <SubmitButton
        onClick={methods.handleSubmit(onSubmit, (data, e) => {
          console.log('not valid', data, e)
        })}
        disabled={!isValid}
      />

      <DebugFormValues />
      <Pre data={submitted as Record<string, unknown>} label="Submitted" />
    </FormProvider>
  )
}
