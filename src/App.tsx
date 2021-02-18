import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from './Main'

export const App: React.FC<Record<string, never>> = () => {
  return (
    <HashRouter basename="/">
      <div className="container">
        <Main />
      </div>
    </HashRouter>
  )
}
