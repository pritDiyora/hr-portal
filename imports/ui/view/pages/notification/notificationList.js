import React, { Component, PropTypes } from 'react';
import 'react-toastify/dist/ReactToastify.css';

class NotificationList extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <div className="wrapper wrapper-content animated fadeInRight" >
          <div className="ibox ">
            <div className="ibox-content">
              <div className="col-lg-12">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li >
                      <div className="checkbox-inline">
                        <input type="checkbox" className="checkbox-inline"/>
                        <label>Select All</label>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-md-3 rightside">
                  <ul className="list-unstyled">
                    <li>
                      <i className="fa fa-envelope"> Mark as Unread</i>&nbsp;&nbsp;&nbsp;
                      <i className="fa fa-envelope-o"> Mark as Read</i>&nbsp;&nbsp;&nbsp;
                      <i className="fa fa-trash-o"> Mark as Unread</i>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default NotificationList

