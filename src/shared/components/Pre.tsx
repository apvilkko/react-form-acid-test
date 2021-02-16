import React from 'react'

type PreProps = {
  label: string
  data: Record<string, unknown>
}

export const Pre: React.FC<PreProps> = ({ data, label }) => {
  return (
    <div>
      <h2>{label}</h2>
      <pre>{!data ? 'nothing here' : JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
