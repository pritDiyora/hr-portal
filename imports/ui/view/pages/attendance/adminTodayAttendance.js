import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data'
import { id, tr } from 'date-fns/locale';

class AdminTodayAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedUser: [],
      userAttendanceIds: [],
      userIds: '',
      date: '',
      button: false,
      id: ""
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
        toast.error(err);
      }
    });
  }

  addAttendance(e) {
    let { userAttendanceIds, userIds, date } = this.state
    userIds = userAttendanceIds
    date = moment().format("YYYY-MM-DD")
    if(this.state.button == true){
      Meteor.call('updateAdminAttendance', userIds, date, this.state.id, function(err, result){
        if(!err){
          toast.success('Record Updated.. ' , result)
          this.setState({button: false})
        }else{
          toast.error('Record not updated..' + err)
        }
      })
    }else{
      Meteor.call('adminAttendance', userIds, date, function (err, result) {
        if (!err) {
          toast.success("Record Inserted...", result)
        } else {
          toast.error("Record not inserted..." + err);
        }
      })
    }
  }

  
  isCheckHandler(e) {
    let {userAttendanceIds} = this.state
    const {checked, value} = e.target
    if(checked){
      userAttendanceIds = [...userAttendanceIds, value];
    }else{
      userAttendanceIds = userAttendanceIds.filter(e1 => e1 !== value)
    }
    this.setState({
      userAttendanceIds
    },() => console.log(this.state.userAttendanceIds))
  }
  render() {
    return (
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Attendance</h5>
              </div>
              <div className="ibox-content">

                <h3 className="text-center"> {moment().format('DD/MM/YYYY')} </h3>

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
                      return (
                        <tr key={userId}>
                          <td>{name}</td>
                          <td>
                            <input type="checkbox"
                              value={userId}
                              onChange={(e) => this.isCheckHandler(e)}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>

                </table>
                <div className="text-center">
                  <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addAttendance(e) }}>Save</button>
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
  return {
    country: Country.find({}).fetch(),
    states: State.find({}).fetch(),
    city: Cities.find({}).fetch(),

  }
})(AdminTodayAttendance)