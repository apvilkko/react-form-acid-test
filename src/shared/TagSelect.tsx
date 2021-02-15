import React, { useEffect, useState } from 'react'
import { Labeled } from './Labeled'
import type { CommonInputProps, Tag as TagType } from './types'
import { usePrevious } from './usePrevious'

type TagSelectProps = CommonInputProps & {
  value: Array<TagType>
  options: Array<TagType>
  handleChange: (x: Array<TagType>) => void
}

type TagProps = {
  tag: TagType
  onClick: () => void
  type?: 'remove' | 'add'
}

const Tag: React.FC<TagProps> = ({ tag, onClick, type = 'remove' }) => (
  <button type="button" onClick={onClick}>
    {type === 'add' ? '+ ' : 'x '}
    {tag.label}
  </button>
)

export const TagSelect: React.FC<TagSelectProps> = ({
  input,
  value,
  label,
  options,
  handleChange,
}) => {
  const [selected, setSelected] = useState<Array<TagType>>([...(value || [])])
  const [search, setSearch] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [updated, setUpdated] = useState<number>(0)
  const prevUpdate = usePrevious(updated)

  useEffect(() => {
    if (updated !== prevUpdate) {
      handleChange(selected)
    }
  }, [updated, prevUpdate, selected])

  useEffect(() => {
    setSelected(value)
  }, [value])

  return (
    <div className="input-wrapper">
      <Labeled id={input.id} label={label}>
        <input
          type="text"
          id={`${input.id}-search`}
          value={search}
          onChange={(evt) => {
            const val = evt.target.value
            setSearch(val)
            setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
          }}
        />
        {open && (
          <div className="dropdown">
            {options.map((opt) =>
              selected.find((x) => x.value === opt.value) ? null : (
                <Tag
                  key={opt.value}
                  type="add"
                  tag={opt}
                  onClick={() => {
                    setSelected((existing) => [...existing, { ...opt }])
                    setUpdated((x) => ++x)
                    setOpen(false)
                  }}
                />
              )
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
              }}
            >
              Close
            </button>
          </div>
        )}
        <div>
          Selected:
          {(value || []).map((x, i) => (
            <Tag
              tag={x}
              key={x.value}
              onClick={() => {
                setSelected((existing) => [
                  ...existing.slice(0, i),
                  ...existing.slice(i + 1),
                ])
                setUpdated((x) => ++x)
              }}
            />
          ))}
        </div>
      </Labeled>
    </div>
  )
}
