import React, { Component, PropTypes } from 'react'

export default class MainLayout1 extends Component {

  render() {
    return (
      <div id="wrapper">
        {this.props.content()}
      </div>
    )
  }
}
