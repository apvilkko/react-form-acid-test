import React from 'react'

type SubmitButtonProps = {
  onClick: React.HTMLProps<HTMLButtonElement>['onClick']
  disabled?: boolean
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <div>
      {disabled && <p>Fix the errors before submitting</p>}
      <button
        type="button"
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
      >
        Submit
      </button>
    </div>
  )
}
