import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data'
import { id, tr } from 'date-fns/locale';
import AdminAttendance from '../../../../api/attendance/adminAttendance'

class AdminTodayAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedUser: [],
      userAttendanceIds: [],
      userIds: '',
      date: '',
      button: false,
      adminId: ""
    }
  }
  componentDidMount() {
    this.getUser();
  }

  getUser() {
    const self = this;
    let pipeline = [
      {
        "$lookup": {
          from: "country",
          localField: "address.0.country",
          foreignField: "_id",
          as: "countryname"
        }
      },
      { "$unwind": "$countryname" },
      {
        "$lookup": {
          from: "state",
          localField: "address.0.state",
          foreignField: "_id",
          as: "statename"
        }
      },
      { "$unwind": "$statename" },
      {
        "$lookup": {
          from: "city",
          localField: "address.0.city",
          foreignField: "_id",
          as: "cityname"
        }
      },
      { "$unwind": "$cityname" },
    ];
    Meteor.call("searchUser", pipeline, function (err, res) {
      if (!err) {
        self.setState({ displayedUser: res });
      } else {
        toast.error(err.message);
      }
    });
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
    let { adminAttendance } = this.props
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
                    {this.state.displayedUser.map((user) => {
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
  Meteor.subscribe('CountryData');
  Meteor.subscribe('Statedata');
  Meteor.subscribe('Citydata');
  Meteor.subscribe('adminAttendanceData');
  return {
    country: Country.find({}).fetch(),
    states: State.find({}).fetch(),
    city: Cities.find({}).fetch(),
    adminAttendance: AdminAttendance.findOne({ date: moment().format('YYYY/MM/DD') }),
  }
})(AdminTodayAttendance)