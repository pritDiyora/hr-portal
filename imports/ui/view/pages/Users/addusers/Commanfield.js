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
import Images from '../../../../../api/fileUploading/cfsCollection';
class AddHR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {}, email: "", loading: false, CountryOption: {}, StateOption: {}, CityOption: {},
      education: [{ key: Random.id(), index: 0 }],
      flag: null,
      experiance: [{ key: Random.id(), index: 0 }],
      lastIndex: 0, countrie: [], states: [], city: [], zipcode: "", addressline1: "", addressline2: "", userid: ""
    }
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.TaghandleChange = this.TaghandleChange.bind(this);
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
    this.userexperiance = this.userexperiance.bind(this);
    this.AddressChangeHandler = this.AddressChangeHandler.bind(this);
    this.BirthDateChangeHandler = this.BirthDateChangeHandler.bind(this);
    this.JoinDateChangeHandler = this.JoinDateChangeHandler.bind(this);
    this.reactTags = React.createRef(); this.child = React.createRef();
    this.EmailChangeHandler = this.EmailChangeHandler.bind(this);
    this.Profilevalidator = new SimpleReactValidator({ autoForceUpdate: this, className: "text-danger" });
    this.Educationvalidator = new SimpleReactValidator({ autoForceUpdate: this, className: "text-danger" });
    this.Experiencevalidator = new SimpleReactValidator({ autoForceUpdate: this, className: "text-danger" });
  }
  componentDidMount() {
    //datepicker
    $('.input-group.date').datepicker({
      format: "yyyy",
      autoclose: true,
      minViewMode: "years",
      changeYear: true,
      yearRange: "2005:2015"
    });
  }
  componentWillReceiveProps(nextProps) {
    let self = this, countrie = [], states = [], city = [];
    nextProps.countries.length > 0 && nextProps.countries.map((country) => countrie.push({ value: country._id, label: country.countryname }));
    nextProps.state.length > 0 && nextProps.state.map((state) => states.push({ value: state._id, label: state.stateName }));
    nextProps.city.length > 0 && nextProps.city.map((cities) => city.push({ value: cities._id, label: cities.cityName }));
    self.setState({ countrie, states, city });
    if (self.props.flag == 1) {
      self.updateUserDetails(nextProps.userdata, self,nextProps.countries,nextProps.statedata,nextProps.citiesdata);
    } else {
      self.setState({ flag: self.props.flag });
    }
  }
  
  updateUserDetails(userdata, self,countryData,stateData,cityData) {
    self.setState({ flag: self.props.flag, userid: FlowRouter.current("_id").params._id })
    let { profile } = self.state;
    let userAddress = userdata && userdata.address || [],
      userEducation = userdata && userdata.education || [],
      userExperiance = userdata && userdata.experiance || [];
    //set User Profile
    profile[`firstName`] = userdata && userdata && userdata.profile.firstName;
    profile[`lastName`] = userdata && userdata.profile.lastName;
    profile[`fatherName`] = userdata && userdata.profile.fatherName;
    profile[`motherName`] = userdata && userdata.profile.motherName;
    profile[`gender`] = userdata && userdata.profile.gender;
    profile[`birthDate`] = userdata && userdata.profile.birthDate;
    profile[`officalEmailid`] = userdata && userdata.profile.officalEmailId;
    profile[`userType`] = userdata && userdata.profile.userType;
    profile[`phone`] = userdata && userdata.profile.phone;
    profile[`joiningDate`] = userdata && userdata.profile.joiningDate;
    profile[`description`] = userdata && userdata.profile.description;
    self.setState({ email: userdata && userdata.emails[0].address, profile });
    //set User Address
    userAddress.map((addresses) => {
      let couobj = countryData && countryData.find(cou => cou._id == addresses.country);
      self.setState({ CountryOption: { value: couobj && couobj._id, label: couobj && couobj.countryname } });
      let stateobj = stateData && stateData.find(state => state._id == addresses.state);
      self.setState({ StateOption: { value: stateobj && stateobj._id, label: stateobj && stateobj.stateName } });
      let cityobj = cityData && cityData.find(ci => ci._id == addresses.city);
      self.setState({ CityOption: { value: cityobj && cityobj._id, label: cityobj && cityobj.cityName } });
      self.setState({ addressline1: addresses.addressline1, addressline2: addresses.addressline2, zipcode: addresses.zipcode });
    });
    //set User Education
    let education = []
    userEducation.map((edu, i) => {
      let value = { key: Random.id(), index: i };
      education.push(value)
      this.setState({
        [`education.coursename_${value.key}`]: edu.cousrseName,
        [`education.coursetype_${value.key}`]: edu.cousrseType,
        [`education.institutename_${value.key}`]: edu.instituteName,
        [`education.acedemicyear_${value.key}`]: edu.academicYear,
        [`education.certificate_${value.key}`]: edu.certificate,
        education
      });
    });
    //set User Excperiance
    let experiance = [];
    userExperiance.map((exp, i) => {
      let value = { key: Random.id(), index: i };
      experiance.push(value)
      self.setState({
        [`experiance.companyname_${value.key}`]: exp.companyName,
        [`experiance.workexperiance_${value.key}`]: exp.workExpeience,
        [`experiance.startdate_${value.key}`]: exp.startAt,
        [`experiance.enddate_${value.key}`]: exp.endAt,
        [`experiance.techonology_${value.key}`]: exp.technology || [],
        experiance
      })
    });
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
        rowData={el} id={i} education={this.state.education} 
        EducationaddmoreClick={this.EducationaddmoreClick}
        previous={this.previous} Educationvalidator={this.Educationvalidator}
        EduucationremoveClick={this.EduucationremoveClick}
        EducationchangeHandler={this.EducationchangeHandler}
        filechangeHandler={this.filechangeHandler}
        usereducation={this.usereducation}
        coursename={this.state[`education.coursename_${el.key}`] || ''}
        loading={this.state.loading}
        instituename={this.state[`education.institutename_${el.key}`] || ''}
        academicyear={this.state[`education.acedemicyear_${el.key}`] || ''}
        coursetype={this.state[`education.coursetype_${el.key}`] || ''}
        certificate={this.state[`education.certificate_${el.key}`] || ''}
      />);
    });
  }
  //tag
  TaghandleChange(tag, key) {
    this.setState({
      [`experiance.techonology_${key}`]: tag
    }, () => {
      console.log("tag", this.state);
    });

  }
  EduucationremoveClick(event, i) {
    event.preventDefault();
    let education = [...this.state.education];
    education.splice(i, 1);
    this.setState({ education });
  }
  BirthDateChangeHandler(date) {
    let { profile } = this.state;
    profile[`birthDate`] = date;
    this.setState({
      profile
    }, () => {
      console.log(this.state);

    });
  }
  JoinDateChangeHandler(date) {
    let { profile } = this.state;
    profile[`joiningDate`] = date
    this.setState({
      profile
    });
  }
  //file upload
  filechangeHandler(e, key) {
    var self = this;
    // let filess = e.target.files;
    self.setState({ loading: true })
    const upload = Images.insert({
      file: e.target.files[0],
      streams: 'dynamic',
      chunkSize: 'dynamic'
    }, false);
    upload.on('start', function () {
    });
    upload.on('end', function (error, fileObj) {
      if (error) {
        alert('Error during upload: ' + error);
      } else {
        alert('File "' + fileObj.name + '" successfully uploaded');
      }
    });
    upload.start();
  }
  EducationchangeHandler(event) {
    this.setState({
      [`${event.target.name}`]: event.target.value
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
    this.setState({ StateOption: '' });
    this.setState({ CityOption: '' });
    Session.set('country', CountryOption.value);
  }
  //State
  mystateChangeHandler = (StateOption) => {
    this.setState({ StateOption });
    this.setState({ CityOption: '' });
    Session.set('state', StateOption.value);
  }
  //City
  mycityChangeHandler = (CityOption) => {
    this.setState({ CityOption });
  }
  //Date range 
  handleFromChange(from, key) {
    this.setState({
      [`experiance.startdate_${key}`]: from
    });
  }

  handleToChange(to, key) {
    this.setState({
      [`experiance.enddate_${key}`]: to
    }, this.child.current.showFromMonth());
  }
  AddressChangeHandler(event) {
    const { name, value } = event.target;
    this.setState({
      [`${name}`]: value
    });
  }
  ExperienceChangeHandler(event) {
    this.setState({
      [`${event.target.name}`]: event.target.value
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
    let self = this;
    let educations = [];
    this.state.education.map((el, i) => {
      let obj = {
        cousrseName: this.state[`education.coursename_${el.key}`],
        cousrseType: this.state[`education.coursetype_${el.key}`],
        instituteName: this.state[`education.institutename_${el.key}`],
        academicYear: this.state[`education.acedemicyear_${el.key}`],
        certificate: this.state[`education.certificate_${el.key}`]
      }
      educations.push(obj);
    });
    Meteor.call('addeducation', this.state.userid, educations, function (err, result) {
      if (!err) {
        if (self.state.flag == 1) {
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
    let exp = [], self = this;
    this.state.experiance.map((el, i) => {
      let obj = {
        companyName: this.state[`experiance.companyname_${el.key}`],
        workExpeience: this.state[`experiance.workexperiance_${el.key}`],
        startAt: this.state[`experiance.startdate_${el.key}`],
        endAt: this.state[`experiance.enddate_${el.key}`],
        technology: this.state[`experiance.techonology_${el.key}`] || []
      };
      exp.push(obj);
    });
    Meteor.call('addexperiance', this.state.userid, exp, function (err, result) {
      if (!err) {
        if (self.state.flag == 1) {
          $('.nav-tabs li a[href="#tab-1"]').tab('show');
          toast.success("Updated Experiance successfully...." + result);
        } else {
          $('.nav-tabs li a[href="#tab-1"]').tab('show');
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
  render() {
    const { countrie, states, city } = this.state;
    return (
      <div className="wrapper wrapper-content animated fadeInRight" >
        <div className="tabs-container">
          <ul className="nav nav-tabs" role="tablist">
            <li className="active" ><a className="nav-link active" data-toggle="tab" href="#tab-1" ><i className="fa fa-user"></i>Personal Information</a></li>
            <li id="li1"><a className="nav-link" data-toggle="tab" href="#tab-2"><i className="fa fa-book"></i>Education</a></li>
            <li id="li2"><a className="nav-link" data-toggle="tab" href="#tab-3"><i className="fa fa-graduation-cap"></i>Experiance</a></li>
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
                    description={this.state.profile.description}
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
                  ref={this.child}
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
                  compantname={this.state[`experiance.companyname_${el.key}`] || ''}
                  workexpeience={this.state[`experiance.workexperiance_${el.key}`] || ''}
                  technology={this.state[`experiance.techonology_${el.key}`] || []}
                  startdate={this.state[`experiance.startdate_${el.key}`] || undefined}
                  enddate={this.state[`experiance.enddate_${el.key}`] || undefined}
                  handleFromChange={this.handleFromChange}
                  handleToChange={this.handleToChange}
                />)
              })}
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