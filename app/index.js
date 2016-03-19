import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import Projects from './projects'

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <h1 className="title is-1">Gaston Dashboard</h1>
        <Projects />
      </div>
    )
  }
}

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
)

render(<App />, document.querySelector('.main'))