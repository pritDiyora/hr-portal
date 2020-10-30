import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { toast } from 'react-toastify'
import { withTracker } from 'meteor/react-meteor-data';
import GeneralSetting from '../../../../api/generalsetting/generalsetting';

class GeneralSettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      todayHrs: "",
      weekHrs: "",
      monthHrs: "",
      overHrs: "",
      monthleave: "",
      carryForwardLeave: "",
      yearlyleave: "",
      
      // noofleave: "",
      button: false,
      id: "",
      workDayOfMonth: ""
    }
  }

  componentWillReceiveProps(nextpops) {
    this.setState({
      id: nextpops.hoursData._id,
      todayHrs: nextpops.hoursData.todayHrs,
      weekHrs: nextpops.hoursData.weekHrs,
      overHrs: nextpops.hoursData.overHrs,
      monthHrs: nextpops.hoursData.monthHrs,
      monthleave: nextpops.hoursData.monthlyLeave,
      carryForwardLeave: nextpops.hoursData.carryForwardLeave,
      yearlyleave: nextpops.hoursData.yearlyLeave,
      // noofleave: nextpops.hoursData.noOfLeave,
      workDayOfMonth: nextpops.hoursData.workDayOfMonth
    })
  }

  addHours() {
    let { todayHrs, weekHrs, monthHrs, yearlyleave,
      overHrs, id, monthleave, carryForwardLeave, noofleave, workDayOfMonth } = this.state;
    let generaleSetting = {
      todayHrs: parseInt(todayHrs),
      weekHrs: parseInt(weekHrs),
      monthHrs: parseInt(monthHrs),
      overHrs: parseInt(overHrs),
      monthlyLeave: parseInt(monthleave),
      carryForwardLeave: parseInt(carryForwardLeave),
      yearlyLeave: parseInt(yearlyleave),
      // noOfLeave: noofleave,
      workDayOfMonth: parseInt(workDayOfMonth)
    }
    Meteor.call('updateGeneraleSetting', generaleSetting, id, function (err, result) {
      if (!err) {
        toast.success("Recored updated successfully..." , result);
      } else {
        toast.error(err.message);
      }
    })
  }
  generalSetting(event) {
    const { name, value } = event.target;
    this.setState({
      [`${name}`]: value
    });
  }
  render() {
    return (
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-content">
                <div className="row">
                  <div className="col-md-12">
                    <div className="col-md-4">
                      <label className="mainheading">General Setting</label>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <label>Today Hours</label>
                      <input type="number"
                        name="todayHrs"
                        className="form-control"
                        value={this.state.todayHrs}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Week Hours</label>
                      <input type="number"
                        name="weekHrs"
                        className="form-control"
                        value={this.state.weekHrs}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <label>Month Hours</label>
                      <input type="number"
                        className="form-control"
                        name="monthHrs"
                        value={this.state.monthHrs}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Over Hours</label>
                      <input type="number"
                        name="overHrs"
                        className="form-control"
                        value={this.state.overHrs}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <label>Monthly Leave</label>
                      <input type="number"
                        name="monthleave"
                        className="form-control"
                        value={this.state.monthleave}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Curry Forword Leave</label>
                      <input type="number"
                        name="carryForwardLeave"
                        className="form-control"
                        value={this.state.carryForwardLeave}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <label>Yearly Leave</label>
                      <input type="number"
                        name="yearlyleave"
                        className="form-control"
                        value={this.state.yearlyleave}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                    {/* <div className="col-md-6">
                      <label>No Of Leave</label>
                      <select name="noofleave" className="form-control" defaultValue={this.state.noofleave}>
                        <option>Select Option</option>
                        <option defaultValue="day">Days</option>
                        <option defaultValue="month">Monthly</option>
                        <option defaultValue="year">Yearly</option>
                      </select>
                    </div> */}
                    
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="col-sm-4">
                      <label className="mainheading">Employee Attendance</label>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <label>Work Day of Month</label>
                      <input type="number"
                        name="workDayOfMonth"
                        className="form-control"
                        value={this.state.workDayOfMonth}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                    
                  </div>
                </div>
                
                
                <div className="form-group row">
                  <div className="col-md-6" style={{ textAlign: "right" }}>
                    <button type="button" className="btn btn-primary" value="Save" onClick={(e) => { this.addHours(e) }} >Save</button>
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
  Meteor.subscribe('generaleSetting');
  return {
    hoursData: GeneralSetting.findOne({})
  }
})(GeneralSettings)