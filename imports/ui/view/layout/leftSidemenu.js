import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Avatar from 'react-avatar';
class LeftSidemenu extends Component {

  constructor(props) {
    super(props);
    this.state = { permission: false, superAdminPermissiom: false, src: "" };
  }
  componentWillMount() {
    this.AccessPermission()
    this.Permission()
  }
  componentDidMount() {
    $('#side-menu').metisMenu();
  }
  AccessPermission() {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    if (!user || !user.profile || !user.profile.userType) {
      return false;
    }
    var usertype = user && user.profile && user.profile.userType;
    if (usertype == "superadmin"
      || usertype == "admin") {
      this.setState({ permission: true });
    } else {
      this.setState({ permission: false });
    }
  }
  Permission() {
    let user = JSON.parse(localStorage.getItem('user')) || {};
    if (!user || !user.profile || !user.profile.userType) {
      return false;
    }
    var usertype = user && user.profile && user.profile.userType;
    if (usertype == "employee"
      || usertype == "admin") {
      this.setState({ superAdminPermissiom: true });
    } else {
      this.setState({ superAdminPermissiom: false });
    }
  }

  profUpdate(e) {
    e.preventDefault();
    $('#profile').toggleClass('open');
  }
  logout(e) {
    e.preventDefault();
    Meteor.logout(() => {
      localStorage.removeItem('user');
      FlowRouter.go('/');
    });
  }
  render() {
    let { currentUser } = this.props, { permission, superAdminPermissiom } = this.state;
    let profilepic = currentUser && currentUser.profile && currentUser.profile.profilePic;
    let lastname = `${currentUser && currentUser.profile && currentUser.profile.lastName}`;
    let firsname=`${currentUser && currentUser.profile && currentUser.profile.firstName}`;
    let profilephoto = `${Meteor.absoluteUrl()}cfs/files/images/${profilepic}`;
    return (
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <div id="profile" className="dropdown profile-element">
                <span>
                  {profilepic == undefined ? <p style={{fontSize:"16px"}} data-letters={`${firsname.charAt(0)}${lastname.charAt(0)}`} /> : <img src={profilephoto}
                    className="img-circle"  height="50" width="50"
                  />}
                </span>
                <a data-toggle="dropdown" className="dropdown-toggle" href="" onClick={(e) => this.profUpdate(e)}>
                  <span className="clear"> <span className="block m-t-xs">
                    <strong className="font-bold">{currentUser && currentUser.profile && currentUser.profile.firstName}</strong>

                  </span>
                    <span className="text-muted text-xs block">{currentUser && currentUser.profile && currentUser.profile.designation}<b className="caret"></b></span> </span> </a>
                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li><a href="/profile">Profile</a></li>
                  <li className="divider"></li>
                  <li><a href="#" onClick={(e) => this.logout(e)}>Logout</a></li>
                </ul>
              </div>
              <div className="logo-element">
                IN+
                  </div>
            </li>
            <li className="active">
              <a><i className="fa fa-th-large"></i> <span className="nav-label">Dashboards</span> <span className="fa arrow"></span></a>
              <ul className="nav nav-second-level collapse">
                <li><a href="/dashboard">Dashboard v.1</a></li>
              </ul>
            </li>
            {permission ?
              <li>
                <a><i className="fa fa-users"></i> <span className="nav-label">Users</span><span className="fa arrow"></span></a>
                <ul className="nav nav-second-level collapse">
                  <li><a href="/insertuser">Add Employee</a></li>
                  <li><a href="/listuser">List Employee</a></li>
                </ul>
              </li> :
              <a href="/accesspermission"></a>
            }

            {permission ?
              <li>
                <a><i className="fa fa-map-marker"></i> <span className="nav-label">Location</span><span className="fa arrow"></span></a>
                <ul className="nav nav-second-level collapse">
                  <li><a href="/country">Country</a></li>
                  <li> <a href="/state">State</a></li>
                  <li><a href="/city">City</a> </li>
                </ul>
              </li> :
              <a href="/accesspermission"></a>
            }

            {permission ?
              <li>
                <a><i className=" fa fa-calendar-minus-o"></i> <span className="nav-label">Leave</span><span className="fa arrow"></span></a>
                <ul className="nav nav-second-level collapse">
                  <li><a href="/leaveType">Leave Type</a></li>
                  <li><a href="/leaveApproveList">Leave Approve List</a> </li>
                </ul>
              </li> :
              <a href="/accesspermission"></a>
            }
            {permission ?
              <li>
                <a href="#"><i className="fa fa-calendar"></i> <span className="nav-label">Admin Attendance</span><span className="fa arrow"></span></a>
                <ul className="nav nav-second-level collapse">
                  <li><a href="/adminAttendance">Admin Attendance</a></li>
                  <li><a href="/adminTodayAttendance">Today Attendance</a> </li>
                </ul>
              </li> :
              <a href="/accesspermission"></a>
            }
            {permission ? <li><a href="/generalSetting"><i className="fa fa-gear"></i> <span className="nav-label">General Setting</span></a> </li> : <a href="/accesspermission"></a>
            }
            {permission ? <li><a href="/holiday"><i className="fa fa-diamond"></i> <span className="nav-label">Holiday</span></a> </li> : <a href="/accesspermission"></a>
            }
            {permission ? <li><a href="/salary"><i className="fa fa-money"></i> <span className="nav-label">Salary</span></a> </li> : <a href="/accesspermission"></a>
            }
            {superAdminPermissiom ?
              <li><a href={`/task?id=${Meteor.userId()}`}><i className="fa fa-tasks"></i> <span className="nav-label">Task</span></a> </li>
              : <a href="/accesspermission"></a>}
            {superAdminPermissiom ?
              <li><a href={`/employeeAttendance?id=${Meteor.userId()}`}><i className="fa fa-clock-o"></i> <span className="nav-label">Employee Attendance</span></a> </li>
              : <a href="/accesspermission"></a>}
            {superAdminPermissiom ?
              <li><a href="/leave"><i className=" fa fa-calendar-minus-o"></i><span className="nav-label">Leave</span></a></li>
              : <a href="/accesspermission"></a>}
            {permission ? <li>
              <a href="/employeetasklist"><i className="fa fa-list-alt"></i><span className="nav-label">EmployeeTask List</span></a></li> : <a href="/accesspermission"></a>}
            <li>
              <a href="/requestMail"><i className="fa fa-envelope"></i><span className="nav-label">Request Mail</span></a>
            </li>
          </ul>

        </div>
      </nav>

    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('user');
  return {
    currentUser: Meteor.user()
  }
})(LeftSidemenu);


