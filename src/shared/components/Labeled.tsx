import React from 'react'

type LabeledProps = {
  id: string
  label: string
  required?: boolean
}

export const Labeled: React.FC<LabeledProps> = ({
  id,
  label,
  children,
  required,
}) => {
  return (
    <div className="labeled">
      <label htmlFor={id}>
        {label}
        {required ? '*' : ''}
      </label>
      {children}
    </div>
  )
}
