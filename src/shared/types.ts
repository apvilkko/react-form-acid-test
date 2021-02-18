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

type AnyProps = {
  [x: string]: unknown
}

export type InnerComponentSpec = {
  component: React.ComponentType<AnyProps>
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

export interface DisabledCheck {
  (x: Record<string, unknown> | Record<string, boolean>): boolean
}

export type CheckboxDefinition = {
  name: string
  disabled: DisabledCheck
}

export type CheckboxesWrapperProps<P> = {
  component: React.ComponentType<P>
  checkboxes: Array<CheckboxDefinition>
  name: string
  context?: string
}

export type WrapperProps<P> = {
  name: string
  component: React.ComponentType<P>
  languages?: Array<string>
  checkboxes?: Array<CheckboxDefinition>
  handleChange?: unknown
  valueType?: string
} & Partial<P>

export type PagesType = Array<() => React.ReactElement>
