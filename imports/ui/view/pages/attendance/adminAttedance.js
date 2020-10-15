import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { toast } from 'react-toastify';
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import AdminAttendance from '../../../../api/attendance/adminAttendance'

class AdminAttendances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedUser: [],
      result: []
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
    month = moment().format("MM")
    year = moment().format("YYYY")
    var monthIndex = month - 1;
    var date = new Date(year, monthIndex, 1);
    while (date.getMonth() == monthIndex) {
      this.state.result.push(date.getDate())
      date.setDate(date.getDate() + 1);
    }
  }

  render() {
    let { adminAttendance } = this.props
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
                        {this.state.displayedUser.map((user, i) => {
                          let id = user._id
                          let name = user.profile.lastName + " " + user.profile.firstName + " " + user.profile.fatherName
                          return (
                            <tr key={i}>
                              <td>{name}</td>
                              {this.state.result.map((i, res) => {
                                return (
                                  <td key={i}>
                                    {
                                      adminAttendance.map((admin, i) => {
                                        let date = moment(admin.date).format("DD") - 1
                                        let check
                                        if (res == date) {
                                          if (admin.userIds == id) {
                                            check = <i key={i} className="fa fa-check text-info"></i>
                                          }else if(admin.userIds !== id){
                                            check = <i key={i} className="fa fa-close text-danger"></i>
                                          }
                                        }
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
  return {
    adminAttendance: AdminAttendance.find({}).fetch(),
    country: Country.find({}).fetch(),
    states: State.find({}).fetch(),
    city: Cities.find({}).fetch()
  }
})(AdminAttendances)
