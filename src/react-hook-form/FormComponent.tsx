import React, { useState } from 'react'
import {
  DeepMap,
  FieldError,
  FormProvider,
  Resolver,
  useForm,
} from 'react-hook-form'
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router'
import { fields, getInitialValues, createNew } from '../shared/fields'
import { MultiInput } from '../shared/MultiInput'
import { Navigation } from '../shared/Navigation'
import { tagOptions, tayneOptions } from '../shared/options'
import { Pre } from '../shared/Pre'
import { ReactSelectMultiSelect } from '../shared/ReactSelectMultiSelect'
import { SequenceNumber } from '../shared/SequenceNumber'
import { SubmitButton } from '../shared/SubmitButton'
import { TableRow } from '../shared/TableRow'
import { TagSelect } from '../shared/TagSelect'
import { FormComponentProps, FormShape } from '../shared/types'
import { validate } from '../shared/validate'
import { DebugFormValues } from './DebugFormValues'
import { FieldArrayWrapper, InnerComponentSpec } from './FieldArrayWrapper'
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

  const { url } = useRouteMatch()
  const location = useLocation()
  const pageId = Number(location.pathname.split('/').pop())
  const [submitted, setSubmitted] = useState<FormShape>()

  const tableRowComponents: Array<InnerComponentSpec> = [
    {
      component: SequenceNumber,
      props: { label: 'Seq number', required: true },
      name: fields.NUMBER,
    },
    {
      component: MultiInput,
      props: { label: 'Seq name', languages },
      name: fields.NAME,
    },
  ]

  const pages = [
    () => (
      <>
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
      </>
    ),
    () => (
      <>
        <Wrapper
          name={fields.TAYNES}
          component={ReactSelectMultiSelect}
          label="Taynes"
          options={tayneOptions}
          valueType="array"
        />
      </>
    ),
    () => (
      <>
        <FieldArrayWrapper
          label="Table of multiple sequences"
          name={fields.TABLE}
          component={TableRow}
          createNew={createNew(languages)}
          innerComponents={tableRowComponents}
        />
      </>
    ),
  ]

  const onSubmit = (data: FormShape) => {
    setSubmitted({ ...data })
  }

  const navigation = <Navigation url={url} total={pages.length} page={pageId} />

  const { isValid } = methods.formState

  return (
    <FormProvider {...methods}>
      <h2>Edit sequence | section {pageId}</h2>
      <p>using react-hook-form</p>

      {navigation}

      <form autoComplete="off" noValidate={true} onSubmit={preventDefault}>
        <Switch>
          <Route exact path={url}>
            <Redirect to={`${url}/1`} />
          </Route>
          {pages.map((page, i) => (
            <Route key={i} path={`${url}/${i + 1}`} render={page} />
          ))}
        </Switch>
      </form>

      {navigation}

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
