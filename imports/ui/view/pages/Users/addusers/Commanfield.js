import React, { Component, useReducer } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { withTracker } from 'meteor/react-meteor-data';
import Country from '../../../../../api/country/country';
import State from '../../../../../api/states/states';
import Cities from '../../../../../api/cites/cites';
import SimpleReactValidator from 'simple-react-validator';
import Loader from '../../../layout/loader';
import EducationComponent from './component/EducationComponent';
import ProfileComponent from './component/ProfileComponent';
import ExperieanceComponent from './component/ExperienceComponent';
import AddressComponent from './component/AddressComponent';
import User from '../../../../../api/user/users';
class AddHR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {}, email: "", tags: [], loading: false, CountryOption: {}, StateOption: {}, CityOption: {},
            education: [{ key: Random.id(), index: 0 }],
            flag: null,
            experiance: [{ key: Random.id(), index: 0 }],
            lastIndex: 0, countrie: [], states: [], city: [], addressline1: "", addressline2: "", userid: ""
        }
        this.filechangeHandler = this.filechangeHandler.bind(this);
        this.profileChangeHandler = this.profileChangeHandler.bind(this);
        this.previous = this.previous.bind(this);
        this.EducationchangeHandler = this.EducationchangeHandler.bind(this);
        this.EducationaddmoreClick = this.EducationaddmoreClick.bind(this);
        this.EduucationremoveClick = this.EduucationremoveClick.bind(this);
        this.usereducation = this.usereducation.bind(this);
        this.ExperienceaddmoreClick = this.ExperienceaddmoreClick.bind(this);
        this.ExperienceChangeHandler = this.ExperienceChangeHandler.bind(this);
        this.removeClickexperiance = this.removeClickexperiance.bind(this)
        this.TaghandleChange = this.TaghandleChange.bind(this);
        this.userexperiance = this.userexperiance.bind(this);
        this.AddressChangeHandler = this.AddressChangeHandler.bind(this);
        this.BirthDateChangeHandler = this.BirthDateChangeHandler.bind(this);
        this.JoinDateChangeHandler = this.JoinDateChangeHandler.bind(this);
        this.reactTags = React.createRef();
        this.EmailChangeHandler = this.EmailChangeHandler.bind(this);
        this.Profilevalidator = new SimpleReactValidator({
            autoForceUpdate: this, className: "text-danger",
        });
        this.Educationvalidator = new SimpleReactValidator({
            autoForceUpdate: this, className: "text-danger",
        });
        this.Experiencevalidator = new SimpleReactValidator({
            autoForceUpdate: this, className: "text-danger",
        });
    }

    componentWillReceiveProps(nextProps) {
        let self = this, countrie = [], states = [], city = [];
        nextProps.countries.length > 0 && nextProps.countries.map((country) => countrie.push({ value: country._id, label: country.countryname }));
        nextProps.state.length > 0 && nextProps.state.map((state) => states.push({ value: state._id, label: state.stateName }));
        nextProps.city.length > 0 && nextProps.city.map((cities) => city.push({ value: cities._id, label: cities.cityName }));
        self.setState({
            countrie,
            states,
            city
        });
        if (this.props.flag == 1) {
            self.setState({ flag: this.props.flag, userid: FlowRouter.current("_id").params._id })
            let { profile, lastIndex } = self.state;
            let userAddress = nextProps.userdata.address || [],
                userEducation = nextProps.userdata.education || [] || undefined,
                userExperiance = nextProps.userdata.experiance || [] || undefined;
            //set User Profile
            profile[`firstName`] = nextProps.userdata.profile.firstName;
            profile[`lastName`] = nextProps.userdata.profile.lastName;
            profile[`fatherName`] = nextProps.userdata.profile.fatherName;
            profile[`motherName`] = nextProps.userdata.profile.motherName;
            profile[`gender`] = nextProps.userdata.profile.gender;
            profile[`birthDate`] = nextProps.userdata.profile.birthDate;
            profile[`officalEmailid`] = nextProps.userdata.profile.officalEmailId;
            profile[`userType`] = nextProps.userdata.profile.userType;
            profile[`phone`] = nextProps.userdata.profile.phone;
            self.setState({
                email: nextProps.userdata.emails[0].address,
                profile
            });
            //set User Address
            userAddress.map((addresses) => {
                self.props.countries.map((c) => {
                    if (addresses.country == c._id) {
                        let couobj = { value: addresses.country, label: c.countryname };
                        self.setState({ CountryOption: couobj });
                    }
                });
                self.props.statedata.map((s) => {
                    if (addresses.state == s._id) {
                        let stateobj = { value: addresses.state, label: s.stateName };
                        self.setState({ StateOption: stateobj });
                    }
                });
                self.props.citiesdata.map((ci) => {
                    if (addresses.city == ci._id) {
                        let cityobj = { value: addresses.city, label: ci.cityName };
                        self.setState({ CityOption: cityobj });
                    }
                });
                self.setState({
                    addressline1: addresses.addressline1,
                    addressline2: addresses.addressline2,
                    zipcode: addresses.zipcode,
                });

            });
            //set User Education
            let education = []
            userEducation.map((edu, i) => {
                let value = {
                    key: Random.id(),
                    index: i
                };
                education.push(value)
                this.setState({
                    [`education.coursename_${value.key}_${value.index}`]: edu.cousrseName,
                    [`education.coursetype_${value.key}_${value.index}`]: edu.cousrseType,
                    [`education.institutename_${value.key}_${value.index}`]: edu.instituteName,
                    [`education.acedemicyear_${value.key}_${value.index}`]: edu.academicYear,
                    [`education.certificate_${value.key}_${value.index}`]: edu.certificate,
                    education
                });
            });

            //set User Excperiance
            let experiance = [];
            userExperiance.map((exp, i) => {
                let value = {
                    key: Random.id(),
                    index: i
                };
                experiance.push(value)
                self.setState({
                    [`experiance.companyname_${value.key}_${value.index}`]: exp.companyName,
                    [`experiance.workexperiance_${value.key}_${value.index}`]: exp.workExpeience,
                    [`experiance.startdate_${value.key}_${value.index}`]: exp.startAt,
                    [`experiance.enddate_${value.key}_${value.index}`]: exp.endAt,
                    [`experiance.techonology_${value.key}_${value.index}`]: exp.technology || [],
                    experiance
                })
            });

        } else {
            self.setState({ flag: this.props.flag });
        }

    }
    //Addmore Education
    EducationaddmoreClick(e) {
        e.preventDefault();
        let { education, lastIndex } = this.state;
        let value = {
            key: Random.id(),
            index: (lastIndex + 1)
        }
        if (this.Educationvalidator.allValid()) {
            education.push(value)
            var lastIndex1 = this.state.lastIndex;
            this.setState({
                lastIndex: lastIndex1++
            })
            this.setState({
                lastIndex: lastIndex1,
                education: education
            })
        } else {
            this.Educationvalidator.showMessages();
        }
    }
    createUI() {
        return this.state.education.map((el, i) => {
            return (<EducationComponent
                rowData={el} id={i} education={this.state.education} EducationaddmoreClick={this.EducationaddmoreClick} previous={this.previous} Educationvalidator={this.Educationvalidator}
                EduucationremoveClick={this.EduucationremoveClick} EducationchangeHandler={this.EducationchangeHandler} filechangeHandler={this.filechangeHandler} usereducation={this.usereducation}
                coursename={this.state[`education.coursename_${el.key}_${el.index}`] || ''}
                instituename={this.state[`education.institutename_${el.key}_${el.index}`] || ''}
                academicyear={this.state[`education.acedemicyear_${el.key}_${el.index}`] || ''}
                coursetype={this.state[`education.coursetype_${el.key}_${el.index}`] || ''}
                certificate={this.state[`education.certificate_${el.key}_${el.index}`] || ''}
            />)
        })

    }
    EduucationremoveClick(event, i) {
        event.preventDefault();
        let education = [...this.state.education];
        education.splice(i, 1);
        this.setState({ education });
    }
    BirthDateChangeHandler(day) {
        let { profile } = this.state;
        let date = moment(day).format('YYYY-MM-DD');
        profile[`birthDate`] = date;
        this.setState({
            profile
        });
    }
    JoinDateChangeHandler(day) {
        let { profile } = this.state;
        let date = moment(day).format('YYYY-MM-DD');
        profile[`joiningDate`] = date
        this.setState({
            profile
        });
    }
    //file upload
    filechangeHandler(e, i, key) {
        var self = this;
        let filess = e.target.files;
        S3.upload({
            files: filess,
            path: "/img"
        }, function (err, r) {
            if (!err) {
                self.setState({
                    [`education.certificate_${key}_${i}`]: r.url
                }, () => {
                    console.log("df :: ", self.state);
                });
            }
        });


    }
    EducationchangeHandler(event, i) {
        this.setState({
            [`${event.target.name}_${i}`]: event.target.value
        });
    }
    //Add More Experiance
    ExperienceaddmoreClick(e) {
        e.preventDefault()
        let { experiance, lastIndex } = this.state;
        let value = {
            key: Random.id(),
            index: (lastIndex + 1)
        }
        if (this.Experiencevalidator.allValid()) {
            experiance.push(value)
            var lastIndex1 = this.state.lastIndex;
            this.setState({
                lastIndex: lastIndex1++
            })
            this.setState({
                lastIndex: lastIndex1,
                experiance: experiance
            })
        } else {
            this.Experiencevalidator.showMessages();
        }
    }
    removeClickexperiance(event, i) {
        event.preventDefault();
        let experiance = [...this.state.experiance];
        experiance.splice(i, 1);
        this.setState({ experiance });
    }
    //country 
    myCountryHandlar = (CountryOption) => {
        this.setState({ CountryOption });
        Session.set('country', CountryOption.value);
    }
    //State
    mystateChangeHandler = (StateOption) => {
        this.setState({ StateOption });
        Session.set('state', StateOption.value);
    }
    mycityChangeHandler = (CityOption) => {
        this.setState({ CityOption });
    }
    //tag
    TaghandleChange(tags, key, i) {
        this.setState({
            tags
        });
        this.setState({
            [`experiance.techonology_${key}_${i}`]: tags
        }, () => {
            console.log("tag :: ", this.state[`experiance.techonology_${key}_${i}`], this.state);

        });
    }
    AddressChangeHandler(event) {
        const { name, value } = event.target;
        this.setState({
            [`${name}`]: value
        });
    }
    ExperienceChangeHandler(event, i) {
        this.setState({
            [`${event.target.name}_${i}`]: event.target.value
        });
    }
    EmailChangeHandler(event) {
        this.setState({
            [`${event.target.name}`]: event.target.value
        })
    }
    profileChangeHandler(event) {
        const { name, value } = event.target;
        let { profile } = this.state;
        profile[`${name}`] = value;
        this.setState({
            profile
        });
    }
    //profile
    profile(e) {
        e.preventDefault();
        let self = this;
        if (self.Profilevalidator.allValid()) {
            let user = {
                email: self.state.email,
                profile: self.state.profile
            };
            let address = [{
                addressline1: self.state.addressline1,
                addressline2: self.state.addressline2,
                country: self.state.CountryOption.value,
                state: self.state.StateOption.value,
                city: self.state.CityOption.value,
                zipcode: self.state.zipcode,
            }];
            self.setState({ loading: true })
            if (self.state.flag == 1) {
                Meteor.call('updateUserProfile', self.state.userid, user, function (err, result) {
                    if (!err) {
                        // update user address here
                        Meteor.call('adddressadd', self.state.userid, address, function (err, res) {
                            if (!err) {
                                $('.nav-tabs li a[href="#tab-2"]').tab('show');
                                toast.success("Update successfully...." + res);
                                self.setState({ loading: false })
                            } else {
                                toast.error(err);
                            }
                        })
                    } else {
                        toast.error(err);
                    }
                })
            } else {
                Meteor.call('insertUserProfile', user, function (err, result) {
                    if (!err) {
                        self.setState({ userid: result });
                        // update user address here
                        Meteor.call('adddressadd', self.state.userid, address, function (err, res) {
                            if (!err) {
                                $('.nav-tabs li a[href="#tab-2"]').tab('show');
                                toast.success("Insert successfully...." + res);
                                self.setState({ loading: false })
                            } else {
                                toast.error(err);
                            }
                        })
                    } else {
                        toast.error(err);
                    }
                })
            }
        } else {
            self.Profilevalidator.showMessages();
        }
    }
    //Education
    usereducation(e) {
        e.preventDefault();
        let educations = [];
        this.state.education.map((el, i) => {
            let obj = {
                cousrseName: this.state[`education.coursename_${el.key}_${el.index}`],
                cousrseType: this.state[`education.coursetype_${el.key}_${el.index}`],
                instituteName: this.state[`education.institutename_${el.key}_${el.index}`],
                academicYear: this.state[`education.acedemicyear_${el.key}_${el.index}`],
                certificate: this.state[`education.certificate_${el.key}_${el.index}`]
            }
            educations.push(obj);
        });
        Meteor.call('addeducation', this.state.userid, educations, function (err, result) {
            if (!err) {
                if (flag == 1) {
                    toast.success("Updated successfully...." + result);
                } else {
                    toast.success("Inserted successfully...." + result);
                }

            } else {
                toast.error(err);
            }
        })
        $('.nav-tabs li a[href="#tab-3"]').tab('show');
    }
    //Experiance
    userexperiance(e) {
        e.preventDefault();
        let exp = [];
        this.state.experiance.map((el, i) => {
            let obj = {
                companyName: this.state[`experiance.companyname_${el.key}_${el.index}`],
                workExpeience: this.state[`experiance.workexperiance_${el.key}_${el.index}`],
                startAt: this.state[`experiance.startdate_${el.key}_${el.index}`],
                endAt: this.state[`experiance.enddate_${el.key}_${el.index}`],
                technology: this.state[`experiance.techonology_${el.key}_${el.index}`]
            };
            exp.push(obj);
        });
        Meteor.call('addexperiance', this.state.userid, exp, function (err, result) {
            if (!err) {
                if (flag == 1) {
                    toast.success("Updated Experiance successfully...." + result);
                } else {
                    toast.success("Inserted Experiance successfully...." + result);
                }

            } else {
                toast.error(err.message);

            }
        })

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
        //datepicker
        $('.input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true
        });
    }

    render() {
        const { tags, countrie, states, city } = this.state;
        return (
            <div className="wrapper wrapper-content animated fadeInRight" >
                <div className="tabs-container">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="active" ><a className="nav-link active" data-toggle="tab" href="#tab-1" > Personal Information</a></li>
                        <li id="li1"><a className="nav-link" data-toggle="tab" href="#tab-2">Education</a></li>
                        <li id="li2"><a className="nav-link" data-toggle="tab" href="#tab-3">Experiance</a></li>
                    </ul>
                    <div className="tab-content">
                        <div role="tabpanel" id="tab-1" className="tab-pane active">
                            {this.state.loading ? <Loader /> : <div className="panel-body" id="demo">
                                <div className="container-fluid">
                                    <ProfileComponent
                                        Profilevalidator={this.Profilevalidator} BirthDateChangeHandler={this.BirthDateChangeHandler}
                                        firstName={this.state.profile.firstName} JoinDateChangeHandler={this.JoinDateChangeHandler}
                                        fatherName={this.state.profile.fatherName}
                                        lastName={this.state.profile.lastName}
                                        motherName={this.state.profile.motherName}
                                        birthDate={this.state.profile.birthDate}
                                        officalEmailId={this.state.profile.officalEmailId}
                                        phone={this.state.profile.phone}
                                        joiningDate={this.state.profile.joiningDate}
                                        email={this.state.email}
                                        gender={this.state.profile.gender}
                                        userType={this.state.profile.userType}
                                        profileChangeHandler={this.profileChangeHandler}
                                        EmailChangeHandler={this.EmailChangeHandler}
                                    />
                                    <AddressComponent
                                        AddressChangeHandler={this.AddressChangeHandler}
                                        countrie={countrie}
                                        states={states}
                                        city={city}
                                        zipcode={this.state.zipcode || ''}
                                        CountryOption={this.state.CountryOption || {}}
                                        myCountryHandlar={this.myCountryHandlar}
                                        EmailChangeHandler={this.EmailChangeHandler}
                                        StateOption={this.state.StateOption || {}}
                                        mystateChangeHandler={this.mystateChangeHandler}
                                        CityOption={this.state.CityOption || {}}
                                        mycityChangeHandler={this.mycityChangeHandler}
                                        addressline1={this.state.addressline1 || ''}
                                        addressline2={this.state.addressline2 || ''}
                                    />
                                    <div style={{ textAlign: "right" }}>
                                        {
                                            this.state.flag ? <button className="btn btn-primary" id="insert" onClick={this.profile.bind(this)}>Update Profile</button>
                                                : <button className="btn btn-primary" id="insert" onClick={this.profile.bind(this)}>Submit</button>
                                        }

                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                        <div role="tabpanel" id="tab-2" className="tab-pane">
                            {this.createUI()}
                        </div>
                        <div role="tabpanel" id="tab-3" className="tab-pane">
                            {this.state.experiance.map((el, i) => {
                                return (<ExperieanceComponent
                                    rowData={el}
                                    id={i}
                                    experiance={this.state.experiance}
                                    userexperiance={this.userexperiance}
                                    ExperienceChangeHandler={this.ExperienceChangeHandler}
                                    flag={this.state.flag}
                                    previous={this.previous}
                                    TaghandleChange={this.TaghandleChange}
                                    Experiencevalidator={this.Experiencevalidator}
                                    userexperiance={this.userexperiance}
                                    removeClickexperiance={this.removeClickexperiance}
                                    ExperienceaddmoreClick={this.ExperienceaddmoreClick}
                                    compantname={this.state[`experiance.companyname_${el.key}_${el.index}`] || ''}
                                    workexpeience={this.state[`experiance.workexperiance_${el.key}_${el.index}`] || ''}
                                    technology={this.state[`experiance.techonology_${el.key}_${el.index}`] || tags}
                                    startdate={this.state[`experiance.startdate_${el.key}_${el.index}`] || ''}
                                    enddate={this.state[`experiance.enddate_${el.key}_${el.index}`] || ''}
                                />)
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const AppContainer = withTracker(() => {
    Meteor.subscribe('CountryData');
    Meteor.subscribe('Statedata1', Session.get('country'));
    Meteor.subscribe('citydata', Session.get('state'));
    Meteor.subscribe('Statedata');
    Meteor.subscribe('Citydata');
    Meteor.subscribe('updateprofile', FlowRouter.current("_id").params._id);
    return {
        countries: Country.find({}).fetch(),
        state: State.find({ countryId: Session.get('country') }).fetch(),
        city: Cities.find({ stateId: Session.get('state') }).fetch(),
        statedata: State.find({}).fetch(),
        citiesdata: Cities.find({}).fetch(),
        userdata: User.findOne({ _id: FlowRouter.current("_id").params._id })
    }
})(AddHR);
export default AppContainer;