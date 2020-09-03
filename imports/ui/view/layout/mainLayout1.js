import React, { Component, PropTypes } from 'react'
import ReactDOM,{render} from 'react-dom'

export default class MainLayout1 extends Component {
  componentWillMount(){
    $("body").addClass('gray-bg');
  }
  render() {
    return (
      <div>
        {this.props.content()}
      </div>
    )
  }
}
