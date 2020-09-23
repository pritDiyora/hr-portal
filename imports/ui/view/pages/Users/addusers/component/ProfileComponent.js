import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
class ProfileComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
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
                                name="firstName"
                                value={this.props.firstName || ''}
                                onChange={this.props.profileChangeHandler}
                            />
                            {this.props.Profilevalidator.message('Firstname', this.props.firstName, 'required|alpha')}
                        </div>
                        <div className="col-md-6">
                            <label>Last Name</label>
                            <input type="text"
                                className="form-control"
                                name="lastName"
                                id="last_name"
                                value={this.props.lastName || ''}
                                onChange={this.props.profileChangeHandler}
                            />
                            {this.props.Profilevalidator.message('Lastname', this.props.lastName, 'required|alpha')}
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
                                name="fatherName"
                                id="father_name"
                                value={this.props.fatherName || ''}
                                onChange={this.props.profileChangeHandler}
                            />
                            {this.props.Profilevalidator.message('Fathername', this.props.fatherName, 'required|alpha')}
                        </div>
                        <div className="col-md-6">
                            <label>Mother Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="motherName"
                                id="mother_name"
                                value={this.props.motherName || ''}
                                onChange={this.props.profileChangeHandler}
                            />
                            {this.props.Profilevalidator.message('Mothername', this.props.motherName, 'required|alpha')}
                        </div>


                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <label>Birth Date</label>
                            <DayPickerInput
                                name="birthDate"
                                value={this.props.birthDate || ''}
                                onDayChange={this.props.BirthDateChangeHandler}
                            />
                        </div>

                        <div className="col-md-6">
                            <label>Email Id</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                id="email_id"
                                value={this.props.email || ''}
                                onChange={this.props.EmailChangeHandler}
                                placeholder="Enter Email" />
                            {this.props.Profilevalidator.message('Email', this.props.email, 'required|email')}
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
                                value={this.props.officalEmailId || ''}
                                name="officalEmailId"
                                onChange={this.props.profileChangeHandler}
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
                                value={this.props.phone || ''}
                                onChange={this.props.profileChangeHandler}
                            />
                            {this.props.Profilevalidator.message('Phone', this.props.phone, 'required|phone')}
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <label>Joining Date</label>
                            <DayPickerInput
                                name="joiningDate"
                                value={this.props.joiningDate || ''}
                                onDayChange={this.props.JoinDateChangeHandler}
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
                                    checked={this.props.gender === 'female'}
                                    onChange={this.props.profileChangeHandler}
                                />
                                <label className="form-check-label" htmlFor="female">
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
                                    checked={this.props.gender === 'male'}
                                    onChange={this.props.profileChangeHandler}
                                />
                                <label className="form-check-label" htmlFor="male">
                                    Male
                              </label>
                            </div>
                            {this.props.Profilevalidator.message('Gender', this.props.gender, 'required|alpha')}
                        </div>

                        <div className="col-md-4">
                            <label>User Type</label><br />
                            <div className="radio-inline form-check abc-radio abc-radio-success">

                                <input className="form-check-input"
                                    type="radio"
                                    name="userType"
                                    id="superadmin"
                                    value="superadmin"
                                    checked={this.props.userType === 'superadmin'}
                                    onChange={this.props.profileChangeHandler}
                                />
                                <label className="form-check-label" htmlFor="superadmin">
                                    Super Admin
                                 </label>
                            </div>&nbsp;&nbsp;&nbsp;
                            <div className="radio-inline  form-check abc-radio abc-radio-success">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="userType"
                                    id="admin"
                                    value="admin"
                                    checked={this.props.userType === 'admin'}
                                    onChange={this.props.profileChangeHandler}
                                />
                                <label className="form-check-label" htmlFor="admin">
                                    Admin
                              </label>
                            </div>&nbsp;&nbsp;&nbsp;

                            <div className="radio-inline  form-check abc-radio abc-radio-success">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="userType"
                                    id="employee"
                                    value="employee"
                                    checked={this.props.userType === 'employee'}
                                    onChange={this.props.profileChangeHandler}
                                />
                                <label className="form-check-label" htmlFor="employee">
                                    Employee
                              </label>&nbsp;&nbsp;&nbsp;
                            </div>
                            {this.props.Profilevalidator.message('Usertypw', this.props.userType, 'required|alpha')}
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

ProfileComponent.propTypes = {

};

export default ProfileComponent;