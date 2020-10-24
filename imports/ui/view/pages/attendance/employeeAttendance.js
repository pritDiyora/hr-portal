import React, { Component } from 'react'
import moment from 'moment';
import IboxTools from '../../layout/iboxTools';
import { Meteor } from 'meteor/meteor';
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import Attendance from '../../../../api/attendance/attendance'
import GeneralSetting from '../../../../api/generalsetting/generalsetting'
// import File from '../../../../api/fileupload/file'

var Sugar = require('sugar');
import Pagination from "react-js-pagination";
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
      pageLength: 10,
      searchStr: "",
      sortValue: 1,
      currentPage: 1,
      totalpage: 0
    }
  }
  componentDidMount() {
    this.getDateList()
    this.interval = setInterval(() => {
      this.setTodayProgress()
      this.setWeekProgress()
      this.setMonthProgress()
      this.setOverTimeProgress()
      this.setBreakTime()
      this.progress()
      this.breaktime()
    }, 1000);
  }
  componentWillReceiveProps(nextProps) {
    this.setTodayProgress()
    this.setWeekProgress()
    this.setMonthProgress()
    this.setOverTimeProgress()
    this.setBreakTime()
    this.progress()
    this.breaktime()
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  progress(data, hoursKey) {
    let getdata = this.props && this.props[data] || [];
    let hours = this.props && this.props.hoursData && this.props.hoursData[hoursKey] || 0;
    if (getdata.length > 0) {
      let diffs = []
      let getisPunchIn = getdata.filter((a) => a.isCheckIn);    
      console.log('getisPunchIn :: ',getisPunchIn);  
      let getisPunchOut = getdata.filter((a) => !a.isCheckIn)
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      getPunchInTime.map((t, index) => {
        let getInTime = moment(t);
        let getOutTime = getPunchOutTime && getPunchOutTime[index] ? moment(getPunchOutTime[index]) : moment();
        let getDiff = getOutTime.diff(getInTime, "minutes");
        diffs.push(getDiff);
        // console.log("diff : " , diffs);
      })
      let value = {
        // CountHrs: moment.utc().hours(Math.floor(Sugar.Array.sum(diffs) / 60)).minutes(Math.floor(Sugar.Array.sum(diffs) % 60)).format("HH:mm"),
        CountHrs: (Math.floor(Sugar.Array.sum(diffs) / 60)),
        CountMin: (Math.floor(Sugar.Array.sum(diffs) % 60)),
        Progress: ((Sugar.Array.sum(diffs) / 60) * 100 / hours).toFixed(2),
      }
      return value;
    } else {
      // console.log("no...")
    }
  }
  setTodayProgress() {
    let data = this.progress('todayInOutList', 'todayHrs');
    if (data) {
      this.setState({
        toDayCountHrs: data.CountHrs,
        toDayCountMin: data.CountMin,
        toDayProgress: data.Progress
      })
    }
  }
  setWeekProgress() {
    let data = this.progress('weekInOutList', 'weekHrs');
    if (data) {
      this.setState({
        weekCountHrs: data.CountHrs,
        weekCountMin: data.CountMin,
        weekProgress: data.Progress
      })
    }
  }
  setMonthProgress() {
    let data = this.progress('monthInOutList', 'monthHrs');
    if (data) {
      this.setState({
        monthCountHrs: data.CountHrs,
        monthCountMin: data.CountMin,
        monthProgress: data.Progress
      })
    }
  }
  setOverTimeProgress() {
    let { hoursData } = this.props;
    let data = this.progress('monthInOutList');
    if (data) {
      let work = moment.duration(data.CountHrs, "minutes").asMinutes();
      let overtime = 0;
      if (work > (hoursData && hoursData.monthHrs * 60)) {
        overtime = (work - (hoursData && hoursData.monthHrs * 60))
      } else {
        overtime = 0
      }
      this.setState({
        overCountHrs: moment.utc().hours(overtime / 60).minutes(overtime % 60).format("HH:mm"),
        overTimeProgress: ((overtime / 60) * 100 / hoursData && hoursData.overHrs)
      })
    }
  }
  breaktime(data) {
    let getdata = data || [];
    if (getdata.length > 0) {
      let diffs = [];
      let getisPunchIn = getdata.filter((a) => a.isCheckIn);
      let getisPunchOut = getdata.filter((a) => !a.isCheckIn);
      let getPunchInTime = _.pluck(getisPunchIn, 'dateTime');
      let getPunchOutTime = _.pluck(getisPunchOut, 'dateTime');
      let first = getPunchInTime[0];
      let last = moment(getPunchOutTime[getPunchOutTime.length - 1])
      getPunchInTime.shift();
      getPunchOutTime.splice(-1, 1)
      getPunchOutTime.map((t, index) => {
        let getInTime = moment(getPunchInTime[index]);
        let getOutTime = moment(t);
        let getDiff = getInTime.diff(getOutTime, "minutes");
        diffs.push(getDiff);
      })
      let value = {
        BreakTime: moment.utc().hours(Math.floor(Sugar.Array.sum(diffs) / 60)).minutes((Sugar.Array.sum(diffs) % 60)).format("HH:mm"),
        FirstTime: moment(first).format("HH:mm:ss"),
        LastTime: moment(last).format("HH:mm:ss")
      }
      return value
    } else {

    }
  }
  setBreakTime() {
    let data = this.breaktime(this.props.todayBreakList)
    if (data) {
      this.setState({
        breakTime: data.BreakTime,
        firstTime: data.FirstTime,
        lastTime: data.LastTime
      })
    }
  }
  showhandle(event) {
    this.setState({
      currentPage: 1,
      pageLength: parseInt(event.target.value)
    }, () => {
      this.getDateList();
    })
  }
  handlePageChange(pageNumber) {
    const currentPage = pageNumber;
    const totalpage = pageNumber;
    this.setState({
      currentPage, totalpage
    }, () => {
      this.getDateList();
    });
  }
  search(e) {
    this.setState({
      currentPage: 1,
      searchStr: e.target.value
    }, () => {
      this.getDateList();
    })
  }
  getDateList() {
    const self = this;
    let pipeline = [
      {
        "$match": { "userId": FlowRouter.current().queryParams.id || Meteor.userId() }
      },
      {
        $project: { date: '$date', isCheckIn: '$isCheckIn', dateTime: '$dateTime', userId: "$userId" }
      },
      {
        $group: { _id: "$date", items: { $push: '$$ROOT' } }
      },
      {
        $sort: {_id: -1}
      },
      { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
      { "$limit": this.state.pageLength },
    ];
    Meteor.call("searchAttendanceDate", pipeline, function (err, res) {
      if (!err) {
        self.setState({ attendanceData: res , totalpage: res.length});
      } else {
        toast.error(err);
      }
    });
  }
  render() {
    let { todayInOutList, hoursData } = this.props;
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
                        <p>{this.state.overCountHrs} hrs</p>
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
                    <p>Today: <strong>{this.state.toDayCountHrs}:{this.state.toDayCountMin} hrs / {hoursData && hoursData.todayHrs} hrs</strong></p>
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
                    <p>This Week: <strong>{this.state.weekCountHrs}:{this.state.weekCountMin} hrs / {hoursData && hoursData.weekHrs} hrs</strong></p>
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
                    <p>This Month: <strong>{this.state.monthCountHrs}:{this.state.monthCountMin} hrs / {hoursData && hoursData.monthHrs} hrs</strong></p>
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
                    <p>Overtime: <strong>{this.state.overCountHrs}</strong></p>
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
                <h5>Employee Attendance Date Wise Data Table</h5>
                <IboxTools />
              </div>
              <div className="ibox-content">
                <div className="row text-center">
                  <div className="col-sm-12" style={{ marginBottom: "15px" }}>
                    <div className="col-sm-6" >
                      <div className="dataTables_length" id="example_length">
                        <label className="dataTables_length text">Show <select name="example_length"
                          className="form-control" onChange={this.showhandle.bind(this)}>
                          <option>5</option>
                          <option>10</option>
                          <option>25</option>
                          <option>50</option>
                          <option>100</option>
                        </select> entries</label>
                      </div>
                    </div>
                    <div className="col-sm-6" >
                      <div className="page1" id="example_length">
                        <label className="dataTables_length1 text">Search :
                            <input type="text" name="example_length" onChange={this.search.bind(this)}
                            className="form-control" style={{ width: "200px" }} />
                        </label>
                      </div>

                    </div>
                  </div>
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
                          let data = this.breaktime(attendance && attendance.items)
                          if (data) {
                            let breakTime = data.BreakTime
                            let firstTime = data.FirstTime
                            let lastTime = data.LastTime
                            let total = moment.utc(moment(lastTime, "HH:mm:ss").diff(moment(firstTime, "HH:mm:ss"))).format("HH:mm:ss")
                            let workHrs = moment.utc(moment(total, "HH:mm:ss").diff(moment(breakTime, "HH:mm:ss"))).format("HH:mm:ss")
                            return (
                              <tr key={attendance._id}>
                                <td>{moment(attendance._id).format("YYYY-MM-DD")}</td>
                                <td>{firstTime}</td>
                                <td>{lastTime}</td>
                                <td>{total}</td>
                                <td>{workHrs}</td>
                                <td>{breakTime}</td>
                              </tr>
                            )
                          }
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
                    <div style={{ textAlign: "right" }}>
                      <Pagination
                        activePage={this.state.currentPage}
                        itemsCountPerPage={this.state.pageLength}
                        totalItemsCount={this.state.totalpage}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange.bind(this)}

                      />
                    </div>
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
  Meteor.subscribe('generaleSetting');
  //today
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);

  //week
  let curr = new Date()
  let first = curr.setDate(curr.getDate() - curr.getDay())
  let last = curr.setDate(curr.getDate() + 6)
  let firstDay = new Date(first)
  let lastDay = new Date(last)

  //month
  let monthData = new Date()
  monthData.setMonth(monthData.getMonth())

  //let user 
  let userId = Meteor.userId();
  if (FlowRouter.current().queryParams.id) {
    userId = FlowRouter.current().queryParams.id;
  }
  return {
    todayInOutList: Attendance.find({ "userId": userId, "dateTime": { $gte: start, $lt: end } }, { sort: { "dateTime": -1 } }).fetch(),
    todayBreakList: Attendance.find({ "userId": userId, "dateTime": { $gte: start, $lt: end } }, { sort: { "dateTime": +1 } }).fetch(),
    weekInOutList: Attendance.find({ "userId": userId, "dateTime": { $gte: firstDay, $lt: lastDay } }).fetch(),
    monthInOutList: Attendance.find({ "userId": userId, "dateTime": { $lte: monthData } }).fetch(),
    hoursData: GeneralSetting.findOne({})
  }
})(EmployeeAttendance); 