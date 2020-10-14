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
      carryforwardleave: "",
      yearlyleave: "",
      fromTime: "",
      toTime: "",
      button: false,
      id: ""
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
      carryforwardleave: nextpops.hoursData.CarryForwardLeave,
      yearlyleave: nextpops.hoursData.yearlyLeave,
      fromTime: nextpops.hoursData.fromTime,
      toTime: nextpops.hoursData.toTime
    })
  }

  addHours() {
    let { todayHrs, weekHrs, monthHrs, yearlyleave, fromTime, toTime,
      overHrs, id, monthleave, carryforwardleave } = this.state;
    let generaleSetting = {
      todayHrs: parseInt(todayHrs),
      weekHrs: parseInt(weekHrs),
      monthHrs: parseInt(monthHrs),
      overHrs: parseInt(overHrs),
      monthlyLeave: parseInt(monthleave),
      carryForwardLeave: parseInt(carryforwardleave),
      yearlyLeave: parseInt(yearlyleave),
      fromTime: fromTime,
      toTime: toTime
    }
    Meteor.call('updateGeneraleSetting', generaleSetting, id, function (err, result) {
      if (!err) {
        toast.success("Record updated..." + result);
      } else {
        toast.error("Error ::" + err);
      }
    })
  }
  generalSetting(event) {
    const { name, value } = event.target;
    this.setState({
      [`${name}`]: value
    }, () => {
      console.log('state :: ', this.state);

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
                      <label>CarryForward (Month wise)</label>
                      <input type="number"
                        name="carryforwardleave"
                        className="form-control"
                        value={this.state.carryforwardleave}
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

                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="col-sm-4">
                      <label className="mainheading">Office Time</label>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <label>From</label>
                      <input type="text"
                        name="fromTime"
                        className="form-control"
                        value={this.state.fromTime}
                        onChange={(e) => this.generalSetting(e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>To</label>
                      <input type="text"
                        name="toTime"
                        className="form-control"
                        value={this.state.toTime}
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