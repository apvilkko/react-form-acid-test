import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { Table } from '../shared/Table'
import {
  FieldArrayComponentProps,
  FieldArrayWrapperProps,
  InnerComponentSpec,
} from '../shared/types'
import { Wrapper } from './Wrapper'

const NullRenderer = () => null

// useFieldArray requires defaultValue for input, it works only for uncontrolled inputs
// use direct form methods instead
export function FieldArrayWrapper<P>({
  name,
  component: Component,
  innerComponents,
  createNew,
  label,
}: FieldArrayWrapperProps<P>): React.ReactElement {
  const { watch, setValue, getValues } = useFormContext()
  const items = watch(name)

  const remove = useCallback(
    (index: number) => {
      const items = getValues()[name] || []
      setValue(name, [...items.slice(0, index), ...items.slice(index + 1)], {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    [getValues]
  )

  const append = useCallback(() => {
    const items = getValues()[name] || []
    setValue(name, [...items, createNew()], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [getValues, createNew])

  return (
    <div className="array-wrapper">
      <Table label={label}>
        {items.map((item: Record<string, unknown>, index: number) => {
          const componentProps = ({
            handleRemove: () => remove(index),
          } as unknown) as P & FieldArrayComponentProps
          if (!item.id) {
            return null
          }
          return (
            <Component key={item.id} {...componentProps}>
              {innerComponents.map((inner: InnerComponentSpec, i: number) => {
                return (
                  <Wrapper
                    component={inner.component || NullRenderer}
                    key={i}
                    {...inner.props}
                    name={`${name}[${index}].${inner.name}`}
                  />
                )
              })}
            </Component>
          )
        })}
      </Table>
      <button type="button" onClick={append}>
        Add new
      </button>
    </div>
  )
}
