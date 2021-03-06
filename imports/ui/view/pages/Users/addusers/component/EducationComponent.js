import React, { Component, PropTypes } from 'react';
import SimpleReactValidator from 'simple-react-validator';
class EducationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      profileimage:""
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({profileimage:`${Meteor.absoluteUrl()}cfs/files/images/${nextProps.certificate}`})
  }
  render() {
    const el = this.props.rowData;
    let education1 = this.props.education;
    return (
      <div className="panel-body" key={this.props.id} style={{ marginBottom: "5px" }}>
        {education1.length !== 1 && <div style={{ textAlign: "right" }}><a className="btn btn-xs btn-primary" onClick={(e) => this.props.EducationremoveClick(e, el.index)} ><i className="fa fa-times" aria-hidden="true"></i></a></div>}
        <div className="form-group row">
          {
            FlowRouter.getRouteName() == 'Profile' ?
              <div className="col-md-12">
                <div className="col-md-6">
                  <label>Course Name</label>
                  <input type="text" className="form-control"
                    placeholder="" id="course_name" name={`education.coursename_${el.key}`}
                    value={this.props.coursename}
                    onChange={(e) => this.props.EducationchangeHandler(e)} />
                  {this.props.Educationvalidator.message('Coursename', this.props.coursename, 'required')}
                </div>
                <div className="col-md-6">
                  <label>Institute Name</label>
                  <input type="text" className="form-control" name={`education.institutename_${el.key}`} id="intitute_name"
                    onChange={(e) => this.props.EducationchangeHandler(e)}
                    value={this.props.instituename} />
                  {this.props.Educationvalidator.message('Institutename', this.props.instituename, 'required')}
                </div>
              </div>
              :
              <div className="col-md-12">
                <div className="col-md-4">
                  <label>Course Name</label>
                  <input type="text" className="form-control"
                    placeholder="" id="course_name" name={`education.coursename_${el.key}`}
                    value={this.props.coursename}
                    onChange={(e) => this.props.EducationchangeHandler(e)} />
                  {this.props.Educationvalidator.message('Coursename', this.props.coursename, 'required')}
                </div>
                <div className="col-md-4">
                  <label>Institute Name</label>
                  <input type="text" className="form-control" name={`education.institutename_${el.key}`} id="intitute_name"
                    onChange={(e) => this.props.EducationchangeHandler(e)}
                    value={this.props.instituename} />
                  {this.props.Educationvalidator.message('Institutename', this.props.instituename, 'required')}
                </div>
                <div className="col-md-4">
                  <label>Acadamic Year</label>
                  <input type="text" className="form-control" name={`education.acedemicyear_${el.key}`}
                    id="acedemic_year" onChange={(e) => this.props.EducationchangeHandler(e)}
                    value={this.props.academicyear}
                  />
                  {this.props.Educationvalidator.message('Acedemicyear', this.props.academicyear, 'required')}
                </div>
              </div>
          }

        </div>
        <div className="form-group row">
          {FlowRouter.getRouteName() == 'Profile' ?
            <div className="col-md-12">
              <div className="col-md-6">
                <label>Acadamic Year</label>
                <input type="text" className="form-control" name={`education.acedemicyear_${el.key}`}
                  id="acedemic_year" onChange={(e) => this.props.EducationchangeHandler(e)}
                  value={this.props.academicyear}
                />
                {this.props.Educationvalidator.message('Acedemicyear', this.props.academicyear, 'required')}
              </div>
              <div className="col-md-6">
                <label>Course Type</label>
                <input type="text" className="form-control" name={`education.coursetype_${el.key}`} id="course_type"
                  onChange={(e) => this.props.EducationchangeHandler(e)}
                  value={this.props.coursetype} />
                {this.props.Educationvalidator.message('CourseType', this.props.coursetype, 'required')}
              </div>
            </div>
            :
            <div className="col-md-12">
              <div className="col-md-6">
                <label>Course Type</label>
                <input type="text" className="form-control" name={`education.coursetype_${el.key}`} id="course_type"
                  onChange={(e) => this.props.EducationchangeHandler(e)}
                  value={this.props.coursetype} />
                {this.props.Educationvalidator.message('CourseType', this.props.coursetype, 'required')}
              </div>

              <div className="col-md-5">
                <label>Certificate</label>
                <input type="file" className="form-control" id="certificates"
                  onChange={(e) => this.props.filechangeHandler(e, el.key)} name={`education.certificate_${el.key}`}
                />
                {this.props.Educationvalidator.message('Certificate', this.props.certificate, 'required|string')}
              </div>
              <div className="col-md-1">
              {this.props.certificate == "" ? <img src="/img/no-image-available.png" height="50" width="105" style={{ marginTop: "5.5px" }} /> 
                  : this.props.loading ? <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>
                    : <img src={this.state.profileimage} height="50" width="105" style={{  marginTop: "5.5px" }} loading="lazy"/>}
              </div>
            </div>
          }
          {
            FlowRouter.getRouteName() == 'Profile' ?
              <div className="col-md-12">

                <div className="col-md-6">
                  <label>Certificate</label>
                  <input type="file" className="form-control" id="certificates"
                    onChange={(e) => this.props.filechangeHandler(e, el.key)} name={`education.certificate_${el.key}`}
                  />
                  {this.props.Educationvalidator.message('Certificate', this.props.certificate, 'required|string')}
                </div>
                <div className="col-md-6">
                  {this.props.certificate == "" ? <img src="/img/no-image-available.png" height="50" width="105" style={{  marginTop: "5.5px" }} /> 
                  : this.props.loading ? <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>
                    : <img src={this.state.profileimage} height="50" width="105" style={{marginTop: "5.5px" }} loading="lazy"/>}
                </div>
              </div>
              : ""
          }

        </div>
        {education1.length - 1 === this.props.id && <button className="btn  btn-primary float-right" type='submit' value='add more' onClick={(e) => this.props.EducationaddmoreClick(e)} >Add More</button>}
        {FlowRouter.getRouteName() == 'Profile' ? education1.length - 1 === this.props.id && <div style={{ textAlign: "right" }} className="col-md-6">
          <button name="firstnext" className="btn  btn-primary" value="Next" onClick={(e) => { this.props.usereducation(e) }} >Next</button>
        </div>
          : education1.length - 1 === this.props.id && <div style={{ textAlign: "right" }} className="col-md-6">
            <button name="firstnext" className="btn  btn-primary" value="Previous" onClick={(e) => { this.props.previous(e) }} >Previous</button> &nbsp;
        <button name="firstnext" className="btn  btn-primary" value="Next" onClick={(e) => { this.props.usereducation(e) }} >Next</button>
          </div>}
      </div>
    );
  }
}
export default EducationComponent;