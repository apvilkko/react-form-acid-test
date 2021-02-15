import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Pre } from '../shared/Pre'

export const DebugFormValues = () => {
  const { watch } = useFormContext()
  const values = watch()

  return <Pre data={values} label="Internal form data" />
}
