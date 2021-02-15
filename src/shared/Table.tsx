import React from 'react'

type TableProps = {
  label: string
}

export const Table: React.FC<TableProps> = ({ label, children }) => {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>{label}</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}
