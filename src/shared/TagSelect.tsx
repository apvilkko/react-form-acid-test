import React, { useEffect, useState } from 'react'
import { Labeled } from './Labeled'
import { InputType } from './types'

export type Tag = {
  label: string
  value: string
}

type TagSelectProps = {
  value: Array<Tag>
  options: Array<Tag>
  input: InputType
  label: string
  handleChange: (x: Array<Tag>) => void
}

type AnyType = Array<unknown> | Record<string, unknown> | unknown

const eq = (o1: AnyType, o2: AnyType): boolean => {
  if (!o1 || !o2) {
    return o1 === o2
  }
  if (Array.isArray(o1) && Array.isArray(o2)) {
    if (o1.length !== o2.length) {
      return false
    }
    for (let i = 0; i < o1.length; ++i) {
      return eq(o1[i], o2[i])
    }
  } else if (typeof o1 === 'string') {
    return o1 === o2
  } else {
    for (
      let k = 0;
      k < Object.keys(o1 as Record<string, unknown>).length;
      k++
    ) {
      return eq(
        (o1 as Record<string, unknown>)[k],
        (o2 as Record<string, unknown>)[k]
      )
    }
  }

  return false
}

type TagProps = {
  tag: Tag
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
  const [selected, setSelected] = useState<Array<Tag>>([...(value || [])])
  const [search, setSearch] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!eq(selected, value)) {
      handleChange(selected)
    }
  }, [selected, value])

  return (
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
            }}
          />
        ))}
      </div>
    </Labeled>
  )
}
