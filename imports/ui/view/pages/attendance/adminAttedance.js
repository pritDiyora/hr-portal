import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { toast } from 'react-toastify';
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import AdminAttendance from '../../../../api/attendance/adminAttendance'
import Holiday from '../../../../api/holiday/holidaySchema';

class AdminAttendances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedUser: [],
      result: [],
      holiday: [],

    }
  }
  componentDidMount() {
    this.getUser();
    this.getDaysArray();
    this.getHoliday();
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
        toast.error(err);
      }
    });
  }

  getDaysArray = (year, month) => {
    month = moment().format("MM")
    year = moment().format("YYYY")
    var monthIndex = month - 1;
    var date = new Date(year, monthIndex, 1);
    // console.log("date :: " , date);
    while (date.getMonth() == monthIndex) {
      this.state.result.push(date.getDate())
      date.setDate(date.getDate() + 1);
    }
  }

  getHoliday = (year, month) => {
    month = moment().format("MM")
    year = moment().format("YYYY")
    var monthIndex = month - 1;
    var date = new Date(year, monthIndex, 1)
    while (date.getMonth() === monthIndex) {
      if (date.getDay() === 0) {
        this.state.holiday.push(date.getDate())
      }
      date.setDate(date.getDate() + 1);
    }
    console.log("holiday :: ", this.state.holiday);
  }

  render() {
    let { adminAttendance, holidays } = this.props
    // console.log("holiday :: " , holidays);
    return (
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Attendance Sheet</h5>
              </div>
              <div className="ibox-content">
                <div className="container-fluid">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered table-hover dataTables-example dataTable" id="dataTables-example">
                      <thead>
                        <tr>
                          <th>Employee Name</th>
                          {
                            this.state.result.map((res, i) =>
                              <th key={i}>{res}</th>
                            )
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.displayedUser.map((user) => {
                          let id = user._id
                          let name = user.profile.lastName + " " + user.profile.firstName + " " + user.profile.fatherName
                          return (
                            <tr key={id}>
                              <td>{name}</td>
                              {
                                this.state.result.map((res) => {

                                  // let chkIsHoliDay = false;
                                  // chkIsHoliDay = holidays.find((d) => { return moment(d.holidaydate).format("YYYY/MM/DD") == moment(`${moment().format("YYYY")}/${moment().format("MM")}/${res}`).format("YYYY/MM/DD") });
                                  // console.log('chkIsHoliDay :: ', chkIsHoliDay);

                                  return (
                                    <td key={res}>
                                      {
                                        adminAttendance.map((admin, i) => {
                                          console.log("admin :: " , admin);
                                          let check
                                          let monthAttendance = moment(admin.date).format("MM")
                                          let month = moment().format("MM")
                                          let yearAttendance = moment(admin.date).format("YYYY")
                                          let year = moment().format("YYYY")
                                          if (year == yearAttendance) {
                                            if (month == monthAttendance) {
                                              let date = moment(admin.date).format("DD")
                                              if (res == date) {
                                                if (admin.userIds.indexOf(id) > -1) {
                                                  check = <i key={i} className="fa fa-check text-info"></i>
                                                } else {
                                                  check = <i key={i} className="fa fa-close text-danger"></i>
                                                }
                                              }

                                            }
                                          }
                                          holidays.map((event) => {
                                            let monthHoliday = moment(event.holidaydate).format("MM")
                                            let month = moment().format("MM")
                                            let yearHoliday = moment(event.holidaydate).format("YYYY")
                                            let year = moment().format("YYYY")
                                            if (year == yearHoliday) {
                                              if (month == monthHoliday) {
                                                let date = moment(event.holidaydate).format("DD")
                                                this.state.holiday.push(date)
                                                this.state.holiday.map((holiday) => {
                                                  console.log("holiday :: " , holiday);
                                                  if (holiday == res) {
                                                    check = <i className="fa fa-minus"></i>
                                                  }
                                                })
                                              }
                                            }
                                          })

                                          return check
                                        })
                                      }
                                    </td>
                                  )
                                })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
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
  Meteor.subscribe('holiday')
  return {
    adminAttendance: AdminAttendance.find({}).fetch(),
    country: Country.find({}).fetch(),
    states: State.find({}).fetch(),
    city: Cities.find({}).fetch(),
    holidays: Holiday.find({}).fetch()
  }
})(AdminAttendances)
