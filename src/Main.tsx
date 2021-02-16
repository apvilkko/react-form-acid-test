import React, { useState } from 'react'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import { FormComponent as RHFFormComponent } from './react-hook-form/FormComponent'
import { FormComponent as RFFFormComponent } from './react-final-form/FormComponent'
import { FormComponent as FormikFormComponent } from './formik/FormComponent'
import { Labeled } from './shared/components/Labeled'

const libs = ['react-hook-form', 'react-final-form', 'formik'].sort()

export const Main: React.FC<Record<string, never>> = () => {
  const [languages, setLanguages] = useState<Array<string>>(['en', 'es', 'fi'])
  return (
    <>
      <h1>React Form Acid Test</h1>
      <p>Comparison of React form libraries.</p>

      <h2>Config</h2>
      <div className="input-wrapper">
        <Labeled id="config-languages" label="Languages">
          <input
            type="text"
            id="config-languages"
            value={languages.join(',')}
            onChange={(evt) => {
              const value = evt.target.value
              setLanguages(value.split(',').map((x) => x.trim()))
            }}
          />
        </Labeled>
      </div>

      <h2>Navigation</h2>
      <ul>
        {libs.map((lib) => (
          <li key={lib}>
            <Link to={`/${lib}`}>{lib}</Link>
          </li>
        ))}
      </ul>
      <Switch>
        <Route
          path="/react-hook-form"
          render={() => <RHFFormComponent languages={languages} />}
        />
        <Route
          path="/react-final-form"
          render={() => <RFFFormComponent languages={languages} />}
        />
        <Route
          path="/formik"
          render={() => <FormikFormComponent languages={languages} />}
        />
      </Switch>
      <footer>Footer stuff</footer>
    </>
  )
}
