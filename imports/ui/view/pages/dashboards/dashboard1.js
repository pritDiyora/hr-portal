import React,{Component,PropTypes} from 'react';
import ReactDOM,{render} from 'react-dom';
import Header from '/imports/ui/view/layout/header.js'
import IboxTools from '/imports/ui/view/layout/iboxTools.js'

export default class Dashboard1 extends Component {

  render(){
    return(
      <div id="">
      <div className="row  border-bottom white-bg dashboard-header">
          <div className="col-md-12">
              <h2>Welcome Amelia</h2>
              <small>You have 42 messages and 6 notifications.</small>
              <ul className="list-group clear-list m-t">
                  <li className="list-group-item fist-item">
                      <span className="pull-right">
                          09:00 pm
                      </span>
                      <span className="label label-success">1</span> Please contact me
                  </li>
                  <li className="list-group-item">
                      <span className="pull-right">
                          10:16 am
                      </span>
                      <span className="label label-info">2</span> Sign a contract
                  </li>
                  <li className="list-group-item">
                      <span className="pull-right">
                          08:22 pm
                      </span>
                      <span className="label label-primary">3</span> Open new shop
                  </li>
                  <li className="list-group-item">
                      <span className="pull-right">
                          11:06 pm
                      </span>
                      <span className="label label-default">4</span> Call back to Sylvia
                  </li>
                  <li className="list-group-item">
                      <span className="pull-right">
                          12:00 am
                      </span>
                      <span className="label label-primary">5</span> Write a letter to Sandra
                  </li>
              </ul>
          </div>
      </div>
     </div>
    )
  }
}
