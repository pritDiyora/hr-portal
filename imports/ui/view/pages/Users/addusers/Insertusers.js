import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import IboxTools from '../../../layout/iboxTools';
import { type } from 'jquery';

const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
var phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

export default class AddHR extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            firstname: "",
            lastname: "",
            fathername: "",
            mothername: "",
            gender: "",
            dateofbirth: "",
            offcialemailid: "",
            phone: "",
            addressline1: "",
            addressline2: "",
            country: "",
            states: "",
            city: "",
            zipcode: "",
            coursename: "",
            coursetype: "",
            institutename: "",
            academicyear: "",
            certificate: "",
            companyname: "",
            workexpeience: "",
            startdate: "",
            enddate: "",
            technology: "",
        }

    }
    myChangeHandler = (event) => {
        const { name, value } = event.target;
        $(".error").remove();
        this.setState({ [name]: value });
    }
    componentDidMount() {
        $('.tagsinput').tagsinput({
            tagClass: 'label label-primary'
        });

        $('.input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true
        });


        (function ($) {
            var current_fs, next_fs, previous_fs; //fieldsets
            var left, opacity, scale; //fieldset properties which we will animate
            var animating; //flag to prevent quick multi-click glitches
            var form;
            form = $('#form1');
            $(".next").click(function () {
                var first_name = $('#first_name').val();
                var last_name = $('#last_name').val();
                var email = $('#email_id').val();
                var mother_name = $('#mother_name').val();
                var father_name = $('#father_name').val();
                var phone = $('#phone').val();
                var zipcode = $('#zipcode').val();
                var validEmail = validEmailRegex.test(email);
                var validphone = phone.match(phoneNum);
                $(".error").remove();
                if (first_name.length < 1) {
                    $('#first_name').after('<span class="error"><b>This field is required</b></span>');
                }
                else if (last_name.length < 1) {
                    $('#last_name').after('<span class="error"><b>This field is required</b></span>');
                }
                else if (email.length < 1) {
                    $('#email_id').after('<span class="error"><b>This field is required</b></span>');
                } else if (!validEmail) {
                    $('#email_id').after('<span class="error"><b>Enter a valid email</b></span>');
                } else if (phone.length < 1) {
                    $('#phone').after('<span class="error"><b>This field is required</b></span>')
                } else if (!validphone) {
                    $('#phone').after('<span class="error"><b>Enter a valid number</b></span>')
                }
                else if (phone.length != 10) {
                    $('#phone').after('<span class="error"><b>phone number must be at least 10</b></span>')
                } else if (mother_name.length < 1) {
                    $('#phone').after('<span class="error"><b>This field is required</b></span>')
                } else if (father_name.length < 1) {
                    $('#mother_name').after('<span class="error"><b>This field is required</b></span>')
                }
                else if (zipcode.length != 6) {
                    $('#zipcode').after('<span class="error"><b>Zipcode must be 6 number</b></span>')
                }
                else {
                    if (animating) return false;
                    animating = true;

                    current_fs = $(this).parent();
                    next_fs = $(this).parent().next();

                    //activate next step on progressbar using the index of next_fs
                    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                    //show the next fieldset

                    next_fs.show();
                    //hide the current fieldset with style
                    current_fs.animate({
                        opacity: 0
                    }, {
                        step: function (now, mx) {
                            //as the opacity of current_fs reduces to 0 - stored in "now"
                            //1. scale current_fs down to 80%
                            scale = 1 - (1 - now) * 0.2;
                            //2. bring next_fs from the right(50%)
                            left = (now * 50) + "%";
                            //3. increase opacity of next_fs to 1 as it moves in
                            opacity = 1 - now;
                            current_fs.css({
                                'transform': 'scale(' + scale + ')'
                            });
                            next_fs.css({
                                'left': left,
                                'opacity': opacity
                            });
                            form.validate().settings.ignore = ":disabled,:hidden";
                            return form.valid();

                        },
                        duration: 800,
                        complete: function () {
                            if (form.valid()) {

                            }
                            current_fs.hide();
                            animating = false;

                        },
                        //this comes from the custom easing plugin
                        easing: 'easeInOutBack'
                    });
                }
            });

            $(".previous").click(function () {
                if (animating) return false;
                animating = true;

                current_fs = $(this).parent();
                previous_fs = $(this).parent().prev();

                //de-activate current step on progressbar
                $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

                //show the previous fieldset
                previous_fs.show();
                //hide the current fieldset with style
                current_fs.animate({
                    opacity: 0
                }, {
                    step: function (now, mx) {
                        //as the opacity of current_fs reduces to 0 - stored in "now"
                        //1. scale previous_fs from 80% to 100%
                        scale = 0.8 + (1 - now) * 0.2;
                        //2. take current_fs to the right(50%) - from 0%
                        left = ((1 - now) * 50) + "%";
                        //3. increase opacity of previous_fs to 1 as it moves in
                        opacity = 1 - now;
                        current_fs.css({
                            'left': left
                        });
                        previous_fs.css({
                            'transform': 'scale(' + scale + ')',
                            'opacity': opacity
                        });
                    },
                    duration: 800,
                    complete: function () {
                        current_fs.hide();
                        animating = false;

                    },
                    //this comes from the custom easing plugin
                    easing: 'easeInOutBack'
                });
            });



        })(jQuery);

    }
    insertuserSubmit(e) {
        e.preventDefault();
        let user = {
            email: this.state.email,
            // password: "123456",
            profile: {
                userType: "admin",
                firstName: this.state.firstname,
                lastName: this.state.lastname,
                fatherName: this.state.fathername,
                motherName: this.state.mothername,
                gender: this.state.gender,
                birthDate: this.state.dateofbirth,
                officalEmailId: this.state.offcialemailid,
                phone: this.state.phone,
            },
            education: [{
                cousrseName: this.state.coursename,
                cousrseType: this.state.coursetype,
                instituteName: this.state.institutename,
                academicYear: this.state.academicyear,
                address: {
                    addressline1: this.state.addressline1,
                    addressline2: this.state.addressline2,
                    country: this.state.country,
                    state: this.state.states,
                    city: this.state.city,
                    zipcode: this.state.zipcode
                },
                certificate: this.state.certificate
            }],
            experiance: [{
                companyName: this.state.companyname,
                address: {
                    addressline1: this.state.addressline1,
                    addressline2: this.state.addressline2,
                    country: this.state.country,
                    state: this.state.states,
                    city: this.state.city,
                    zipcode: this.state.zipcode
                },
                workExpeience: this.state.workexpeience,
                startAt: this.state.startdate,
                endAt: this.state.enddate,
                technology: this.state.technology
            }],
            address: [{
                addressline1: this.state.addressline1,
                addressline2: this.state.addressline2,
                country: this.state.country,
                state: this.state.states,
                city: this.state.city,
                zipcode: this.state.zipcode
            }]
        }

        Meteor.call('insertuser', user, function (err, result) {
            if (!err) {
                console.log('Inserted Record Successfully...' + result);
            }
            else {
                console.log('Error' + err);

            }
        });


    }

    render() {
        return (
            <div className="wrapper wrapper-content animated fadeInRight" >
                <form id="form1" onSubmit={(e) => { this.insertuserSubmit(e) }} noValidate >
                    <div id="msform">
                        <ul id="progressbar" >
                            <li className="active">Personal Details</li>
                            <li>Education</li>
                            <li>Experiance</li>
                        </ul>

                        <fieldset>
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
                                        <div className="col-md-4">
                                            <label>First Name</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder=""
                                                id="first_name"
                                                name="firstname"
                                                onChange={this.myChangeHandler}

                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Last Name</label>
                                            <input type="text"
                                                className="form-control"
                                                name="lastname"
                                                id="last_name"
                                                onChange={this.myChangeHandler}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Father Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fathername"
                                                id="father_name"
                                                onChange={this.myChangeHandler}
                                                placeholder=""
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-4">
                                            <label>Mother Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="mothername"
                                                id="mother_name"
                                                onChange={this.myChangeHandler}
                                                placeholder=""
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label>Birth Date</label>
                                            <div className="input-group date">
                                                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value=""
                                                    name="dateofbirth"
                                                    onChange={this.myChangeHandler}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label>Email Id</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                id="email_id"
                                                onChange={this.myChangeHandler}
                                                placeholder="Enter Email" />
                                            {/* { errors.email.length > 0 &&
                                                <span style={{ color: "red" }}><b>{errors.email}</b></span>} */}
                                        </div>
                                    </div>
                                </div>



                                <div className="form-group row">
                                    <div className="col-md-12">


                                     

                                        <div className="col-md-4">
                                            <label className="inline">Offical EmailId </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder=""
                                                name="offcialemailid"
                                                onChange={this.myChangeHandler}

                                            />
                                            {/* {errors.offcialemailid.length > 0 &&
                                                <span style={{ color: "red" }}>{errors.offcialemailid}</span>} */}
                                        </div>

                                        <div className="col-md-4">
                                            <label>Phone</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder=""
                                                id="phone"
                                                name="phone"
                                                onChange={this.myChangeHandler}

                                            />
                                            {/* {errors.phone.length > 0 &&
                                                <span style={{ color: "red" }}>{errors.phone}</span>} */}
                                        </div>
                                        <div className="col-md-4">
                                            <label>Gender</label><br />
                                            <div className="radio-inline form-check abc-radio abc-radio-success">
                                                <input className="form-check-input"
                                                    type="radio"
                                                    name="gender"
                                                    id="female"
                                                    value="female"
                                                    onChange={this.myChangeHandler}
                                                />
                                                <label className="form-check-label" for="radio3">
                                                    Female
                                            </label>
                                            </div>
                                            <div className="radio-inline  form-check abc-radio abc-radio-success">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="gender"
                                                    id="male"
                                                    value="male"
                                                    onChange={this.myChangeHandler}
                                                />
                                                <label className="form-check-label" for="radio3">
                                                    Male
                                            </label>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="form-group row">
                                    <div className="col-md-12" >
                                       
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
                                        <div className="col-md-11">
                                            <label>Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Address line1"
                                                name="addressline1"
                                                id="add_line1"
                                                style={{ marginRight: "15px" }}
                                                onChange={this.myChangeHandler}

                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-11">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Address line2"
                                                name="addressline2"
                                                onChange={this.myChangeHandler}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-4 ml-0">
                                            <label>Country</label>
                                            <select
                                                className="form-control"
                                                name="country"
                                                onChange={this.myChangeHandler}
                                            >
                                                <option selected>select country</option>
                                                <option>India</option>
                                                <option>USA</option>
                                                <option>Canada</option>
                                            </select>

                                        </div>
                                        <div className="col-md-4 ml-0">
                                            <label>State</label>
                                            <select
                                                className="form-control"
                                                name="states"
                                                onChange={this.myChangeHandler}
                                            >
                                                <option selected>select state</option>
                                                <option>Gujarat</option>
                                                <option>Maharahra</option>
                                                <option>Ontario</option>
                                            </select>

                                        </div>
                                        <div className="col-md-4 ml-0">
                                            <label>City</label>
                                            <select
                                                className="form-control"
                                                name="city"
                                                onChange={this.myChangeHandler}
                                            >
                                                <option selected>select city</option>
                                                <option>Surat</option>
                                                <option>Bharush</option>
                                                <option>Toronto</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-4">
                                            <label>Zipcode</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder=""
                                                id="zipcode"
                                                name="zipcode"
                                                onChange={this.myChangeHandler}

                                            />

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <input type="button" name="next" className="next action-button" value="Next" />
                        </fieldset>
                        <fieldset>
                            <div className="container-fluid">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-4">
                                            <label>Course Name</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder=""
                                                name="coursename"
                                                onChange={this.myChangeHandler}

                                            />

                                        </div>
                                        <div className="col-md-4">
                                            <label>Institute Name</label>
                                            <input type="text"
                                                className="form-control"
                                                name="institutename"
                                                onChange={this.myChangeHandler}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Acadamic Year</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="academicyear"
                                                onChange={this.myChangeHandler}
                                                placeholder=""
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-6">
                                            <label>Course Type</label>
                                            <select
                                                className="form-control"
                                                name="coursetype"
                                                onChange={this.myChangeHandler}
                                            >
                                                <option selected>select country</option>
                                                <option>option 2</option>
                                                <option>option 3</option>
                                                <option>option 4</option>
                                            </select>

                                        </div>

                                        <div className="col-md-6">
                                            <label>Certificate</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                placeholder=""
                                                name="certificate"
                                                onChange={this.myChangeHandler}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input type="button" name="previous" className="previous action-button" value="Previous" />
                            <input type="button" name="next" className="next action-button" value="Next" />
                        </fieldset>
                        <fieldset>
                            <div className="container-fluid">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-4">
                                            <label>Company Name</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder=""
                                                name="companyname"
                                                onChange={this.myChangeHandler}

                                            />

                                        </div>
                                        <div className="col-md-4">
                                            <label>Work Experiance</label>
                                            <input type="text"
                                                className="form-control"
                                                name="workexperiance"
                                                onChange={this.myChangeHandler}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Technlogoy</label><br />
                                            <div className="bootstrap-tagsinput">
                                                <input type="text"
                                                    name="technology"
                                                    onChange={this.myChangeHandler}
                                                    size="1" />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <div className="col-md-6">
                                            <label>Start Date</label>
                                            <div className="input-group date">
                                                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value=""
                                                    name="startdate"
                                                    onChange={this.myChangeHandler}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label>End Date</label>
                                            <div className="input-group date">
                                                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value=""
                                                    name="enddate"
                                                    onChange={this.myChangeHandler}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input type="button" name="previous" className="previous action-button" value="Previous" />
                            <input type="submit" name="submit" className="submit action-button" value="Submit" />
                        </fieldset>
                    </div>
                </form>


            </div>

        )
    }

}
