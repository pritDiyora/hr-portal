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
                            <h4 className="modal-title">Add Country Data</h4>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-6">
                                            <label>Country Name</label>
                                            <input type="text" className="form-control" value={this.state.countryname} onChange={(e) => this.setState({ countryname: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Country Code</label>
                                            <input type="text" className="form-control" value={this.state.countrycode} onChange={(e) => this.setState({ countrycode: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" id="cancel-button" onClick={(e) => this.cancel(e)}>Cancel</button>
                            {this.state.button ? <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addcountry(e) }}>Update Country</button>
                                : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addcountry(e) }}>Add Country</button>}
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

