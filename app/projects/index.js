import React from 'react'
import { Router, Link, Route, browserHistory } from 'react-router'

const Projects = React.createClass({
  renderProject(project){
    return (
      <tr key={project.name}>
        <td>{project.name}</td>
        <td><a target="_blank" href={project.url}>{project.url}</a></td>
        <td><a href="#">delete</a></td>
      </tr>
    )
  },
  render(){
    return (
      <div className="projects">
        <h2>Project List</h2>
        <table>
          <tbody>
            {this.state.projects.map(this.renderProject)}
          </tbody>
        </table>
      </div>
    )
  },

  getInitialState(){
    return {
      projects: [
        { name: 'project 1', url: 'http://localhost:9001/' },
        { name: 'project 2', url: 'http://localhost:9002/' }
      ]
    }
  }
})

export default Projects