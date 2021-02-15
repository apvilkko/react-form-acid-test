import React from 'react'
import { Labeled } from './Labeled'
import { Error } from './Error'
import type { CommonInputProps } from './types'

type SequenceNumberProps = CommonInputProps & {
  error?: string
  required?: boolean
}

export const SequenceNumber: React.FC<SequenceNumberProps> = ({
  input,
  error,
  label,
  required,
}) => {
  return (
    <div className="input-wrapper">
      <Labeled label={label} id={input.id} required={required}>
        <input type="text" {...input} />
        {error && <Error>{error}</Error>}
      </Labeled>
    </div>
  )
}
