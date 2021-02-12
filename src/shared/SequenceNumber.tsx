import React from 'react'
import { Labeled } from './Labeled'
import { Error } from './Error'
import { InputType } from './types'

type SequenceNumberProps = {
  input: InputType
  error?: string
  label: string
  required?: boolean
}

export const SequenceNumber: React.FC<SequenceNumberProps> = ({
  input,
  error,
  label,
  required,
}) => {
  return (
    <Labeled label={label} id={input.id} required={required}>
      <input type="text" {...input} />
      {error && <Error>{error}</Error>}
    </Labeled>
  )
}
