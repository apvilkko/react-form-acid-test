import React from 'react'
import { createNew, fields } from './fields'
import { MultiInput } from './MultiInput'
import { tagOptions, tayneOptions } from './options'
import { ReactSelectMultiSelect } from './ReactSelectMultiSelect'
import { SequenceNumber } from './SequenceNumber'
import { TableRow } from './TableRow'
import { TagSelect } from './TagSelect'
import type { InnerComponentSpec } from './types'

export const getPages = (languages, Wrapper, FieldArrayWrapper) => {
  const tableRowComponents: Array<InnerComponentSpec> = [
    {
      component: SequenceNumber,
      props: { label: 'Seq number', required: true },
      name: fields.NUMBER,
    },
    {
      component: MultiInput,
      props: { label: 'Seq name', languages },
      name: fields.NAME,
    },
  ]

  const pages = [
    () => (
      <>
        <Wrapper
          label="Sequence id number"
          name={fields.NUMBER}
          component={SequenceNumber}
          required={true}
        />
        <Wrapper
          name={fields.NAME}
          component={MultiInput}
          languages={languages}
          label="Sequence name"
        />
        <Wrapper
          name={fields.TAGS}
          component={TagSelect}
          label="Enhancements"
          options={tagOptions}
          valueType="array"
        />
      </>
    ),
    () => (
      <>
        <Wrapper
          name={fields.TAYNES}
          component={ReactSelectMultiSelect}
          label="Taynes"
          options={tayneOptions}
          valueType="array"
        />
      </>
    ),
    () => (
      <>
        <FieldArrayWrapper
          label="Table of multiple sequences"
          name={fields.TABLE}
          component={TableRow}
          createNew={createNew(languages)}
          innerComponents={tableRowComponents}
        />
      </>
    ),
  ]

  return pages
}
