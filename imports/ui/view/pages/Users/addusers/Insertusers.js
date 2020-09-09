import React, { Component, useReducer } from 'react';
import { Meteor } from 'meteor/meteor';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { withTracker } from 'meteor/react-meteor-data';
import Country from '../../../../../api/country/country';
import State from '../../../../../api/states/states';
import Cities from '../../../../../api/cites/cites';
import Select from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import SimpleReactValidator from 'simple-react-validator';

const KeyCodes = {
    comma: 188,
    enter: 13,
    space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];
class AddHR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "", firstname: "", lastname: "", fathername: "", mothername: "", gender: "", dateofbirth: "", offcialemailid: "",
            joiningdate: "", phone: "", addressline1: "", addressline2: "", zipcode: "",tags: [],
            companyname: "", workexperiance: "", startdate: "", enddate: "",  usertype: "" ,
            selectedOption: null, selectedOption1: null, selectedOption2: null, imagePreviewUrl: "",
            education: [{
                key: Random.id(),
                index: 0
            }],
            lastIndex: 0
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.addmoreClick = this.addmoreClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this, className: "text-danger",
        });
        this.validator1 = new SimpleReactValidator({
            autoForceUpdate: this, className: "text-danger",
        });
        this.validator2 = new SimpleReactValidator({
            autoForceUpdate: this, className: "text-danger",
        });
    }
    //Addmore
    addmoreClick() {
        let { education, lastIndex } = this.state;
        let value = {
            key: Random.id(),
            index: (lastIndex + 1)
        }
        if (this.validator1.allValid()) {
            education.push(value)
            var lastIndex1 = lastIndex++;
            this.setState({
                lastIndex: lastIndex1,
                education: education
            })
        } else {
            this.validator1.showMessages();
        }
    }
    createUI() {
        return this.state.education.map((el, i) => (
            <div class="panel-body" key={i} style={{ marginBottom: "5px" }}>
                {this.state.education.length !== 1 && <div style={{ textAlign: "right" }}><button type="button" onClick={(e) => { this.removeClick(e, el.key) }} ><i class="fa fa-times" aria-hidden="true"></i></button></div>}
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-4">
                            <label>Course Name</label>
                            <input type="text" className="form-control"
                                placeholder="" id="course_name" name={`education.coursename_${el.key}`}
                                value={this.state[`education.coursename_${el.key}_${el.index}`]}
                                onChange={(e) => this.changeHandler(e, el.index)} />
                            {this.validator1.message('Coursename', this.state[`education.coursename_${el.key}_${el.index}`], 'required|alpha')}
                        </div>
                        <div className="col-md-4">
                            <label>Institute Name</label>
                            <input type="text" className="form-control" name={`education.institutename_${el.key}`} id="intitute_name"
                                onChange={(e) => this.changeHandler(e, el.index)} value={this.state[`education.institutename_${el.key}_${el.index}`]} />
                            {this.validator1.message('Institutename', this.state[`education.institutename_${el.key}_${el.index}`], 'required|alpha')}
                        </div>
                        <div className="col-md-4">
                            <label>Acadamic Year</label>
                            <input type="text" className="form-control" name={`education.acedemicyear_${el.key}`}
                                id="acedemic_year" onChange={(e) => this.changeHandler(e, el.index)} value={this.state[`education.acedemicyear_${el.key}_${el.index}`]} />
                            {this.validator1.message('Acedemicyear', this.state[`education.acedemicyear_${el.key}_${el.index}`], 'required|alpha')}
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <label>Course Type</label>
                            <input type="text" className="form-control" name={`education.coursetype_${el.key}`} id="course_type"
                                onChange={(e) => this.changeHandler(e, el.index)} value={this.state[`education.coursetype_${el.key}_${el.index}`]} />
                            {this.validator1.message('CourseType', this.state[`education.coursetype_${el.key}_${el.index}`], 'required|alpha')}
                        </div>

                        <div className="col-md-5">
                            <label>Certificate</label>
                            <input type="file" className="form-control" placeholder="" id="certificates"
                                onChange={(e) => this.filechangeHandler(e, el.index, el.key)} name={`education.certificate_${el.key}`} value={this.state[`education.certificate_${el.key}_${el.index}`]} />
                            {/* {this.validator1.message('Certificate', this.state[`education.certificate_${el.key}_${el.index}`], 'required|string')} */}
                        </div>
                        <div className="col-md-1">
                            <img src={this.state[`education.certificate_${el.key}_${el.index}`]} style={{ height: "50px", width: "105px", marginTop: "5.5px" }} />
                        </div>
                    </div>
                </div>

                {this.state.education.length - 1 === i && <input class="btn  btn-primary float-right" type='submit' value='add more' onClick={this.addmoreClick.bind(this)} />}
                {this.state.education.length - 1 === i && <div style={{ textAlign: "right" }} className="col-md-6">
                    <input type="button" name="firstnext" class="btn  btn-primary" value="Previous" onClick={(e) => { this.previous(e) }} /> &nbsp;
                             <input type="button" name="firstnext" class="btn  btn-primary" value="Next" onClick={(e) => { this.usereducation(e) }} />
                </div>}
            </div>
        ))
    }
    removeClick(event, i) {
        event.preventDefault();
        let education = [...this.state.education];
        education.splice(i, 1);
        this.setState({ education });
    }
    changeHandler(event, i) {
        this.setState({
            [`${event.target.name}_${i}`]: event.target.value
        });
    }

    //file upload
    filechangeHandler(event, i, key) {
        let certiurl = "";
        let filess = event.target.files;
        S3.upload({
            files: filess,
            path: "/img"
        }, function (event, r) {
            certiurl = r.url;
        });
        this.setState({
            [`education.certificate_${key}_${i}`]: certiurl
        });
        console.log(": : file ::" + this.state[`education.certificate_${key}_${i}`]);
    }
    //country 
    myCountryHandlar = (selectedOption) => {
        this.setState({ selectedOption });
        Session.set('country', selectedOption.value);
    }
    //State
    mystateChangeHandler = (selectedOption1) => {
        this.setState({ selectedOption1 });
        Session.set('state', selectedOption1.value);
    }
    mycityChangeHandler = (selectedOption2) => {
        this.setState({ selectedOption2 });
    }
    //technology
    mytechnologyChangeHandler = (event) => {
        this.setState({ tags });
    }
    //tag input
    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }
    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }
    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        this.setState({ tags: newTags });
    }
    //profile
    profile() {
        if (this.validator.allValid()) {
            let user = {
                email: this.state.email,
                profile: {
                    userType: this.state.usertype,
                    firstName: this.state.firstname,
                    fatherName: this.state.fathername,
                    motherName: this.state.mothername,
                    gender: this.state.gender,
                    birthDate: this.state.dateofbirth,
                    officalEmailId: this.state.offcialemailid,
                    phone: this.state.phone,
                    joiningDate: this.state.joiningdate,
                }
            }
            Meteor.call('insertuser', user, this.state.education, function (err, result) {
                if (!err) {
                    Session.set('userid', result);
                    toast.success("Insert successfully...." + result);
                    $('.nav-tabs li a[href="#tab-2"]').tab('show');
                } else {
                    toast.error(err);
                }
            })
            

        } else {
            this.validator.showMessages();
        }
    }

    myChangeHandler(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    //Education
    usereducation(e) {
        e.preventDefault();
        console.log(JSON.stringify(this.state.education));
        
        Meteor.call('addeducation', Session.get('userid'), this.state.education, function (err, result) {
            if (!err) {
                toast.success("Updated successfully...." + result);
            } else {
                toast.error(err);
            }
        })
        $('.nav-tabs li a[href="#tab-3"]').tab('show');
    }
    //Experiance
    userexperiance(e) {
        e.preventDefault();
        if (this.validator2.allValid()) {
            let experiance = [{
                companyName: this.state.companyname,
                workExpeience: this.state.workexperiance,
                startAt: this.state.startdate,
                endAt: this.state.enddate,
                technology: this.state.tags
            }];
            console.log(experiance);

            Meteor.call('addexperiance', Session.get('userid'), experiance, function (err, result) {
                if (!err) {
                    toast.success("Updated Experiance successfully...." + result);
                } else {
                    toast.error(err.message);

                }
            })
        } else {
            this.validator2.showMessages();
        }

    }
    previous(e) {
        e.preventDefault();
        if ($('.nav-tabs li a[href="#tab-3"]').tab('show')) {
            $('.nav-tabs li a[href="#tab-2"]').tab('show');
        } if ($('.nav-tabs li a[href="#tab-2"]').tab('show')) {
            $('.nav-tabs li a[href="#tab-1"]').tab('show');
        }
    }
    componentDidMount() {
        //tage input
        $('.tagsinput').tagsinput({
            tagClass: 'label label-primary'
        });
        //datepicker
        $('.input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true
        });

        $('#acedemic_year').datepicker({
            format: "yyyy",
            autoclose: true,
            minViewMode: "years"
        });



    }
    render() {
        const { selectedOption, selectedOption1, selectedOption2 } = this.state;
        const { tags, suggestions } = this.state;
        let countrys = [], statess = [], city = [], option, option1, option2;
        {
            this.props.countries.length ? this.props.countries.map((country) => (
                option = { value: country._id, label: country.countryname },
                countrys.push(option)
            )) : <div className="no-events">OOOPSY: NO EVENTS REGISTERED</div>
        }
        {
            {
                this.props.state.length ? this.props.state.map((states) => (
                    option1 = { value: states._id, label: states.stateName },
                    statess.push(option1)
                )) : <div className="no-events">OOOPSY: NO EVENTS REGISTERED</div>
            }
        }
        {
            this.props.city.length ? this.props.city.map((cities) => (
                option2 = { value: cities._id, label: cities.cityName },
                city.push(option2)
            )) : <div className="no-events">OOOPSY: NO EVENTS REGISTERED</div>
        }
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        }
        return (
            <div className="wrapper wrapper-content animated fadeInRight" >
                <div class="tabs-container">
                    <ul class="nav nav-tabs" role="tablist">
                        <li class="active" ><a class="nav-link active" data-toggle="tab" href="#tab-1" > Personal Information</a></li>
                        <li id="li1"><a class="nav-link" data-toggle="tab" href="#tab-2">Education</a></li>
                        <li id="li2"><a class="nav-link" data-toggle="tab" href="#tab-3">Experiance</a></li>
                    </ul>
                    <div class="tab-content">
                        <div role="tabpanel" id="tab-1" class="tab-pane active">
                            <div class="panel-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="col-md-4">
                                                <label className="mainheading">Personal Details</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="hr-line-dashed1"></div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <label>First Name</label>
                                                <input type="text"
                                                    className="form-control"
                                                    placeholder=""
                                                    id="first_name"
                                                    name="firstname"
                                                    value={this.state.firstname}
                                                    onChange={this.myChangeHandler.bind(this)}
                                                />
                                                {this.validator.message('Firstname', this.state.firstname, 'required|alpha')}
                                            </div>
                                            <div className="col-md-6">
                                                <label>Last Name</label>
                                                <input type="text"
                                                    className="form-control"
                                                    name="lastname"
                                                    id="last_name"
                                                    onChange={this.myChangeHandler.bind(this)}
                                                />
                                                {this.validator.message('Lastname', this.state.lastname, 'required|alpha')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <label>Father Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="fathername"
                                                    id="father_name"
                                                    onChange={this.myChangeHandler.bind(this)}
                                                />
                                                {this.validator.message('Fathername', this.state.fathername, 'required|alpha')}
                                            </div>
                                            <div className="col-md-6">
                                                <label>Mother Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="mothername"
                                                    id="mother_name"
                                                    onChange={this.myChangeHandler.bind(this)}
                                                />
                                                {this.validator.message('Mothername', this.state.mothername, 'required|alpha')}
                                            </div>


                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <label>Birth Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="dateofbirth"
                                                        value={this.state.dateofbirth}
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />          
                                            </div>

                                            <div className="col-md-6">
                                                <label>Email Id</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    id="email_id"
                                                    onChange={this.myChangeHandler.bind(this)}
                                                    placeholder="Enter Email" />
                                                {this.validator.message('Email', this.state.email, 'required|email')}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <label className="inline">Offical EmailId </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder=""
                                                    name="offcialemailid"
                                                    onChange={this.myChangeHandler.bind(this)}
                                                />

                                            </div>

                                            <div className="col-md-6">
                                                <label>Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder=""
                                                    id="phone"
                                                    name="phone"
                                                    onChange={this.myChangeHandler.bind(this)}
                                                />
                                                {this.validator.message('Phone', this.state.phone, 'required|phone')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div class="col-md-6">
                                                <label>Joining Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="joiningdate"
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />
                                            </div>
                                            <div className="col-md-2">
                                                <label>Gender</label><br />
                                                <div className="radio-inline form-check abc-radio abc-radio-success">

                                                    <input className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="female"
                                                        value="female"
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />
                                                    <label className="form-check-label" for="female">
                                                        Female
                                                             </label>
                                                </div>&nbsp;&nbsp;&nbsp;
                                                        <div className="radio-inline  form-check abc-radio abc-radio-success">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="male"
                                                        value="male"
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />
                                                    <label className="form-check-label" for="male">
                                                        Male
                                                          </label>
                                                </div>
                                                {this.validator.message('Gender', this.state.gender, 'required|alpha')}
                                            </div>

                                            <div className="col-md-4">
                                                <label>User Type</label><br />
                                                <div className="radio-inline form-check abc-radio abc-radio-success">

                                                    <input className="form-check-input"
                                                        type="radio"
                                                        name="usertype"
                                                        id="superadmin"
                                                        value="superadmin"
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />
                                                    <label className="form-check-label" for="superadmin">
                                                        Super Admin
                                                             </label>
                                                </div>&nbsp;&nbsp;&nbsp;
                                                        <div className="radio-inline  form-check abc-radio abc-radio-success">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="usertype"
                                                        id="admin"
                                                        value="admin"
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />
                                                    <label className="form-check-label" for="admin">
                                                        Admin
                                                          </label>
                                                </div>&nbsp;&nbsp;&nbsp;

                                                        <div className="radio-inline  form-check abc-radio abc-radio-success">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="usertype"
                                                        id="employee"
                                                        value="employee"
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />
                                                    <label className="form-check-label" for="employee">
                                                        Employee
                                                          </label>&nbsp;&nbsp;&nbsp;
                                                        </div>
                                                {this.validator.message('Usertypw', this.state.usertype, 'required|alpha')}
                                            </div>

                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="col-sm-4">
                                                <label className="mainheading">Address</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <div className="hr-line-dashed1"></div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12" >
                                            <div className="col-md-6">
                                                <label>Address Line 1</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="addressline1"
                                                    id="add_line1"
                                                    style={{ marginRight: "15px" }}
                                                    onChange={this.myChangeHandler.bind(this)}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label>Address Line 2</label>
                                                <input type="text" className="form-control" name="addressline2" onChange={this.myChangeHandler.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6 ml-0">
                                                <label>Country</label>
                                                <Select value={selectedOption} options={countrys} onChange={this.myCountryHandlar} />
                                            </div>
                                            <div className="col-md-6 ml-0">
                                                <label>State</label>
                                                <Select value={selectedOption1} options={statess} onChange={this.mystateChangeHandler} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6 ml-0">
                                                <label>City</label>
                                                <Select value={selectedOption2} options={city} onChange={this.mycityChangeHandler} ></Select>
                                            </div>
                                            <div className="col-md-6">
                                                <label>Zipcode</label>
                                                <input type="text" className="form-control" placeholder="" id="zipcode" name="zipcode" onChange={this.myChangeHandler.bind(this)}
                                                />
                                                {this.validator.message('Zipcode', this.state.zipcode, 'required|numeric')}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <button className="btn btn-primary" onClick={this.profile.bind(this)}>Submit</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div role="tabpanel" id="tab-2" class="tab-pane">
                            {this.createUI()}
                        </div>
                        <div role="tabpanel" id="tab-3" class="tab-pane">
                            <div class="panel-body">
                                <div className="container-fluid">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-4">
                                                <label>Company Name</label>
                                                <input type="text" className="form-control" placeholder="" name="companyname" onChange={this.myChangeHandler.bind(this)}
                                                />
                                                {this.validator2.message('Companyname', this.state.companyname, 'required|alpha')}
                                            </div>
                                            <div className="col-md-4">
                                                <label>Work Experiance</label>
                                                <input type="text" className="form-control" name="workexperiance" onChange={this.myChangeHandler.bind(this)} placeholder=""
                                                />
                                                {this.validator2.message('Workexperiance', this.state.workexperiance, 'required|alpha')}
                                            </div>
                                            <div className="col-md-4">
                                                <label>Technlogoy</label><br />
                                                <ReactTags tags={tags} suggestions={suggestions} handleDelete={this.handleDelete} handleAddition={this.handleAddition} handleDrag={this.handleDrag} placeholder="" className="form-control" onChange={this.mytechnologyChangeHandler.bind(this)} delimiters={delimiters} />
                                                {this.validator2.message('Technology', this.state.tags, 'required')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <label>Start Date</label>                                            
                                                    <input type="date" className="form-control" value={this.state.startdate} name="startdate" onChange={this.myChangeHandler.bind(this)}
                                                    />
                                                {this.validator2.message('StartDate', this.state.startdate, 'required')}
                                            </div>

                                            <div className="col-md-6">
                                                <label>End Date</label>

                                                {/* <div className="input-group date"> */}
                                                    {/* <span className="input-group-addon"><i className="fa fa-calendar"></i></span> */}
                                                    <input type="date" className="form-control" name="enddate" value={this.state.enddate}
                                                        onChange={this.myChangeHandler.bind(this)}
                                                    />
                                                {/* </div> */}
                                                {this.validator2.message('EndDate', this.state.enddate, 'required')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <input type="button" name="firstnext" class="btn  btn-primary float-right" value="Previous" onClick={(e) => { this.previous(e) }} /> &nbsp;
                                        <input type="button" name="firstnext" class="btn  btn-primary float-right" value="Finish" onClick={(e) => { this.userexperiance(e) }} />
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
    Meteor.subscribe('CountryData');
    Meteor.subscribe('Statedata1', Session.get('country'));
    Meteor.subscribe('citydata', Session.get('state'));
    return {
        countries: Country.find({}).fetch(),
        state: State.find({ countryId: Session.get('country') }).fetch(),
        city: Cities.find({ stateId: Session.get('state') }).fetch()
    }
})(AddHR);
