import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';

import Helmet from 'react-helmet';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

class ExperieanceComponent extends Component {
    constructor(props) {
        super(props);
    }

    showFromMonth() {
        const { startdate, enddate } = this.props;
        if (!startdate) {
            return;
        }
        if (moment(enddate).diff(moment(startdate), 'months') < 2) {
            return this.enddate.getDayPicker().showMonth(startdate);
        }
    }
    render() {
        const el = this.props.rowData;
        const { startdate, enddate } = this.props;
        const modifiers = { start: startdate, end: enddate };
        return (
            <div className="panel-body" key={this.props.id} style={{ marginBottom: "5px" }}>
                {this.props.experiance.length !== 1 && <div style={{ textAlign: "right" }}><a className="btn btn-xs btn-primary"
                    onClick={(e) => { this.props.removeClickexperiance(e, el.index) }} ><i className="fa fa-times" aria-hidden="true"></i></a></div>}
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-4">
                            <label>Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.props.compantname}
                                name={`experiance.companyname_${el.key}`}
                                onChange={(e) => this.props.ExperienceChangeHandler(e)}
                            />
                            {this.props.Experiencevalidator.message('Companyname', this.props.compantname, 'required')}
                        </div>
                        <div className="col-md-4">
                            <label>Work Experiance</label>
                            <input
                                type="text"
                                className="form-control"
                                name={`experiance.workexperiance_${el.key}`}
                                onChange={(e) => this.props.ExperienceChangeHandler(e)}
                                value={this.props.workexpeience}
                            />
                            {this.props.Experiencevalidator.message('Workexperiance', this.props.workexpeience, 'required')}
                        </div>
                        <div className="col-md-4">
                            <label>Technlogoy</label><br />
                            <TagsInput
                                onlyUnique={this.props.technology}
                                value={this.props.technology}
                                name={`experiance.techonology_${el.key}`}
                                onChange={(e) => this.props.TaghandleChange(e, el.key)} />
                            {this.props.Experiencevalidator.message('Technology', this.props.technology, 'required')}
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="InputFromTo">
                            <div className="col-md-6">
                                <label>Start Date</label><br />
                                <DayPickerInput
                                    name={`experiance.startdate_${el.key}`}
                                    value={startdate}
                                    placeholder="From"
                                    format="L"
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    dayPickerProps={{
                                        selectedDays: [startdate, { startdate, enddate }],
                                        disabledDays: { after: enddate },
                                        toMonth: enddate,
                                        modifiers,
                                        numberOfMonths: 2,
                                        onDayClick: () => this.enddate.getInput().focus(),
                                    }}
                                    onDayChange={(e) => this.props.handleFromChange(e, el.key)}
                                />
                            </div>
                            <div className="col-md-6">
                                <span className="InputFromTo-to">
                                    <label>End Date</label><br />
                                    <DayPickerInput
                                        name={`experiance.enddate_${el.key}`}
                                        ref={ex => (this.enddate = ex)}
                                        value={enddate}
                                        placeholder="To"
                                        format="L"
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        max={new Date()}
                                        dayPickerProps={{
                                            selectedDays: [startdate, { startdate, enddate }],
                                            disabledDays: { after: new Date(), before: startdate },
                                            modifiers,
                                            month: startdate,
                                            fromMonth: startdate,
                                            numberOfMonths: 2,
                                        }}
                                        onDayChange={(e) => this.props.handleToChange(e, el.key)}
                                    />
                                </span>
                            </div>
                            <Helmet>
                                <style>{`
                               .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                                background-color: #f0f8ff !important;
                                color: #4a90e2;
                            }
                            .InputFromTo .DayPicker-Day {
                                border-radius: 0 !important;
                            }
                            .InputFromTo .DayPicker-Day--start {
                                border-top-left-radius: 50% !important;
                                border-bottom-left-radius: 50% !important;
                            }
                            .InputFromTo .DayPicker-Day--end {
                                border-top-right-radius: 50% !important;
                                border-bottom-right-radius: 50% !important;
                            }
                            .InputFromTo .DayPickerInput-Overlay {
                                width: 350px;
                            }
                            .InputFromTo-to .DayPickerInput-Overlay {
                                margin-left: -198px;
                            }
                                `}</style>
                            </Helmet>
                        </div>
                    </div>
                </div>
                {this.props.experiance.length - 1 === this.props.id && <button className="btn  btn-primary float-right"  value='add more' onClick={this.props.ExperienceaddmoreClick} >Add More</button>}
                {this.props.experiance.length - 1 === this.props.id && <div style={{ textAlign: "right" }} className="col-md-6">
                    <button  name="firstnext" className="btn  btn-primary" value="Previous" onClick={(e) => { this.props.previous(e) }} >Previous</button> &nbsp;
                    <button  name="firstnext" className="btn  btn-primary float-right" value="Finish" onClick={(e) => { this.props.userexperiance(e) }}>Finish</button>
                </div>}
            </div>
        );
    }
}
export default ExperieanceComponent;