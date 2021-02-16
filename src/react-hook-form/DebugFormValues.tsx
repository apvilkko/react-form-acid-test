import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Pre } from '../shared/components/Pre'

export const DebugFormValues: React.FC<Record<string, never>> = () => {
  const { watch } = useFormContext()
  const values = watch()

  return <Pre data={values} label="Internal form data" />
}
