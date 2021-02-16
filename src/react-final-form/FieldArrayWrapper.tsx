import React from 'react'
import { FieldArray } from 'react-final-form-arrays'
import { Table } from '../shared/Table'
import type {
  FieldArrayComponentProps,
  FieldArrayWrapperProps,
  InnerComponentSpec,
} from '../shared/types'
import { Wrapper } from './Wrapper'

const NullRenderer = () => null

export function FieldArrayWrapper<P>({
  name,
  component: Component,
  innerComponents,
  createNew,
  label,
}: FieldArrayWrapperProps<P>): React.ReactElement {
  return (
    <FieldArray name={name}>
      {({ fields }) => {
        return (
          <div className="array-wrapper">
            <Table label={label}>
              {fields.map((name, index) => {
                // name given from fields iterator already contains index syntax e.g. [0]
                const item = fields.value[index]
                const componentProps = ({
                  handleRemove: () => fields.remove(index),
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
                            name={`${name}.${inner.name}`}
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
                fields.push(createNew())
              }}
            >
              Add new
            </button>
          </div>
        )
      }}
    </FieldArray>
  )
}
