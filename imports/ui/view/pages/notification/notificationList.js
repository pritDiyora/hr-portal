import React, { Component, PropTypes } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Notification from '../../../../api/notification/notification';
import Avatar from 'react-avatar';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import { th, tr } from 'date-fns/locale';
class NotificationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notificationlist: [],
      count: undefined,
      isChecked: null,
      markRead: [],
      // checkedItems: new Map(),
      // isAllSelected: false,
    }
  }
  componentDidMount() {
    this.getNotificationData();
    this.notificationCount();
  }
  getNotificationData() {
    let self = this;
    Meteor.call('AllNotificationData', Meteor.userId(), function (err, res) {
      if (!err) {
        self.setState({ notificationlist: res });
      }
    });
  }
  handleLeaveItem(event, notificationId, notificationType) {
    event.preventDefault();
    const self = this;
    FlowRouter.go(`/${notificationType}`);
    Meteor.call('statusReadable', notificationId, function (err, res) {
      if (!err) {
        self.getNotificationData();
        self.notificationCount();
      }
    })
  }
  notificationCount() {
    const self = this;
    Meteor.call('notificationCount', Meteor.userId(), function (err, res) {
      if (!err) {
        self.setState({ count: res });
      }
    })
  }
  isReadNotification(event, notificationId, notificationisRead) {
    event.preventDefault();
    const self = this;
    if (notificationisRead == true) {
      Meteor.call('statusReadableFalse', notificationId, notificationisRead, function (err, res) {
        if (!err) {
          self.getNotificationData();
        }
      })
    } else {
      Meteor.call('statusReadableFalse', notificationId, notificationisRead, function (err, res) {
        if (!err) {
          self.getNotificationData();
        }
      })
    }
  }
  deleteNotification(event, notificationId) {
    event.preventDefault();
    const self = this;
    Meteor.call('notificationDelete', notificationId, function (err, res) {
      if (!err) {
        toast.success('Notification Deleted Sucessfully..', res);
        self.getNotificationData();
      }
    })
  }
  checkBoxChangeHandlar(event, checked, id) {
    event.preventDefault();
    const self = this, markRead = [];
    if (checked == true) {
      Meteor.call('isChecked', checked, id, function (err, res) {
        if (!err) {
          // markRead.push(id);
          // self.setState({ markRead });
          self.getNotificationData();
        }
      })
    } else {
      Meteor.call('isChecked', checked, id, function (err, res) {
        if (!err) {
          self.getNotificationData();
        }
      })
    }

  }
  render() {
    let { notificationlist } = this.state;
    return (
      <div className="wrapper wrapper-content animated fadeInRight" >
        <div className="container-fluid">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <div className="ibox ">
              <div className="ibox-content">
                <div className="col-md-12">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="col-md-12" style={{ paddingLeft: "7px" }}>
                        <div className="checkbox-inline form-check abc-checkbox abc-checkbox-success form-check-inline">
                          <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="false" />
                          <label className="form-check-label" htmlFor="inlineCheckbox2" style={{ paddingLeft: "15px" }}> Select All  </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-5" style={{ textAlign: "right" }}>
                    <ul className="list-unstyled">
                      <li>
                        <i className="fa fa-envelope"> Mark as Unread</i>&nbsp;&nbsp;&nbsp;
                          <i className="fa fa-envelope-open"> Mark as Read</i>&nbsp;&nbsp;&nbsp;
                          <i className="fa fa-trash-o"> Delete</i>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
            {
              notificationlist.map((notification) => {
                let bgcolor = notification.isRead ? "#FFFFFF" : "#EFFBFF";
                return (
                  <div key={notification._id} className="ibox notificationlist">
                    <div className="ibox-content-notification" style={{ height: "70px", backgroundColor: bgcolor }}  >
                      <div className="col-md-12" style={{ paddingTop: "0px" }}>
                        <div className="col-md-2">
                          <div className="checkbox-inline form-check abc-checkbox abc-checkbox-success form-check-inline" style={{ marginLeft: "10px" }}>
                            <input className="form-check-input"
                              type="checkbox"
                              name="markRead"
                              id={`${notification._id}`}
                              value={`${notification._id}`}
                              checked={notification.isChecked == true}
                              onChange={(e) => this.checkBoxChangeHandlar(e, notification.isChecked, notification._id)}
                            />
                            <label className="form-check-label" htmlFor={`${notification._id}`} style={{ paddingLeft: "15px" }}></label>
                          </div>
                          <a href="profile.html" style={{ marginLeft: "10px" }} >
                            <Avatar className="img-circle" size="40" color="#ffcccc" fgColor="#990000" name="d" maxInitials={2}
                            />
                          </a>
                        </div>
                        <div className="col-md-6" style={{ paddingLeft: "0px", cursor: "pointer" }} onClick={(e) => this.handleLeaveItem(e, notification._id, notification.type)}>
                          <div className="media-body" style={{ paddingTop: "0px" }}>
                            <span className="text-muted desc">{notification.description}</span><br />
                            <small className="text-muted">{moment(notification.createdAtDate).fromNow()} at {moment(notification.createdAtDate).format('hh:mm')}
                                   - {moment(notification.createdAtDate).format('DD.MM.YYYY')}</small>
                          </div>
                        </div>
                        <div className="col-md-4">
                          {notification.isRead ? <a className="btn btn-xs btn-primary" style={{ float: "right", cursor: "pointer" }} onClick={(e) => this.isReadNotification(e, notification._id, notification.isRead)}><i className="fa fa-envelope-open"></i></a> :
                            <a className="btn btn-xs btn-primary" style={{ float: "right", cursor: "pointer" }} onClick={(e) => this.isReadNotification(e, notification._id, notification.isRead)}><i className="fa fa-envelope"></i></a>}
                          <a className="btn btn-xs btn-danger" style={{ float: "right" }} onClick={(e) => this.deleteNotification(e, notification._id)}><i className="fa fa-trash"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="col-md-2"></div>
        </div>

      </div>
    )
  }
}
// function CheckBox({name, value, tick, onCheck}) {
//   return (
//       <label>
//           <input
//               name={name}
//               type="checkbox"
//               value={value}
//               checked={tick || false}
//               onChange={onCheck}
//           />
//           {value}
//       </label>
//   );
// }

// function CheckBoxList ({options, isCheckedAll, onCheck}) {
//   const checkBoxOptions = (
//       <div className="checkbox-list">
//           {options.map((option, index) => {
//               return (
//                   <CheckBox key={index} name={option.name} value={option.value} tick={option.checked} onCheck={(e) => onCheck(option.value, e.target.checked)} />
//               );
//           })}
//       </div>
//   );

//   return (
//       <div className="checkbox-list">
//           <CheckBox name="select-all" value="ALL" tick={isCheckedAll} onCheck={(e) => onCheck('all', e.target.checked)} />
//           {checkBoxOptions}
//       </div>
//   );
// }
// class CityList extends React.Component {
//   constructor(props) {
//       super(props);

//       this.state = {
//           isAllSelected: false,
//           checkList: [
//               {
//                   name: "city",
//                   value: "bangalore",
//                   checked: false,
//               },
//               {
//                   name: "city",
//                   value: "chennai",
//                   checked: false,
//               },
//               {
//                   name: "city",
//                   value: "delhi",
//                   checked: false,
//               }
//           ]
//       };
//   }

//   onCheckBoxChange(checkName, isChecked) {
//       let isAllChecked = (checkName === 'all' && isChecked);
//       let isAllUnChecked = (checkName === 'all' && !isChecked);
//       const checked = isChecked;

//       const checkList = this.state.checkList.map((city, index) => {
//           if(isAllChecked || city.value === checkName) {
//               return Object.assign({}, city, {
//                   checked,
//               });
//           } else if (isAllUnChecked) {
//               return Object.assign({}, city, {
//                   checked: false,
//               });
//           }

//           return city;
//       });

//       let isAllSelected = (checkList.findIndex((item) => item.checked === false) === -1) || isAllChecked;

//       this.setState({
//           checkList,
//           isAllSelected,
//       });

//   }

//   render() {
//       return (<CheckBoxList options={this.state.checkList} isCheckedAll={this.state.isAllSelected} onCheck={this.onCheckBoxChange.bind(this)} />);
//   }
// }


export default withTracker(() => {
  Meteor.subscribe('notificationList');
  Meteor.subscribe('getUserType');
  return {
    notifiationList: Notification.find({ receiverId: Meteor.userId(), isRead: false }).fetch(),
    userName: User.find({}).fetch()
  }
})(NotificationList);

