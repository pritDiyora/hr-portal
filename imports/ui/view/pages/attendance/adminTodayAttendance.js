import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data'
import AdminAttendance from '../../../../api/attendance/adminAttendance'

class AdminTodayAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAttendanceIds: [],
      userIds: '',
      date: '',
      button: false,
      adminId: ""
    }
  }

  addAttendance(e) {
    let { userAttendanceIds, userIds, date } = this.state
    userIds = userAttendanceIds
    date = moment().format("YYYY/MM/DD")

    if (this.state.button == true) {
      Meteor.call('updateAdminAttendance', userIds, this.state.adminId, function (err, result) {
        if (!err) {
          toast.success('Adminattendance updated successfully...', result)
        } else {
          toast.error(err.message)
        }
      })
    } else {
      Meteor.call('adminAttendance', userIds, date, function (err, result) {
        if (!err) {
          toast.success("Adminattendance added successfully...", result)
        } else {
          toast.error(err.message);
        }
      })
    }

  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      userAttendanceIds: nextProps.adminAttendance && nextProps.adminAttendance.userIds || [],
      adminId: nextProps.adminAttendance && nextProps.adminAttendance._id,
      button: true
    })
  }
  isCheckHandler(e, id) {
    let { userAttendanceIds } = this.state
    const { checked } = e.target
    if (checked) {
      userAttendanceIds = [...userAttendanceIds, id];
    } else {
      userAttendanceIds = userAttendanceIds.filter(e1 => e1 !== id)
    }
    this.setState({
      userAttendanceIds
    })
  }


  render() {
    let { userAttendanceIds } = this.state;
    return (
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Attendance</h5>
              </div>
              <div className="ibox-content">
                <center>
                  <h3 className="text-center bg-info p-xs b-r-sm" style={{width: "110px"}}> {moment().format('DD/MM/YYYY')} </h3>
                </center>

                <table className="table table-striped table-bordered table-hover dataTables-example dataTable">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.users.map((user) => {
                      let userId = user._id
                      let name = user.profile.lastName + " " + user.profile.firstName + " " + user.profile.fatherName;
                      let isCheck = userAttendanceIds.find(d => d == userId);
                      return (
                        <tr key={userId}>
                          <td>{name}</td>
                          <td>
                            <input type="checkbox"
                              checked={!!isCheck}
                              onChange={(e) => this.isCheckHandler(e, userId)}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>

                </table>
                <div className="text-center">
                  {this.state.button ? <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addAttendance(e) }}>Save</button>
                    : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addAttendance(e) }}>Save</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withTracker(() => {
  Meteor.subscribe('adminAttendanceData');
  Meteor.subscribe('user');
  return {
    users: User.find({'profile.userType': {$in:["admin","employee"]}}).fetch(),
    adminAttendance: AdminAttendance.findOne({ date: moment().format('YYYY/MM/DD') }),
  }
})(AdminTodayAttendance)