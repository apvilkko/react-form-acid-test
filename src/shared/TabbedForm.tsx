import React from 'react'
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router'
import { Navigation } from './Navigation'

const preventDefault = (evt: React.SyntheticEvent) => {
  evt.preventDefault()
}

export const TabbedForm = ({ pages, formVariant }) => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const pageId = Number(location.pathname.split('/').pop())
  const navigation = <Navigation url={url} total={pages.length} page={pageId} />
  return (
    <>
      <h2>Edit sequence | section {pageId}</h2>
      <p>using {formVariant}</p>
      {navigation}
      <form autoComplete="off" noValidate={true} onSubmit={preventDefault}>
        <Switch>
          <Route exact path={url}>
            <Redirect to={`${url}/1`} />
          </Route>
          {pages.map((page, i) => (
            <Route key={i} path={`${url}/${i + 1}`} render={page} />
          ))}
        </Switch>
      </form>
      {navigation}
    </>
  )
}
