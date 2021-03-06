import React from 'react'
import { Labeled } from '../components/Labeled'
import { Error } from '../components/Error'

export interface MultiInputChangeFn {
  (language: string, value: string): void
}

type MultiInputProps = {
  languages: Array<string>
  name: string
  label: string
  values: Record<string, string>
  errors: Record<string, string>
  handleChange: MultiInputChangeFn
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
    <div className="input-wrapper">
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
              <input type="text" {...inputProps} />
            </div>
          )
        })}
        {(errors || {})[languages[0]] && <Error>{errors[languages[0]]}</Error>}
      </Labeled>
    </div>
  )
}
