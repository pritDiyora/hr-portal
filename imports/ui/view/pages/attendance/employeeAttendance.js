import React, { Component } from 'react'
import moment from 'moment';
import IboxTools from '../../layout/iboxTools';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Attendance from '../../../../api/attendance/attendance'
import Pagination from "react-js-pagination";
var Sugar = require('sugar');
class EmployeeAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceData: [],
      toDayProgress: 0,
      monthProgress: 0,
      weekProgress: 0,
      overTimeProgress: 0,
      breakTime: 0,
      firstTime: 0,
      lastTime: 0,
    }
  }
  componentDidMount() {
    this.getDateList()
    this.interval = setInterval(() => {
      this.setProgress()
      this.setOverTimeProgress()
      this.setBreakTime()

    }, 1000);

  }
  componentWillReceiveProps(nextProps) {
    this.setProgress()
    this.setOverTimeProgress()
    this.setBreakTime()

  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setProgress() {
    if (this.props.todayInOutList.length > 0 && this.props.weekInOutList.length > 0 && this.props.monthInOutList.length > 0) {
      let diffs = [], diffs1 = [], diffs2 = [];
      let getisPunchIn = this.props.todayInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.todayInOutList.filter((a) => !a.isCheckIn)
      let getisPunchIn1 = this.props.weekInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut1 = this.props.weekInOutList.filter((a) => !a.isCheckIn)
      let getisPunchIn2 = this.props.monthInOutList.filter((a) => a.isCheckIn)
      let getisPunchOut2 = this.props.monthInOutList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      let getPunchInTime1 = _.pluck(getisPunchIn1, 'dateTime');
      let getPunchOutTime1 = _.pluck(getisPunchOut1, 'dateTime');
      let getPunchInTime2 = _.pluck(getisPunchIn2, 'dateTime');
      let getPunchOutTime2 = _.pluck(getisPunchOut2, 'dateTime');
      getPunchInTime.map((t, index) => {
        let getInTime = moment(t);
        let getOutTime = getPunchOutTime && getPunchOutTime[index] ? moment(getPunchOutTime[index]) : moment();
        let getDiff = getOutTime.diff(getInTime, "minutes");
        diffs.push(getDiff);
      })
      getPunchInTime1.map((t, index) => {
        let getInTime1 = moment(t);
        let getOutTime1 = getPunchOutTime1 && getPunchOutTime1[index] ? moment(getPunchOutTime1[index]) : moment();
        let getDiff1 = getOutTime1.diff(getInTime1, "minutes");
        diffs1.push(getDiff1);
      })
      getPunchInTime2.map((t, index) => {
        let getInTime2 = moment(t);
        let getOutTime2 = getPunchOutTime2 && getPunchOutTime2[index] ? moment(getPunchOutTime2[index]) : moment();
        let getDiff2 = getOutTime2.diff(getInTime2, "minutes");
        diffs2.push(getDiff2);
      })
      this.setState({
        toDayCountHrs: moment.utc().hours(Math.floor(Sugar.Array.sum(diffs) / 60)).minutes(Math.floor(Sugar.Array.sum(diffs) % 60)).format("HH:mm"),
        toDayProgress: ((Sugar.Array.sum(diffs) / 60) * 100 / 8).toFixed(2),
        weekCountHrs: moment.utc().hours(Math.floor(Sugar.Array.sum(diffs1) / 60)).minutes(Math.floor(Sugar.Array.sum(diffs1) % 60)).format("HH:mm"),
        weekProgress: ((Sugar.Array.sum(diffs1) / 60) * 100 / 44).toFixed(2),
        monthCountHrs: moment.utc().hours(Math.floor(Sugar.Array.sum(diffs2) / 60)).minutes(Math.floor(Sugar.Array.sum(diffs2) % 60)).format("HH:mm"),
        monthProgress: ((Sugar.Array.sum(diffs2) / 60) * 100 / 176).toFixed(2)
      })
    }
  }

  setOverTimeProgress() {
    if (this.props.todayBreakList.length > 0) {
      let regHrs = 480
      let diffs = [];
      let getisPunchIn = this.props.todayBreakList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.todayBreakList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');

      let first = moment(getPunchInTime[0]);
      // console.log("first :: " , first);
      let last = moment(getPunchOutTime[getPunchOutTime.length - 1])
      // console.log("last :: " ,  last);
      let total = moment(last.diff(first, "minutes"));
      console.log("total :: " , total);
      let getoverTime = total.diff(regHrs, "minutes");
      console.log("getoverTime :: ", getoverTime);
      diffs.push(getoverTime);

      this.setState({
        overTimeProgress: diffs
        // overTimeProgress: moment.utc().hours(diffs / 60).minutes(diffs % 60).format("HH:mm")
      })
    }
  }

  setBreakTime() {
    if (this.props.todayBreakList.length > 0) {
      let diffs = [];
      let getisPunchIn = this.props.todayBreakList.filter((a) => a.isCheckIn)
      let getisPunchOut = this.props.todayBreakList.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      let first = moment(getPunchInTime[0]);
      let last = getPunchOutTime[getPunchOutTime.length - 1]
      getPunchInTime.shift();
      getPunchOutTime.map((t, index) => {
        let getInTime = moment(getPunchInTime[index]);

        let getOutTime = moment(t);
        let getDiff = getInTime.diff(getOutTime, "minutes");
        diffs.push(getDiff);
      })
      this.setState({
        breakTime: moment.utc().hours(Math.floor(Sugar.Array.sum(diffs) / 60)).minutes((Sugar.Array.sum(diffs) % 60)).format("HH:mm"),
        firstTime: moment(first).format("HH:mm:ss"),
        lastTime: moment(last).format("HH:mm:ss")
      })
    }
  }

  getDateList() {
    const self = this;
    let pipeline = [
      {
        $group: {
          _id: "$date"
        }
      },
    ];
    Meteor.call("searchAttendanceDate", pipeline, function (err, res) {
      if (!err) {
        self.setState({ attendanceData: res });
      } else {
        toast.error(err);
      }
    });
  }

  render() {
    let { todayInOutList } = this.props;
    let { attendanceData } = this.state
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
                    <h4>Punch In at</h4>
                    <p>{moment().format("dddd, MMMM Do YYYY")} <span>{this.state.firstTime}</span></p>
                  </li>
                  <li className="list-group-item">
                    <h4>Punch Out at</h4>
                    <span>{this.state.lastTime} hrs</span>
                  </li>
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-lg-6">
                        <h4>Break</h4>
                        <p>{this.state.breakTime} hrs</p>
                      </div>
                      <div className="col-lg-6">
                        <h4>Overtime</h4>
                        <p>{this.state.overTimeProgress} hrs</p>
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
                        style={{ width: this.state.overTimeProgress + "%" }}
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
          <div className="col-lg-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Employee Today Attendance Data Table</h5>
                <IboxTools />
              </div>
              <div className="ibox-content">
                <div className="row text-center">
                  <div className="container-fluid">
                    <table className="table table-striped table-bordered table-hover dataTables-example dataTable" id="dataTables-example">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Punch In</th>
                          <th>Punch Out</th>
                          <th>Total Hours</th>
                          <th>Working Hours</th>
                          <th>Break</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((attendance) => {
                          let total = moment.utc(moment(this.state.lastTime, "HH:mm:ss").diff(moment(this.state.firstTime, "HH:mm:ss"))).format("HH:mm:ss")
                          let workHrs = moment.utc(moment(total, "HH:mm:ss").diff(moment(this.state.breakTime, "HH:mm:ss"))).format("HH:mm:ss")
                          return (
                            <tr key={attendance._id}>
                              <td>{moment(attendance._id).format("YYYY-MM-DD")}</td>
                              <td>{this.state.firstTime}</td>
                              <td>{this.state.lastTime}</td>
                              <td>{total}</td>
                              <td>{workHrs}</td>
                              <td>{this.state.breakTime}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Date</th>
                          <th>Punch In</th>
                          <th>Punch Out</th>
                          <th>Total Hours</th>
                          <th>Working Hours</th>
                          <th>Break</th>
                        </tr>
                      </tfoot>
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
    todayBreakList: Attendance.find({ "userId": Meteor.userId(), "dateTime": { $gte: start, $lt: end } }, { sort: { "dateTime": +1 } }).fetch(),
    weekInOutList: Attendance.find({ "userId": Meteor.userId(), "dateTime": { $gte: firstDay, $lt: lastDay } }).fetch(),
    monthInOutList: Attendance.find({ "userId": Meteor.userId(), "dateTime": { $lte: monthData } }).fetch()
  }
})(EmployeeAttendance); 