import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import { toast } from 'react-toastify';
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { withTracker } from 'meteor/react-meteor-data';
import LeaveType from '../../../../api/leave/leaveTypeSchema';
import { FormControl } from "react-bootstrap";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import moment from 'moment';
import Leave from '../../../../api/leave/leaveScheme';
import User from '../../../../api/user/users';
class ApplyLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekendsVisible: true,
      leaveType: "",
      leaveReason: "",
      leavename: "",
      recevierId: "",
      idHalf: false,
      start: moment(new Date()),
      end: moment(new Date()),
      user: []
    }
    this.applyCallback = this.applyCallback.bind(this);
  }
  applyCallback(startDate, endDate) {
    this.setState({
      start: moment(startDate),
      end: moment(endDate)
    });
  }
  isHalfHandlar(event) {
    this.setState({ isHalf: !this.state.isHalf });
  }
  leaveHandlar(event) {
    let { name, value } = event.target;
    this.setState({
      [`${name}`]: value
    });
  }
  render() {
    let leaveEvents = [];
    this.props.leaves && this.props.leaves.map((leave, pos) => {
      let leavename = this.props.leavetype && this.props.leavetype.find(leavetype => leavetype._id == leave.leaveType) || "";
      let leavetitle = "Reason : " + leave.reason + ' (' + leavename.leaveTypeName + ')';
      let leaveList = {
        id: pos.toString(),
        title: leavetitle,
        start: moment(leave && leave.startDate).format('YYYY-MM-DD'),
        end: moment(leave.endDate + 1).format('YYYY-MM-DD')

      };
      leaveEvents.push(leaveList);
    });
    let disabled = true;
    let now = new Date();
    let start = moment(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    );
    let end = moment(start).add(1, "days").subtract(1, "seconds");
    let ranges = {
      "Today Only": [moment(start), moment(end)],
      "Yesterday Only": [
        moment(start).subtract(1, "days"),
        moment(end).subtract(1, "days")
      ],
      "3 Days": [moment(start).subtract(3, "days"), moment(end)],
      "5 Days": [moment(start).subtract(5, "days"), moment(end)],
      "1 Week": [moment(start).subtract(7, "days"), moment(end)],
      "2 Weeks": [moment(start).subtract(14, "days"), moment(end)],
      "1 Month": [moment(start).subtract(1, "months"), moment(end)],
      "1st August 18": [
        moment("2018-08-01 00:00:00"),
        moment("2018-08-02 23:59:59")
      ],
      "1 Year": [moment(start).subtract(1, "years"), moment(end)]
    };
    let local = {
      format: "DD-MM-YYYY HH:mm",
      sundayFirst: false
    };
    const { leaveType, leaveReason, isHalf } = this.state;
    return (
      <div className="wrapper wrapper-content  animated fadeInRight">
        <div className="ibox ">
          <div className="ibox-title">
            <h5>State Lists</h5>
            <IboxTools />
          </div>
          <div className="ibox-content">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={this.state.weekendsVisible}
              select={this.handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={this.handleEventClick}
              events={leaveEvents}
            />
          </div>
        </div>
        <div className="modal fade" id="add-panel" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Apply Leave</h4>
              </div>
              <div className="modal-body">
                <div className="content container-fluid">
                  <form>
                    <div className="form-group">
                      <label>Leave Type <span className="text-danger">*</span></label>
                      <select className="form-control" name="leaveType" value={leaveType}
                        onChange={(e) => this.leaveHandlar(e)} >
                        <option defaultValue>Select Leave Type</option>
                        {
                          this.props.leavetype.map((leave) => {
                            return (<option value={leave._id} key={leave._id}>{leave.leaveTypeName}</option>)
                          })
                        }
                      </select>
                    </div>
                    <div className="InputFromTo">
                      <div className="form-group">
                        <div className="col-md-12" style={{ padding: "0px" }}>
                          <DateTimeRangeContainer
                            ranges={ranges}
                            start={this.state.start}
                            end={this.state.end}
                            local={local}
                            applyCallback={this.applyCallback}
                            smartMode >
                            <div className="col-md-6" style={{ paddingLeft: "0px" }}>
                              <label>Start Date <span className="text-danger">*</span></label>
                              <FormControl
                                id="formControlsTextB"
                                type="text"
                                label="Text"
                                placeholder="Enter text"
                                style={{ cursor: "pointer" }}
                                disabled={disabled}
                                value={this.state.start.format(
                                  "DD-MM-YYYYTHH:mm:ss"
                                )}
                              />
                            </div>
                            <div className="col-md-6" style={{ padding: "0px" }}>
                              <label>End Date <span className="text-danger">*</span></label>
                              <FormControl
                                id="formControlsTextB"
                                type="text"
                                label="Text"
                                placeholder="Enter text"
                                style={{ cursor: "pointer" }}
                                disabled={disabled}
                                value={this.state.end.format("DD-MM-YYYYTHH:mm:ss")}
                              />

                            </div>
                          </DateTimeRangeContainer>
                        </div>

                      </div>
                      <div className="form-group">
                        <div className="col-md-12" style={{ padding: "0px" }}>
                          <div className="col-md-6" style={{ paddingLeft: "0px" }}>
                            <label>Select Half</label>
                            <span className="InputFromTo-to">
                              <select className="form-control" value={isHalf} onChange={(e) => this.isHalfHandlar(e)}>
                                <option defaultValue>First Half</option>
                                <option>Second Half</option>
                              </select>
                            </span>
                          </div>
                          <div className="col-md-6" style={{ padding: "0px" }}>
                            <label>Select Half</label>
                            <select className="form-control"
                              value={this.state.isHalf}>
                              <option >First Half</option>
                              <option>Second Half</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="form-group">
                      <label>Leave Reason <span className="text-danger">*</span></label>
                      <textarea rows="4" className="reason" name="leaveReason" value={leaveReason} onChange={(e) => this.leaveHandlar(e)}></textarea>
                    </div>
                    <div className="submit-section">
                      <button className="btn btn-primary submit-btn" onClick={(e) => this.leaveApply(e)}>Apply</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    });
  };
  handleDateSelect = (selectInfo) => {
    const self = this;
    var selectedDate = moment(selectInfo.start).format('YYYY/MM/DD');
    var todayDate = moment().format('YYYY/MM/DD');
    if (selectedDate >= todayDate) {
      this.setState({
        start: moment(selectInfo.start),
        end: moment(selectInfo.end - 1),
      });
      $("#add-panel").modal("show");
    } else {
      alert('You can not select past Date..');
    }

  };
  cancel(e) {
    $("#add-panel").modal("hide");
  }
  leaveApply(event) {
    event.preventDefault();
    const self = this;
    let leaveObject = {
      userId: Meteor.userId(),
      leaveType: self.state.leaveType,
      startDate: moment(self.state.start).format('YYYY-MM-DDTHH:mm:ss'),
      endDate: moment(self.state.end).format('YYYY-MM-DDTHH:mm:ss'),
      idHalf: self.state.idHalf,
      reason: self.state.leaveReason,
    };
    Meteor.call('leaveApply', leaveObject, function (err, res) {
      if (!err) {
        toast.success('Leave Apply Successfully....!', res);
        $("#add-panel").modal("hide");
        let leavename = self.props.leavetype.find(leave => leave._id == self.state.leaveType)
        self.setState({ leavename: leavename });
        let leaveApproveNotification = {
          title: leavename.leaveTypeName,
          description: self.state.leaveReason,
          sendId: Meteor.userId(),
          receiverId: self.state.user,
          type: 'leaveApproveList',
          createdAtDate: new Date(),
          createdBy: Meteor.userId(),
          modifiedBy: Meteor.userId()
        }
        Meteor.call('LeaveApprove.Notification', leaveApproveNotification, function (err, res) {
          if (!err) {
            self.setState({ leaveType: '', leaveReason: '' });
          }
        });
      } else {
        toast.error(err.message);
      }
    });
  }
  handleEventClick = (clickInfo) => {
    if (
      confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)
    ) {
      clickInfo.event.remove();
    }
  };
  componentWillReceiveProps(nextProps) {
    const self = this;
    let superadmin = nextProps.userType.find(user => user.profile.userType == 'superadmin');
    let admin = nextProps.userType.find(user => user.profile.userType == 'admin');
    let sadminid = superadmin && superadmin._id || "";
    let adminid = admin && admin._id || "";
    self.state.user = [sadminid, adminid]
  }
}
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
export default withTracker(() => {
  Meteor.subscribe('leaveType');
  Meteor.subscribe('ListleaveApply');
  Meteor.subscribe('getUserType');
  return {
    leavetype: LeaveType.find({}).fetch(),
    leaves: Leave.find({ userId: Meteor.userId() }).fetch(),
    userType: User.find({}).fetch()
  }
})(ApplyLeave);

