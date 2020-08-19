import React,{Component,PropTypes} from 'react'
import ReactDOM,{render} from 'react-dom'

export default class Footer extends Component {

  render(){
    return(
      <div className="footer">
        <div className="pull-right">
          10GB of <strong>250GB</strong> Free.
        </div>
        <div>
          <strong>Copyright</strong> Example Company © 2014-2017
        </div>
      </div>
    )
  }
}
