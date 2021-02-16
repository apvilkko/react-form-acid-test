import React from 'react'
import { FieldArray, useFormikContext } from 'formik'
import type {
  FieldArrayComponentProps,
  FieldArrayWrapperProps,
  FormShape,
  InnerComponentSpec,
} from '../shared/types'
import { Table } from '../shared/components/Table'
import { Wrapper } from './Wrapper'

const NullRenderer = () => null

export function FieldArrayWrapper<P>({
  name,
  component: Component,
  innerComponents,
  createNew,
  label,
}: FieldArrayWrapperProps<P>): React.ReactElement {
  const { values } = useFormikContext<FormShape>()

  const arr = (values[name] || []) as Array<Record<string, unknown>>

  return (
    <FieldArray
      name={name}
      render={({ remove, push }) => {
        return (
          <div className="array-wrapper">
            <Table label={label}>
              {arr.map((item, index: number) => {
                const componentProps = ({
                  handleRemove: () => remove(index),
                } as unknown) as P & FieldArrayComponentProps
                return (
                  <Component key={item.id} {...componentProps}>
                    {innerComponents.map(
                      (inner: InnerComponentSpec, i: number) => {
                        return (
                          <Wrapper
                            component={inner.component || NullRenderer}
                            key={i}
                            {...inner.props}
                            name={`${name}[${index}].${inner.name}`}
                          />
                        )
                      }
                    )}
                  </Component>
                )
              })}
            </Table>
            <button
              type="button"
              onClick={() => {
                push(createNew())
              }}
            >
              Add new
            </button>
          </div>
        )
      }}
    />
  )
}
