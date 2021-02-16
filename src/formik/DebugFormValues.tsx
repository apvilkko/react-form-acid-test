import React from 'react'
import { useFormikContext } from 'formik'
import { Pre } from '../shared/components/Pre'

export const DebugFormValues: React.FC<Record<string, never>> = () => {
  const { values } = useFormikContext()

  return (
    <Pre data={values as Record<string, unknown>} label="Internal form data" />
  )
}
