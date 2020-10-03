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
      button: false,
      id: ""
    }
  }

  componentWillReceiveProps(nextpops) {
    this.setState({
      id: nextpops.hoursData._id
    })
  }

  addHours() {
    let { todayHrs, weekHrs, monthHrs, overHrs, id } = this.state
    Meteor.call('updateHours', todayHrs, weekHrs, monthHrs, overHrs, id, function (err, result) {
      if (!err) {
        toast.success("Record updated..." + result);
        console.log("data :: ", result);
      } else {
        toast.error("Error ::" + err);
      }
    })
  }


  render() {
    let { hoursData } = this.props
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
                        className="form-control"
                        value={this.state.todayHrs || hoursData && hoursData.todayHrs}
                        onChange={(e) => (this.setState({ todayHrs: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Week Hours</label>
                      <input type="number"
                        className="form-control"
                        value={this.state.weekHrs || hoursData && hoursData.weekHrs}
                        onChange={(e) => (this.setState({ weekHrs: e.target.value }))}
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
                        value={this.state.monthHrs || hoursData && hoursData.monthHrs}
                        onChange={(e) => (this.setState({ monthHrs: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Over Hours</label>
                      <input type="number"
                        className="form-control"
                        value={this.state.overHrs || hoursData && hoursData.overHrs}
                        onChange={(e) => (this.setState({ overHrs: e.target.value }))}
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
  Meteor.subscribe('hoursData');
  return {
    hoursData: GeneralSetting.findOne({})
  }
})(GeneralSettings)