import React from 'react'

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  type: 'checkbox' | 'radio'
}

type CheckboxGroupProps = {
  inputs: Array<CheckboxProps>
  label?: string
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  inputs,
  extras,
  type,
  plain,
}) => {
  return (
    <fieldset className={`input-wrapper ${plain ? 'plain' : ''}`}>
      <legend>{label}</legend>
      {(inputs || []).map(({ label, ...rest }, i) => {
        return (
          <div
            key={rest.id}
            className={`checkbox ${rest.disabled ? 'disabled' : ''}`}
          >
            <input {...rest} type={type} />
            {label ? <label htmlFor={rest.id}>{label}</label> : null}
            {/* TODO checked works only for checkbox type */}
            {rest.checked && extras && extras[i] ? extras[i] : null}
          </div>
        )
      })}
    </fieldset>
  )
}
