import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { toast } from 'react-toastify';
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import AdminAttendance from '../../../../api/attendance/adminAttendance'
import Holiday from '../../../../api/holiday/holidaySchema';
import Leave from '../../../../api/leave/leaveScheme';
import { tr } from 'date-fns/locale';

class AdminAttendances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedUser: [],
      result: [],
      displayedHoliday: [],
      holidaydate: ''
    }
  }
  componentDidMount() {
    this.getUser();
    this.getDaysArray();
    

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
    month = moment().format("MM");
    year = moment().format("YYYY")
    var monthIndex = month - 1;
    var date = new Date(year, monthIndex, 1);
    while (date.getMonth() == monthIndex) {
      this.state.result.push(date.getDate())
      date.setDate(date.getDate() + 1);
    }
  }
  getHolidayData(data) {
    let holiday = [];
    let monthHoliday = moment(data).format("MM")
    let month = moment().format("MM");
    let yearHoliday = moment(data).format("YYYY")
    let year = moment().format("YYYY")
    var monthIndex = month - 1;
    var date = new Date(year, monthIndex, 1)
    while (date.getMonth() === monthIndex) {
      if (date.getDay() === 0) {
        holiday.push(date.getDate())
      }
      date.setDate(date.getDate() + 1);
    }
    if (year == yearHoliday) {
      if (month == monthHoliday) {
        let date = moment(data).format("DD")
        holiday.push(parseInt(date))
        holiday.map((holiday) => holiday)
      }
    }
    return holiday
  }

  getLeaveData(start, end, approve) {
    let dayOfDate = []
    let monthStartLeave = moment(start).format("MM");
    let month = moment().format("MM");
    let yearStartLeave = moment(start).format("YYYY");
    let year = moment().format("YYYY");
    if(approve == true){
      if (year == yearStartLeave) {
        if (month == monthStartLeave) {
          let startdate = moment(start);
          let edate = moment(end);
          let enddate = moment(edate - 1)
          while (enddate > startdate || startdate.format('DD') === enddate.format('DD')) {
            dayOfDate.push(startdate.format('DD'));
            startdate.add(1, 'day');
          }
          dayOfDate.map((dayOfDate) => dayOfDate)
        }
      }
    }
    return dayOfDate
  }

  getAdminAttendanceData(data) {
    let date;
    let monthAttendance = moment(data).format("MM")
    let month = moment().format("MM");
    let yearAttendance = moment(data).format("YYYY")
    let year = moment().format("YYYY")
    if (year == yearAttendance) {
      if (month == monthAttendance) {
        date = moment(data).format("DD")
      }
    }
    return date
  }

  render() {
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
                              {this.state.result.map((res) => {
                                let check
                                let isHoliday = false, isLeave = false, isPresent = false, isAbsent = false;
                                this.props.adminAttendance.map((admin) => {
                                  let adminAtten = this.getAdminAttendanceData(admin.date)
                                  if (res == adminAtten) {
                                    if (admin.userIds.indexOf(id) > -1) {
                                      check = <i className="fa fa-check text-info"></i>
                                    } else {
                                      check = <i className="fa fa-close text-danger"></i>
                                    }
                                  }
                                })
                                this.props.leave.map((le) => {
                                  let leave = this.getLeaveData(le.startDate, le.endDate, le.isApprove)
                                  if (id == le.userId) {
                                    leave.find((leav) => {
                                      if (res == leav) {
                                        check = <img src="img/leave.png" alt="image" width="15px" />
                                      }
                                    })
                                  }
                                })
                                this.props.holidays.map((holi) => {
                                  let holiday = this.getHolidayData(holi.holidaydate);
                                  holiday.find((holiDay) => {
                                    if (holiDay == res) {
                                      check = <i className="fa fa-minus text-success"></i>
                                    }
                                  })
                                })
                                return (<td key={res}> {check}</td>)
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
      </div >
    )
  }
}
export default withTracker(() => {
  Meteor.subscribe('CountryData');
  Meteor.subscribe('Statedata');
  Meteor.subscribe('Citydata');
  Meteor.subscribe('adminAttendanceData');
  Meteor.subscribe('holiday')
  Meteor.subscribe('ListleaveApply')
  return {
    adminAttendance: AdminAttendance.find({}).fetch(),
    country: Country.find({}).fetch(),
    states: State.find({}).fetch(),
    city: Cities.find({}).fetch(),
    holidays: Holiday.find({}).fetch(),
    leave: Leave.find({}).fetch()
  }
})(AdminAttendances)
