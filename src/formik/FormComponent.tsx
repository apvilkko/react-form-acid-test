import React, { useState } from 'react'
import { Formik } from 'formik'
import { TabbedForm } from '../shared/TabbedForm'
import { FormComponentProps, FormShape } from '../shared/types'
import { getInitialValues } from '../shared/fields'
import { tagOptions, tayneOptions } from '../shared/options'
import { Pre } from '../shared/Pre'
import { Wrapper } from './Wrapper'
import { SubmitButton } from '../shared/SubmitButton'
import { validate } from '../shared/validate'
import { FieldArrayWrapper } from './FieldArrayWrapper'
import { getPages } from '../shared/pages'
import { DebugFormValues } from './DebugFormValues'

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
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validatorFn}
      >
        {({ isValid, submitForm }) => (
          <>
            <TabbedForm pages={pages} formVariant="formik" />
            <SubmitButton disabled={!isValid} onClick={submitForm} />
            <DebugFormValues />
          </>
        )}
      </Formik>

      <Pre data={submitted as Record<string, unknown>} label="Submitted" />
    </div>
  )
}
