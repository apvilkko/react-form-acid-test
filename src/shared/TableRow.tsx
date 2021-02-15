import React from 'react'

export const TableRow = ({ handleRemove, children }) => {
  return (
    <tr>
      {children.map((child, i) => (
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
