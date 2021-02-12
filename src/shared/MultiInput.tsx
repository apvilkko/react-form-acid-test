import React from 'react'
import { Labeled } from './Labeled'
import { Error } from './Error'

type MultiInputProps = {
  languages: Array<string>
  name: string
  label: string
  values: Record<string, string>
  errors: Record<string, string>
  handleChange: (language: string, value: string) => void
}

export const MultiInput: React.FC<MultiInputProps> = ({
  label,
  languages,
  name,
  values,
  errors,
  handleChange,
}) => {
  return (
    <Labeled id={`${name}-${languages[0]}`} label={label}>
      {languages.map((lang) => {
        const id = `${name}-${lang}`
        const value = (values || {})[lang] || ''
        const inputProps = {
          id,
          name: id,
          value,
          onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(lang, evt.target.value)
          },
        }
        return (
          <div key={lang}>
            <span>{lang}</span>
            <input {...inputProps} />
          </div>
        )
      })}
      {(errors || {})[languages[0]] && <Error>{errors[languages[0]]}</Error>}
    </Labeled>
  )
}
