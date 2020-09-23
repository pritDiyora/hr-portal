import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';
class ExperieanceComponent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const el = this.props.rowData;
        return (
            <div className="panel-body" key={this.props.id} style={{ marginBottom: "5px" }}>
                {this.props.experiance.length !== 1 && <div style={{ textAlign: "right" }}><a className="btn btn-xs btn-primary"
                    onClick={(e) => { this.props.removeClickexperiance(e, el.key) }} ><i className="fa fa-times" aria-hidden="true"></i></a></div>}
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-4">
                            <label>Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.props.compantname}
                                name={`experiance.companyname_${el.key}`}
                                onChange={(e) => this.props.ExperienceChangeHandler(e, el.index)}
                            />
                            {this.props.Experiencevalidator.message('Companyname', this.props.compantname, 'required')}
                        </div>
                        <div className="col-md-4">
                            <label>Work Experiance</label>
                            <input
                                type="text"
                                className="form-control"
                                name={`experiance.workexperiance_${el.key}`}
                                onChange={(e) => this.props.ExperienceChangeHandler(e, el.index)}
                                value={this.props.workexpeience}
                            />
                            {this.props.Experiencevalidator.message('Workexperiance', this.props.workexpeience, 'required')}
                        </div>
                        <div className="col-md-4">
                            <label>Technlogoy</label><br />
                            <TagsInput
                                value={this.props.technology}
                                name={`experiance.techonology_${el.key}`}
                                onChange={(e) => this.props.TaghandleChange(e, el.index, el.key)} />
                            {this.props.Experiencevalidator.message('Technology', this.props.technology, 'required')}
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <label>Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={this.props.startdate}
                                name={`experiance.startdate_${el.key}`}
                                onChange={(e) => this.props.ExperienceChangeHandler(e, el.index)}
                            />
                            {this.props.Experiencevalidator.message('StartDate', this.props.startdate, 'required')}
                        </div>

                        <div className="col-md-6">
                            <label>End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name={`experiance.enddate_${el.key}`}
                                value={this.props.enddate}
                                onChange={(e) => this.props.ExperienceChangeHandler(e, el.index)}
                            />
                            {this.props.Experiencevalidator.message('EndDate', this.props.enddate, 'required')}
                        </div>
                    </div>
                </div>

                {this.props.experiance.length - 1 === this.props.id && <input className="btn  btn-primary float-right" type='submit' value='add more' onClick={this.props.ExperienceaddmoreClick} />}
                {this.props.experiance.length - 1 === this.props.id && <div style={{ textAlign: "right" }} className="col-md-6">
                    <input type="button" name="firstnext" className="btn  btn-primary" value="Previous" onClick={(e) => { this.props.previous(e) }} /> &nbsp;
                    <input type="button" name="firstnext" className="btn  btn-primary float-right" value="Finish" onClick={(e) => { this.props.userexperiance(e) }} />
                </div>}
            </div>
        );
    }
}
export default ExperieanceComponent;