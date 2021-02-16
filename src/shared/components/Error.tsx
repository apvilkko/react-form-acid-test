import React from 'react'

const translated: Record<string, string> = {
  nan: 'Please input a number',
  required: 'Field is required',
  multilang: 'Please input all language variants',
}

type ErrorProps = {
  children: string
}

export const Error: React.FC<ErrorProps> = ({ children }) => {
  return (
    <div role="alert" className="validation-error">
      {translated[children] || children}
    </div>
  )
}
