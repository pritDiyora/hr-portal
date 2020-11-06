import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Attendance from '../../../api/attendance/attendance';
import moment from 'moment';
import Notification from '../../../api/notification/notification';
import Avatar from 'react-avatar';
class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      secondsElapsed: "",
      createdAt: this.props.createdAt,
      isLoading: false,
      show: true,
      count: undefined,
      name: '',
      notificationlist: []
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.checkInOutList !== this.props.checkInOutList) {
      this.setTiming();
    }
    this.setState({ notificationlist: nextProps.notifiationList });
  }
  componentDidMount() {
    this.notificationCount();
  }
  notificationCount() {
    const self = this;
    Meteor.call('notificationCount', Meteor.userId(), function (err, res) {
      if (!err) {
        self.setState({ count: res });
      }
    })
  }
  setTiming() {
    let chkInStatus = Meteor.user() && Meteor.user().profile.clockStatus;
    console.log('chkInStatus :: ', chkInStatus);
    if (chkInStatus == true) {
      this.countdown = setInterval(() => {
        let { checkInOutList } = this.props;
        let dateTime = checkInOutList && checkInOutList.dateTime && moment(checkInOutList.dateTime).format("HH:mm:ss");
        let currentTime = moment().format("HH:mm:ss")
        this.setState({
          secondsElapsed: moment.utc(moment(currentTime, "HH:mm:ss").diff(moment(dateTime, "HH:mm:ss"))).format("HH:mm:ss")
        })
      }, 1000);
    } else {
      this.setState({
        secondsElapsed: '00:00:00'
      }, () => {
        clearInterval(this.countdown);
      });
    }
  }
  toggleNavigation(e) {
    e.preventDefault();
    $("body").toggleClass("mini-navbar");
  }

  showMailNoti(e) {
    e.preventDefault();
    $('#dropdownNoti').toggleClass('open');
  }

  MsgNoti(e) {
    e.preventDefault();
    $('#dropdownMsgNoti').toggleClass('open');
  }
  logout(e) {
    e.preventDefault();
    Meteor.logout(() => {
      localStorage.removeItem('user');
      FlowRouter.go('/');
    });
  }

  clockInOut = () => {
    this.setState({
      isLoading: true
    })
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 1000)
    let value = {
      userId: Meteor.userId(),
      isCheckIn: !Meteor.user().profile.clockStatus,
      dateTime: new Date(),
      date: moment().format("YYYY-MM-DD"),
      createdBy: Meteor.userId(),
      modifiedBy: Meteor.userId()
    }
    Meteor.call('checkInOut', value);
  }
  getUserName(userid) {
    const self = this;
    let userInfo = this.props.userName && this.props.userName.find(user => user._id == userid);
    return userInfo.profile.firstName + ' ' + userInfo.profile.lastName;
  }
  handleLeaveItem(event, notificationId, notificationType) {
    event.preventDefault();
    const self = this;
    Meteor.call('statusReadable', notificationId, function (err, res) {
      if (!err) {
        self.notificationCount();
        FlowRouter.go(`/${notificationType}`);
      }
    })
  }
  render() {
    let { notificationlist } = this.state;
    return (
      <div className="row border-bottom">
        <nav className="navbar navbar-static-top" role="navigation" style={{ 'marginBottom': '0' }}>
          <div className="navbar-header">
            <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
            <form role="search" className="navbar-form-custom" action="search_results.html">
              <div className="form-group">
                <input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search" />
              </div>
            </form>
          </div>
          <ul className="nav navbar-top-links navbar-right">
            {Meteor.userId() && <li>
              <span type="button" className="btn btn-primary" id="btnModal" onClick={this.clockInOut} disabled={this.state.isLoading} style={{ fontSize: "12px" }}>
                {this.state.isLoading
                  ? <i className="fa fa-spinner fa-spin"></i>
                  : <>Clock In/Out <p className="no-margins" style={{ fontSize: "10px" }}>{this.state.secondsElapsed}</p></>
                }
              </span>
            </li>}
            <li id="dropdownNoti" className="dropdown">
              <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#" onClick={(e) => this.showMailNoti(e)}>
                <i className="fa fa-envelope"></i>

              </a>


            </li>
            <li id="dropdownMsgNoti" className="dropdown">
              <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#" onClick={(e) => this.MsgNoti(e)}>
                <i className="fa fa-bell"></i>
                {this.state.count == 0 ? " " : <span className="label label-warning">{this.state.count}</span>}
              </a>
              {
                this.state.count == 0 ? "" :
                  <ul className="dropdown-menu dropdown-alerts">
                    {
                      notificationlist.map((notification) => {
                        let firstname = this.getUserName(notification.sendId)
                        return (<li key={notification._id} >
                          <div className="dropdown-messages-box">
                            <a href="profile.html" className="pull-left">
                              <Avatar className="img-circle" size="40" color="#ffcccc" fgColor="#990000" name={firstname} maxInitials={2}
                              />
                            </a>
                            <div className="media-body" onClick={(e) => this.handleLeaveItem(e, notification._id, notification.type)}>
                              <small className="pull-right">{moment(notification.createdAtDate).fromNow()}</small>
                              <strong>{firstname}</strong>  <br />
                              <small className="text-muted">{notification.description}</small><br />
                              <small className="text-muted">{moment(notification.createdAtDate).fromNow()} at {moment(notification.createdAtDate).format('hh:mm')}
                           - {moment(notification.createdAtDate).format('DD.MM.YYYY')}</small>
                            </div>
                          </div>
                          <ul>
                            <li className="divider"></li>
                          </ul>
                        </li>
                        )
                      })
                    }
                    <li>
                      <div className="text-center link-block">
                        <a href="mailbox.html" className="dropdown-item">
                          <i className="fa fa-bell"></i> <strong>Read All Notofication</strong>
                        </a>
                      </div>
                    </li>
                  </ul>
              }
            </li>
            <li>
              <a href="/changePassword">
                <i className="fa fa-key"></i>
              ChangePassword
            </a>
            </li>
            <li>
              <a href="#" onClick={(e) => this.logout(e)}>
                <i className="fa fa-sign-out"></i> Log out
                  </a>
            </li>
          </ul>
        </nav>
      </div>

    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('checkInOutList');
  Meteor.subscribe('notificationList');
  Meteor.subscribe('getUserType');
  return {
    checkInOutList: Attendance.findOne({ "userId": Meteor.userId() }, { sort: { "dateTime": -1 } }),
    notifiationList: Notification.find({ receiverId: Meteor.userId(), isRead: false }).fetch(),
    userName: User.find({}).fetch()
  }
})(Header);

