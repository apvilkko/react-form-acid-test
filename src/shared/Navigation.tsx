import React from 'react'
import { Link } from 'react-router-dom'

type NavigationProps = {
  url: string
  page: number
  total: number
  onClick?: (
    evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string
  ) => void
}

export const Navigation: React.FC<NavigationProps> = ({
  url,
  page,
  total,
  onClick,
}) => {
  const links = [
    {
      show: !isNaN(page) && page > 1,
      url: `${url}/${page - 1}`,
      label: 'Previous section',
    },
    {
      show: !isNaN(page) && page < total,
      url: `${url}/${page + 1}`,
      label: 'Next section',
    },
  ]
  return (
    <div className="navigation">
      {links.map(({ show, label, url }, i) => (
        <span key={i}>
          {show && (
            <Link
              to={url}
              onClick={onClick ? (evt) => onClick(evt, url) : undefined}
            >
              {label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
