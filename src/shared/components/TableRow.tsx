import React from 'react'

type TableRowProps = {
  handleRemove: () => void
}

export const TableRow: React.FC<TableRowProps> = ({
  handleRemove,
  children,
}) => {
  return (
    <tr>
      {children.map((child: React.ReactElement, i: number) => (
        <td key={i}>{child}</td>
      ))}
      <td>
        <button type="button" onClick={handleRemove}>
          Remove
        </button>
      </td>
    </tr>
  )
}
