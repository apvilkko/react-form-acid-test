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

export type FieldArrayComponentProps = {
  handleRemove: () => void
}

export type InnerComponentSpec = {
  component: React.ComponentType
  props: Record<string, unknown>
  name: string
}

export type FieldArrayWrapperProps<P> = {
  innerComponents: Array<InnerComponentSpec>
  component: React.ComponentType<P & FieldArrayComponentProps>
  name: string
  label: string
  createNew: () => Record<string, unknown>
}

export type WrapperProps<P> = {
  name: string
  component: React.ComponentType<P>
  languages?: Array<string>
  handleChange?: any
  valueType?: string
} & Partial<P>
