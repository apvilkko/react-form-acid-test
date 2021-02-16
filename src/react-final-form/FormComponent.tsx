import React, { useState } from 'react'
import equals from 'ramda/src/equals'
import { Form } from 'react-final-form'
import { getInitialValues } from '../shared/fields'
import { getPages } from '../shared/pages'
import { SubmitButton } from '../shared/components/SubmitButton'
import { TabbedForm } from '../shared/components/TabbedForm'
import { FormComponentProps, FormShape } from '../shared/types'
import { validate } from '../shared/validate'
import { tagOptions, tayneOptions } from '../shared/options'
import { DebugFormValues } from './DebugFormValues'
import { FieldArrayWrapper } from './FieldArrayWrapper'
import arrayMutators from 'final-form-arrays'
import { Wrapper } from './Wrapper'
import { Pre } from '../shared/components/Pre'

export const FormComponent: React.FC<FormComponentProps> = ({ languages }) => {
  const initialValues = getInitialValues(languages, {
    tagOptions,
    tayneOptions,
  })

  const [submitted, setSubmitted] = useState<FormShape>()

  const onSubmit = (data: FormShape) => {
    setSubmitted({ ...data })
  }

  const pages = getPages(languages, Wrapper, FieldArrayWrapper)

  const validatorFn = validate({ languages })

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        validate={validatorFn}
        initialValues={initialValues}
        initialValuesEqual={equals}
        keepDirtyOnReinitialize
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ handleSubmit, valid }) => {
          return (
            <>
              <TabbedForm pages={pages} formVariant="react-final-form" />
              <SubmitButton disabled={!valid} onClick={handleSubmit} />
              <DebugFormValues />
            </>
          )
        }}
      </Form>

      <Pre data={submitted as Record<string, unknown>} label="Submitted" />
    </div>
  )
}
