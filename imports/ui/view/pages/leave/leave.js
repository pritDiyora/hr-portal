import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import { toast } from 'react-toastify';
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event";

export default class Leave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weekendsVisible: true,
            currentEvents: []
        };

    }
    render() {

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
                        initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
                        select={this.handleDateSelect}
                        eventContent={renderEventContent} // custom render function
                        eventClick={this.handleEventClick}
                        eventsSet={this.handleEvents} // cal
                        />
                    </div>
                 </div>

            <div className="modal fade" id="add-panel" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">Add Leave</h4>
                        </div>
                        <div className="modal-body">
                            <div className="content container-fluid">
                            <form>
									<div class="form-group">
										<label>Leave Type <span class="text-danger">*</span></label>
										<select class="form-control" >
											<option data-select2-id="3">Select Leave Type</option>
											<option>Casual Leave 12 Days</option>
											<option>Medical Leave</option>
											<option>Loss of Pay</option>
                                        </select>
									</div>
									<div class="form-group">
										<label>From <span class="text-danger">*</span></label>
										<div class="cal-icon">
											<input class="form-control datetimepicker" type="text" />
										</div>
									</div>
									<div class="form-group">
										<label>To <span class="text-danger">*</span></label>
										<div class="cal-icon">
											<input class="form-control datetimepicker" type="text" />
										</div>
									</div>
									<div class="form-group">
										<label>Remaining Leaves <span class="text-danger">*</span></label>
										<input class="form-control" readonly="" value="12" type="text" />
									</div>
									<div class="form-group">
										<label>Leave Reason <span class="text-danger">*</span></label>
										<textarea rows="4" class="form-control"></textarea>
									</div>
									<div class="submit-section">
										<button class="btn btn-primary submit-btn">Submit</button>
									</div>
								</form>
                            </div>
                        </div>
                        {/* <div className="modal-footer submit-section">
                            {this.state.button ? <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addcountry(e) }}>Update Country</button>
                                : <button type="button" className="btn btn-primary submit-btn" id="confirm-button" onClick={(e) => { this.addcountry(e) }}>Add Country</button>}
                        </div> */}
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

    handleDateSelect = (e) => {
        $("#add-panel").modal("show");
    };
    cancel(e) {
        $("#add-panel").modal("hide");
    }
    handleEventClick = (clickInfo) => {
        if (
            confirm(
                `Are you sure you want to delete the event '${clickInfo.event.title}'`
            )
        ) {
            clickInfo.event.remove();
        }
    };

    handleEvents = (events) => {
        this.setState({
            currentEvents: events
        });
    };
}

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

