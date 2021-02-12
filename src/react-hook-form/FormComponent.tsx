import React from 'react'
import {
  DeepMap,
  FieldError,
  FormProvider,
  Resolver,
  useForm,
} from 'react-hook-form'
import { fields, defaultValues } from '../shared/fields'
import { MultiInput } from '../shared/MultiInput'
import { SequenceNumber } from '../shared/SequenceNumber'
import { Tag, TagSelect } from '../shared/TagSelect'
import { FormComponentProps, FormShape } from '../shared/types'
import { validate } from '../shared/validate'
import { Wrapper } from './Wrapper'

const preventDefault = (evt: React.SyntheticEvent) => {
  evt.preventDefault()
}

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
    console.log('resolver errors', errors)
    return {
      values: {},
      errors,
    }
  }
}

const tagOptions: Array<Tag> = [
  'Flarhgunnstow',
  'Hat wobble',
  'Beta',
  'Coffee mug',
].map((x) => ({ label: x, value: x.replace(/\s/g, '') }))

export const FormComponent: React.FC<FormComponentProps> = ({ languages }) => {
  const methods = useForm<FormShape>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: getResolver<FormShape>(languages),
  })
  return (
    <FormProvider {...methods}>
      <h2>Edit sequence</h2>
      <form autoComplete="off" noValidate={true} onSubmit={preventDefault}>
        <Wrapper
          label="Sequence id number"
          name={fields.NUMBER}
          component={SequenceNumber}
          required={true}
        />
        <Wrapper
          name={fields.NAME}
          component={MultiInput}
          languages={languages}
          label="Sequence name"
        />
        <Wrapper
          name={fields.TAGS}
          component={TagSelect}
          label="Enhancements"
          options={tagOptions}
          valueType="array"
        />
      </form>
    </FormProvider>
  )
}
