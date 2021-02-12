import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

import './style.css'

let el = document.getElementById('app')
if (!el) {
  el = document.createElement('div')
  el.id = 'app'
  document.getElementsByTagName('body')[0].appendChild(el)
}

render(React.createElement(App), el)
