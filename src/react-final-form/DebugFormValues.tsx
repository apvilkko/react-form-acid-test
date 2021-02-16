import React from 'react'
import { useFormState } from 'react-final-form'
import { Pre } from '../shared/Pre'

export const DebugFormValues: React.FC<Record<string, never>> = () => {
  const { values } = useFormState({ subscription: { values: true } })

  return <Pre data={values} label="Internal form data" />
}
