export type FormShape = {
  [x: string]: unknown
}

export type InputType = {
  id: string
}

export type FormComponentProps = {
  languages: Array<string>
}

export type CommonOptionType = {
  label: string
  value: string
}

export type Tag = CommonOptionType

export type CommonInputProps = {
  label: string
  input: InputType
}
