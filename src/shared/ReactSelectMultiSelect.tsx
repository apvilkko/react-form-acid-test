import React from 'react'
import Select, { OptionsType } from 'react-select'
import { Labeled } from './Labeled'
import type { CommonInputProps } from './types'

type ReactSelectMultiSelectProps = CommonInputProps & {
  options: OptionsType<{}>
}

export const ReactSelectMultiSelect: React.FC<ReactSelectMultiSelectProps> = ({
  label,
  input,
  options,
}) => {
  return (
    <div className="input-wrapper">
      <Labeled id={input.id} label={label}>
        <Select
          {...input}
          isMulti
          options={options}
          closeMenuOnSelect={false}
        />
      </Labeled>
    </div>
  )
}
