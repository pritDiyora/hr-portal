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
      markRead: [],
      isSelectAll: false
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

  markAllUnRead(event) {
    event.preventDefault();
    const self = this;
    self.state.notificationlist.map((noti) => {
      let notificationisRead = noti.isRead
      self.state.markRead.map((unRead) => {
        if (notificationisRead == true) {
          Meteor.call('statusReadableFalse', unRead, notificationisRead, function (err, res) {
            if (!err) {
              self.getNotificationData();
            }
          })
        } else {
          Meteor.call('statusReadableFalse', unRead, notificationisRead, function (err, res) {
            if (!err) {
              self.getNotificationData();
            }
          })
        }
      })
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

  deleteAllNotification(event) {
    event.preventDefault();
    const self = this;
    self.state.markRead.map((del) => {
      Meteor.call('notificationDelete', del, function (err, res) {
        if (!err) {
          // toast.success('Notification Deleted Sucessfully..', res);
          self.getNotificationData();
        }
      })
      console.log('d :: ', d);
    })
  }

  selectAllChnageHandlar(e) {
    let { markRead } = this.state;
    const { checked } = e.target;
    console.log('checked :: ', checked);
    if (checked) {
      this.state.notificationlist.map((notification) => {
        markRead.push(notification._id);
      })
    } else {
      this.state.notificationlist.map((notification) => {
        markRead.pop(notification._id);
        
      })
    }
    this.setState({
      markRead
    })
  }

  
  checkBoxChangeHandlar(e, id) {
    let { markRead } = this.state;
    const { checked } = e.target;
    if (checked) {
      markRead = [...markRead, id]
    } else {
      markRead = markRead.filter(e1 => e1 !== id)
    }
    this.setState({
      markRead
    }, () => console.log('markRead :: ', markRead))
  }

  getUserName(userid) {
    let userInfo = this.props.userName && this.props.userName.find(user => user._id == userid);
    return `${userInfo && userInfo.profile && userInfo.profile.firstName}  ${userInfo && userInfo.profile && userInfo.profile.lastName}`;
  }
  getUserProfileImage(userid) {
    let userInfo = this.props.userName && this.props.userName.find(user => user._id == userid);
    return `${userInfo && userInfo.profile && userInfo.profile.profilePic}`;
  }

  render() {
    let { notificationlist } = this.state;

    return (
      <div className="wrapper wrapper-content animated fadeInRight" >
        <div className="container-fluid">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <div className="ibox ">
              <div className="ibox-content notificationlist" style={{paddingBottom: 35}}>
                <div className="col-md-12">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="col-md-12" style={{ paddingLeft: "7px" }}>
                        <div className="checkbox-inline form-check abc-checkbox abc-checkbox-success form-check-inline">
                          <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value={this.state.isSelectAll} onChange={(e) => this.selectAllChnageHandlar(e)} />
                          <label className="form-check-label" htmlFor="inlineCheckbox2" style={{ paddingLeft: "15px" }}> Select All  </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4 rightside">
                    <ul className="list-unstyled">
                      <li>
                        <i className="fa fa-envelope" style={{ cursor: "pointer" }} onClick={(e) => this.markAllUnRead(e)}> Mark as Unread</i>&nbsp;&nbsp;&nbsp;
                          <i className="fa fa-envelope-open" style={{ cursor: "pointer" }} onClick={(e) => this.markAllUnRead(e)}> Mark as Read</i>&nbsp;&nbsp;&nbsp;
                          <i className="fa fa-trash-o" style={{ cursor: "pointer" }} onClick={(e) => this.deleteAllNotification(e)}> Delete</i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {
              notificationlist.map((notification) => {
                let notificationIds = notification._id
                let bgcolor = notification.isRead ? "#FFFFFF" : "#EFFBFF";
                let firstname = this.getUserName(notification.sendId);
                let profilepic = this.getUserProfileImage(notification.sendId);
                let profilephoto = `${Meteor.absoluteUrl()}cfs/files/images/${profilepic}`;
                let check = this.state.markRead.find(chk => chk == notificationIds)
                return (
                  <div key={notification._id} className="ibox notificationlist">
                    <div className="ibox-content-notification" style={{ height: "70px", backgroundColor: bgcolor }}  >
                      <div className="col-md-12" style={{ paddingTop: "0px" }}>
                        <div className="col-md-2">
                          <div className="checkbox-inline form-check abc-checkbox abc-checkbox-success form-check-inline">
                            <input type="checkbox"
                              checked={!!check}
                              onChange={(e) => this.checkBoxChangeHandlar(e, notificationIds)}
                            />
                            <label className="form-check-label" htmlFor={`${notification._id}`} style={{ paddingLeft: "15px" }}></label>
                          </div>
                          <a href="/profile" style={{ marginLeft: "10px" }} >
                            {profilepic == "undefined" ? <Avatar src={firstname} className="img-circle" size="40" color="#ffcccc" fgColor="#990000" name={firstname} maxInitials={2}
                            /> : <img src={profilephoto} style={{ marginBottom: "10px" }}
                              className="img-circle" height="40" width="40"
                              />}
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

export default withTracker(() => {
  Meteor.subscribe('notificationList');
  Meteor.subscribe('getUserType');
  return {
    notifiationList: Notification.find({ receiverId: Meteor.userId(), isRead: false }).fetch(),
    userName: User.find({}).fetch()
  }
})(NotificationList);

