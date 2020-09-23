import React, { Component } from 'react'
import moment from 'moment';
import IboxTools from '../../layout/iboxTools';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Attendance from '../../../../api/attendance/attendance'
var Sugar = require('sugar');
class EmployeeAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPunchIn: [],
      isPunchOut: [],
      diffs: [],
      toDayProgress: 0,
      monthProgress: 0,
      weekProgress: 0,
      overTimeProgress: 0,
      breakTime: 0
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setProgress()
      this.setWeekProgress()
      this.setMonthProgress()
    }, 1000);
  }
  componentWillReceiveProps(nextProps) {
    this.setProgress()
    this.setWeekProgress()
    this.setMonthProgress()
    this.setBreakTime()
    
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  setProgress() {
    if (this.props.todayInOutList.length > 0) {
      let diffs = [];
      let getisPunchIn = this.props.todayInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.todayInOutList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      getPunchInTime.map((t, index) => {
        let getInTime = moment(t);
        let getOutTime = getPunchOutTime && getPunchOutTime[index] ? moment(getPunchOutTime[index]) : moment();
        let getDiff = getOutTime.diff(getInTime, "minutes");
        diffs.push(getDiff);
      })
      this.setState({
        isPunchIn: getPunchInTime,
        isPunchOut: getPunchOutTime,
        diffs,
        toDayCountHrs:(Sugar.Array.sum(diffs) / 60).toFixed(2),
        toDayProgress: ((Sugar.Array.sum(diffs) / 60) * 100 / 8).toFixed(2),
      })  

    }
  }
  setWeekProgress() {
    if (this.props.weekInOutList.length > 0) {
      let diffs = [];
      let getisPunchIn = this.props.weekInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.weekInOutList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      getPunchInTime.map((t, index) => {
        let getInTime = moment(t);
        let getOutTime = getPunchOutTime && getPunchOutTime[index] ? moment(getPunchOutTime[index]) : moment();
        let getDiff = getOutTime.diff(getInTime, "minutes");
        diffs.push(getDiff);
      })
      this.setState({
        isPunchIn: getPunchInTime,
        isPunchOut: getPunchOutTime,
        diffs,
        weekCountHrs: (Sugar.Array.sum(diffs) / 60).toFixed(2),
        weekProgress: ((Sugar.Array.sum(diffs) / 60) * 100 / 44).toFixed(2),
      })

    }
  }
  setMonthProgress() {
    if (this.props.monthInOutList.length > 0) {
      let diffs = [];
      let getisPunchIn = this.props.monthInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.monthInOutList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      getPunchInTime.map((t, index) => {
        let getInTime = moment(t);
        let getOutTime = getPunchOutTime && getPunchOutTime[index] ? moment(getPunchOutTime[index]) : moment();
        let getDiff = getOutTime.diff(getInTime, "minutes");
        diffs.push(getDiff);
      })
      this.setState({
        isPunchIn: getPunchInTime,
        isPunchOut: getPunchOutTime,
        diffs,
        monthCountHrs: (Sugar.Array.sum(diffs) / 60).toFixed(2),
        monthProgress: (((Sugar.Array.sum(diffs) / 60) * 100 / 176) / 100 * 176).toFixed(2)
      })

    }
  }
  setOverTimeProgress() {
    if (this.props.monthInOutList.length > 0) {
      let diffs = [];
      let getisPunchIn = this.props.monthInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.monthInOutList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      getPunchInTime.map((t, index) => {
        let getInTime = moment(t);
        let getOutTime = getPunchOutTime && getPunchOutTime[index] ? moment(getPunchOutTime[index]) : moment();
        let getDiff = getOutTime.diff(getInTime, "minutes");
        diffs.push(getDiff);
      })
      this.setState({
        isPunchIn: getPunchInTime,
        isPunchOut: getPunchOutTime,
        diffs,
        overTimeProgress: ((Sugar.Array.sum(diffs) / 60) * 100 / 180).toFixed(2)
      })

    }
  }

  setBreakTime() {
    if (this.props.monthInOutList.length > 0) {
      let diffs = [];
      let punchIn = [];
      let punchOut = [];
      let getisPunchIn = this.props.monthInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.monthInOutList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      let getInTime = moment(getPunchInTime);
      punchIn.push(getInTime)
      
      let getOutTime =  moment(getPunchOutTime);
      punchOut.push(getOutTime)
      
      let getDiff = getOutTime.diff(getInTime, "minutes");
      diffs.push(getDiff);
      
      this.setState({
        punchIn,
        punchOut,
        diffs,
        breakTime: diffs
      })

    }
  }

  render() {
    let { todayInOutList } = this.props;
    return (
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-sm-4">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Timesheet</h5>
                <IboxTools />
              </div>
              <div className="ibox-content no-padding">
                <ul className="list-group">
                  <li className="list-group-item">
                    <h4>Punch In at</h4><span>{todayInOutList && todayInOutList.dateTime}</span>
                    <p>{moment().format("dddd, MMMM Do YYYY")} <span>{todayInOutList && todayInOutList.dateTime}</span></p>
                  </li>
                  <li className="list-group-item">
                    <span>{this.state.toDayCountHrs} hrs</span>
                  </li>
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-lg-6">
                        <p>Break</p>                      
                        <h5>{this.state.breakTime} hrs</h5>
                      </div>
                      <div className="col-lg-6">
                        <p>Overtime</p>
                        <h5>{this.state.overTimeProgress} hrs</h5>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Statistics</h5>
                <IboxTools />
              </div>
              <div className="ibox-content no-padding">
                <ul className="list-group">
                  <li className="list-group-item">
                    <p>Today: <strong>{this.state.toDayCountHrs} hrs / 8 hrs</strong></p>
                    <div className="progress">
                      <div className="progress-bar progress-bar-striped progress-bar-primary"
                        style={{ width: this.state.toDayProgress + "%" }}
                        role="progressbar"
                        aria-valuenow={this.state.toDayProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"></div>
                    </div>
                  </li>

                  <li className="list-group-item">
                    <p>This Week: <strong>{this.state.weekCountHrs} hrs / 44 hrs</strong></p>
                    <div className="progress">
                      <div className="progress-bar progress-bar-striped progress-bar-warning"
                        style={{ width: this.state.weekProgress + "%" }}
                        role="progressbar"
                        aria-valuenow={this.state.weekProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"></div>
                    </div>
                  </li>

                  <li className="list-group-item">
                    <p>This Month: <strong>{this.state.monthCountHrs} hrs / 176 hrs</strong></p>
                    <div className="progress">
                      <div className="progress-bar progress-bar-striped progress-bar-success"
                        style={{ width: this.state.monthProgress + "%" }}
                        role="progressbar"
                        aria-valuenow={this.state.monthProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"></div>
                    </div>
                  </li>

                  <li className="list-group-item">
                    <p>Overtime: <strong>{this.state.overTimeProgress}</strong></p>
                    <div className="progress">
                      <div className="progress-bar progress-bar-striped progress-bar-info"
                        style={{ width: this.state.overTimeProgress }}
                        role="progressbar"
                        aria-valuenow={this.state.overTimeProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Today Activity</h5>
                <IboxTools />
              </div>
              <div className="ibox-content no-padding">
                <ul className="list-group">
                  <li className="list-group-item pt-0">
                    <div>
                      {todayInOutList.length ? todayInOutList.map((attendance) => (
                        <div className="row" key={attendance._id}>
                          <div className="clearfix mt-20">
                            <div className="col-lg-2 col-md-3 col-sm-3 col-xs-3 imgDiv">
                              <img src={`img/${attendance.isCheckIn ? "punch_in" : "punch_out"}.png`} alt="image" height="50px" />
                            </div>
                            <div className="col-lg-10 col-md-9 col-sm-9 col-xs-9 listView">
                              <h3>Punch {attendance.isCheckIn ? "In" : "Out"}</h3>
                              <span>{moment(attendance.dateTime).format('hh:mm:ss A')}</span>
                            </div>
                          </div>
                        </div>
                      )) : <div className="no-events">Today time not available</div>}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withTracker(() => {
  Meteor.subscribe('checkInOutList');
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);

  let curr = new Date()
  let first = curr.getDate() - curr.getDay()
  let last = first + 6
  let firstDay = new Date(curr.setDate(first))
  let lastDay = new Date(curr.setDate(last))

  let monthData = new Date()
  monthData.setMonth(monthData.getMonth())
  return {
    todayInOutList: Attendance.find({ "userId": Meteor.userId(), "dateTime": { $gte: start, $lt: end } }, { sort: { "dateTime": -1 } }).fetch(),
    weekInOutList: Attendance.find({ "userId": Meteor.userId(), "dateTime": { $gte: firstDay, $lt: lastDay }}).fetch(),
    monthInOutList: Attendance.find({ "userId": Meteor.userId(), "dateTime": { $lte: monthData }}).fetch()
  }
})(EmployeeAttendance); 