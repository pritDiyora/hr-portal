import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import Avatar from 'react-avatar';
import GeneralSetting from '../../../../api/generalsetting/generalsetting';
import Leave from '../../../../api/leave/leaveScheme';
import EducationComponent from '../Users/addusers/component/EducationComponent';
import ExperieanceComponent from '../Users/addusers/component/ExperienceComponent';
import User from '../../../../api/user/users';
import SimpleReactValidator from 'simple-react-validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Images from '../../../../api/fileUploading/cfsCollection';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "", states: "", city: "", zipcode: "", profileimage: "", totalgainleave: 0, experiance: [{ key: Random.id(), index: 0 }],
      remainingleave: 0, totalunpaidleave: 0, totalpaidleave: 0, mothly: "", education: [{ key: Random.id(), index: 0 }], lastIndex: 0,
      flag: 0
    }
    this.EducationaddmoreClick = this.EducationaddmoreClick.bind(this);
    this.EducationchangeHandler = this.EducationchangeHandler.bind(this);
    this.filechangeHandler = this.filechangeHandler.bind(this);
    this.usereducation = this.usereducation.bind(this);
    this.EduucationremoveClick = this.EduucationremoveClick.bind(this);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.TaghandleChange = this.TaghandleChange.bind(this);
    this.removeClickexperiance = this.removeClickexperiance.bind(this)
    this.userexperiance = this.userexperiance.bind(this);
    this.ExperienceChangeHandler = this.ExperienceChangeHandler.bind(this);
    this.ExperienceaddmoreClick=this.ExperienceaddmoreClick.bind(this);
    this.reactTags = React.createRef(); this.child = React.createRef();
    this.Experiencevalidator = new SimpleReactValidator({ autoForceUpdate: this, className: "text-danger" });
    this.Educationvalidator = new SimpleReactValidator({ autoForceUpdate: this, className: "text-danger" });
  }
  componentWillReceiveProps(nextProps) {
    let userCountry = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].country || [],
      userState = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].state || [],
      userCity = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].city || [],
      userZipCode = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].zipcode || [];
    let cou = nextProps.countries.find(cou => cou._id == userCountry) || {};
    let stat = nextProps.statedata.find(st => st._id == userState) || {};
    let cities = nextProps.citiesdata.find(city => city._id == userCity) || {};
    this.setState({ country: cou.countryname, states: stat.stateName, city: cities.cityName, zipcode: userZipCode });
    this.totalLeaveCaculation(nextProps);
  }
 
  profilePicUploade(e) {
    var self = this;
    let filess = e.target.files;
    S3.upload({
      files: filess,
      path: "profileImage"
    }, function (err, r) {
      if (!err) {
        Meteor.call('profileImageUploade', r.url, Meteor.userId(), function (err1, res1) {
          if (!err1) {
            console.log("Uploaded Successfully...");
            self.setState({
              profileimage: r.url,
              loading: false
            }, () => {
              console.log("df :: ", self.state);
            });
          }
        });
      }
    });

  }
  totalLeaveCaculation(nextProps) {
    let count = 0;
    nextProps.userLeaveData && nextProps.userLeaveData.map((ule) => {
      const startdate = moment(ule.startDate, "DD/MM/YYYY");
      const enddate = moment(ule.endDate, "DD/MM/YYYY");
      let days = enddate.diff(startdate, 'days');
      startdate.add(days, 'days');
      count = count + days;
    });
    if (count > 12) {
      let paidLeave = (nextProps.generalData && nextProps.generalData.yearlyLeave - count) * -1;
      this.setState({ totalpaidleave: paidLeave, totalgainleave: count });
    } else {
      let remainLeave = nextProps.generalData && nextProps.generalData.yearlyLeave - count;
      this.setState({ totalgainleave: count, remainingleave: remainLeave });
    }
  }
  educationListing() {
    if (this.props.userdata && this.props.userdata.education && this.props.userdata.education.length > 0) {
      return (
        <div className="panel-body">
          <div className="card profile-box flex-fill">
            <div className="card-body">
              <h3 className="card-title">Education Informations <a onClick={(e) => this.editEducation(e)} className="edit-icon" data-toggle="modal" ><i className="fa fa-pencil"></i></a></h3>
              <div className="experience-box">
                <ul className="experience-list">
                  {this.props.userdata && this.props.userdata.education.map((user) => {
                    return (<li>
                      <div className="experience-user">
                        <div className="before-circle"></div>
                      </div>
                      <div className="experience-content">
                        <div className="timeline-content">
                          <a href="#" className="name">{user.instituteName}</a>
                          <div>{user.cousrseName}</div>
                          <span className="time">{user.academicYear}</span>
                        </div>
                      </div>
                    </li>)
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
          <div className="panel-body" style={{ padding: "10px" }}><a onClick={(e) => this.education(e)}><i className="fa fa-plus-circle addmore"><b>Add More</b></i></a></div>
      );
    }
  }
  EducationaddmoreClick(event) {
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
  EducationchangeHandler(event) {
    this.setState({
      [`${event.target.name}`]: event.target.value
    });
  }
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
  createUIEducation() {
    return this.state.education.map((el, i) => {
      return (<div className="card">
        <EducationComponent
          rowData={el} id={i} education={this.state.education} EducationaddmoreClick={this.EducationaddmoreClick}
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
        />
      </div>

      );
    });
  }
  EduucationremoveClick(event, i) {
    event.preventDefault();
    let education = [...this.state.education];
    education.splice(i, 1);
    this.setState({ education });
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
    Meteor.call('addeducation', Meteor.userId(), educations, function (err, result) {
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
  }
  editEducation() {
    let education = []
    this.props.userdata.education && this.props.userdata.education.map((edu, i) => {
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
    $("#add-panel").modal("show");
  }
  education() {
    $("#add-panel").modal("show");
  }

  //Experiance
  createUIExperiance() {
    return this.state.experiance.map((el, i) => {
      return (<div className="card">
        <ExperieanceComponent
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
        />
      </div>
      )
    })
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
  ExperienceChangeHandler(event) {
    this.setState({
      [`${event.target.name}`]: event.target.value
    });
  }
  editExperience() {
    let experiance = [];
    this.props.userdata.experiance && this.props.userdata.experiance.map((exp, i) => {
      let value = { key: Random.id(), index: i };
      experiance.push(value)
      this.setState({
        [`experiance.companyname_${value.key}`]: exp.companyName,
        [`experiance.workexperiance_${value.key}`]: exp.workExpeience,
        [`experiance.startdate_${value.key}`]: exp.startAt,
        [`experiance.enddate_${value.key}`]: exp.endAt,
        [`experiance.techonology_${value.key}`]: exp.technology || [],
        experiance
      })
    });
    $("#add-panel1").modal("show");
  }
  experianceListing() {
    if (this.props.userdata && this.props.userdata.experiance && this.props.userdata.experiance.length > 0) {
      return (
        <div className="panel-body">
          <div className="card profile-box flex-fill">
            <div className="card-body">
              <h3 className="card-title">Experiance Informations <a onClick={(e) => this.editExperience(e)} className="edit-icon" data-toggle="modal" ><i className="fa fa-pencil"></i></a></h3>
              <div className="experience-box">
                <ul className="experience-list">
                  {this.props.userdata && this.props.userdata.experiance.map((user) => {
                    return (<li>
                      <div className="experience-user">
                        <div className="before-circle"></div>
                      </div>
                      <div className="experience-content">
                        <div className="timeline-content">
                          <a href="#" className="name">{user.companyName}</a>
                          <div>{user.workExpeience}</div>
                          <span className="time">{JSON.stringify(user.technology).replace(/[^a-zA-Z,]/g, "")
                          }</span>
                        </div>
                      </div>
                    </li>)
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container-fluid" style={{ padding: "0px" }}>
          <div className="panel-body" style={{ padding: "10px" }}>
            <a onClick={(e) => this.experiance(e)}><i className="fa fa-plus-circle addmore"><b>Add More</b></i></a>
          </div>
        </div>
      );
    }
  }
  experiance() {
    $("#add-panel1").modal("show");
  }
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
  //tag
  TaghandleChange(tag, key) {
    this.setState({
      [`experiance.techonology_${key}`]: tag
    }, () => {
      console.log("tag", this.state);
    });

  }
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
    Meteor.call('addexperiance', Meteor.userId(), exp, function (err, result) {
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
  render() {
    let { currentUser } = this.props;
    let { country, states, city, zipcode, profileimage } = this.state;
    return (
      <div className="wrapper wrapper-content">
        <div className="row animated fadeInRight">
          <div className="col-md-4">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Profile Detail</h5>
              </div>
              <div>
                <div className="ibox-content no-padding border-left-right">
                  <center>
                    <label htmlFor="profileimage" className="img-circle img">
                      <input type="file" name="profileimage" id="profileimage" style={{ display: "none" }} onChange={(e) => this.profilePicUploade(e)} />
                      <Avatar src={profileimage == "" ? " "
                        : profileimage} className="img-circle" style={{ marginTop: "5px" }} value={profileimage} name={profileimage == "" ?
                          currentUser && currentUser.profile && currentUser.profile.firstName + " " + currentUser.profile.lastName
                          : ""} className="img-circle" style={{ marginTop: "5px" }}
                        size="150" color="#ffcccc" fgColor="#990000" maxInitials={2} />
                      <span className="green-overlay"></span>
                    </label>

                  </center>

                </div>
                <div className="ibox-content profile-content">
                  <center>
                    <h4>{currentUser && currentUser.profile && currentUser.profile.firstName + " " + currentUser.profile.lastName}</h4>
                    {country == undefined ? " " :
                      <p><i className="fa fa-map-marker"></i>&nbsp;
                                            {currentUser && currentUser.address && currentUser.address[0].addressline1}
                        {currentUser && currentUser.address && currentUser.address[0].addressline2 == undefined ? " " : currentUser && currentUser.address && currentUser.address[0].addressline2}
                        {country == undefined ? " " : "," + country}{states == undefined ? " " : "," + states}
                        {city == undefined ? "" : "," + city} {zipcode == undefined ? "" : "-" + zipcode}</p>
                    }
                    <p><i className="fa fa-phone"></i>&nbsp;{currentUser && currentUser.profile && currentUser.profile.phone}</p>
                    <p><i className="fa fa-envelope"></i>&nbsp;{currentUser && currentUser.emails && currentUser.emails[0].address}</p>
                    <h5><b><u>About me</u></b></h5>
                    <p>
                      {currentUser && currentUser.profile && currentUser.profile.description == undefined
                        ? currentUser && currentUser.profile && currentUser.profile.designation
                        : currentUser && currentUser.profile && currentUser.profile.description}
                    </p>
                  </center>
                  <div className="col-md-12" style={{ padding: "0px" }}>
                    <div className="col-md-3">
                      <div style={{ textAlign: "center" }}>
                        <h5>Annual Leave</h5>
                        <p>{this.props.generalData && this.props.generalData.yearlyLeave}</p>
                      </div>
                    </div>
                    <div className="col-md-3" style={{ padding: "0px" }}>
                      <div style={{ textAlign: "center" }}>
                        <h5>Total GainLeave</h5>
                        <p>{this.state.totalgainleave}/12</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div style={{ textAlign: "center" }}>
                        <h5>Total Paid</h5>
                        <p>{this.state.totalpaidleave}</p>
                      </div>
                    </div>
                    <div className="col-md-3" style={{ padding: "0px" }}>
                      <div style={{ textAlign: "center" }}>
                        <h5>Remaining Leave</h5>
                        <p>{this.state.remainingleave}</p>
                      </div>
                    </div>
                  </div>
                  <div className="user-button">
                    <div className="row">
                      <div className="col-md-6">
                        <button type="button" className="btn btn-primary btn-sm btn-block"><i className="fa fa-envelope"></i> Send Message</button>
                      </div>
                      <div className="col-md-6">
                        <button type="button" className="btn btn-default btn-sm btn-block"><i className="fa fa-coffee"></i> Buy a coffee</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="tabs-container">
              <ul className="nav nav-tabs" role="tablist">
                <li id="li1" className="active"><a className="nav-link active" data-toggle="tab" href="#tab-1"><i className="fa fa-book"></i>Education</a></li>
                <li id="li2"><a className="nav-link" data-toggle="tab" href="#tab-2"><i className="fa fa-graduation-cap"></i>Experiance</a></li>
              </ul>
              <div className="tab-content">
                <div role="tabpanel" id="tab-1" className="tab-pane active">
                  {this.educationListing()}
                </div>
                <div role="tabpanel" id="tab-2" className="tab-pane">
                  {this.experianceListing()}
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="modal fade" id="add-panel" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content1">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Add Education</h4>
              </div>
              <div className="modal-body">
                {this.createUIEducation()}
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="add-panel1" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content1">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Add Experiance</h4>
              </div>
              <div className="modal-body">
                {this.createUIExperiance()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('updateprofile', Meteor.userId());
  return {
    countries: Country.find({}).fetch(),
    currentUser: Meteor.user(),
    statedata: State.find({}).fetch(),
    citiesdata: Cities.find({}).fetch(),
    generalData: GeneralSetting.findOne({}),
    userLeaveData: Leave.find({ userId: Meteor.userId(), isApprove: true }).fetch(),
    userdata: User.findOne({ _id: Meteor.userId() })
  }
})(Profile);