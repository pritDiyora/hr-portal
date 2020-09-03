import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {}
        }
        this.handleValidation = this.handleValidation.bind(this);
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    //validation
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["fname"]) {
            formIsValid = false;
            errors["fname"] = "Cannot be empty";
        }

        if (typeof fields["fname"] !== "undefined") {
            if (!fields["fname"].match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["fname"] = "Only letters";
            }
        }
        if (!fields["lname"]) {
            formIsValid = false;
            errors["lname"] = "Cannot be empty";
        }

        if (typeof fields["lname"] !== "undefined") {
            if (!fields["lname"].match(/^[a-zA-Z]+$/)) {
                formIsValid = false;
                errors["lname"] = "Only letters";
            }
        }
        //password
        if (fields["password"] !== fields["confirmPassword"]) {
            formIsValid = false;
            errors["password"] = "Cannot be different";

        }

        //Email
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    registerSubmit(e) {
        e.preventDefault();

        if (this.handleValidation()) {

            console.log("form submitted");
        } else {
            console.log("errors!!");
        }
        let flag = true;



        let { fname, lname, email, password, confirmPassword, phoneNumber } = this.state.fields;
        var options = {
            username: email,
            email: email,
            password: password,
            profile: {
                userType: 'superadmin',
                firstName: fname,
                lastName: lname,
                phone: phoneNumber
            }
        }
        console.log('options :: ', options);
        if (flag) {
            Meteor.call('registerUser', options, function (err, res) {
                if (!err) {
                    console.log("Registration success!");
                    FlowRouter.go('/')
                } else {
                    console.log("getting error!", err);
                }
            });
        }
    }

    render() {
        return (
            <div className="middle-box text-center animated fadeInDown">
                <div>
                <img src="img/logo-2.png" className="img-responsive" style={{height:'70px', margin:'0 auto'}} />
                   
                    <form className="m-t" onSubmit={(e) => this.registerSubmit(e)}>
                        <fieldset>
                            <div>
                                <div className="col-md-12 form-group no-padding">
                                    <div className="col-md-6 ">
                                        <input
                                            ref="fname"
                                            type="text"
                                            data-required
                                            data-onblur
                                            className="form-control"
                                            placeholder="first Name"
                                            required=""
                                            onChange={this.handleChange.bind(this, "fname")}
                                            value={this.state.fields["fname"]}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            ref="lname"
                                            type="text"
                                            data-required
                                            data-onblur
                                            className="col"
                                            className="form-control"
                                            placeholder="Last Name"
                                            required=""
                                            onChange={this.handleChange.bind(this, "lname")}
                                            value={this.state.fields["lname"]}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 form-group">
                                <input
                                    type="email"
                                    data-onblur
                                    placeholder="Email"
                                    className="form-control"
                                    data-email
                                    required=""
                                    onChange={this.handleChange.bind(this, "email")}
                                    value={this.state.fields["email"]}
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <input
                                    type="tel"
                                    data-onblur
                                    className="form-control"
                                    placeholder="Phone Number"
                                    onChange={this.handleChange.bind(this, "tel")}
                                    value={this.state.fields["tel"]}
                                />
                            </div>
                            <div className="col-md-12 form-group no-padding">
                                <div className="col-md-6">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="form-control"
                                        data-onblur
                                        data-alphanumeric
                                        required=""
                                        onChange={this.handleChange.bind(this, "password")}
                                        value={this.state.fields["password"]}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        data-onblur
                                        className="form-control"
                                        data-alphanumeric
                                        required=""
                                        onChange={this.handleChange.bind(this, "confirmPassword")}
                                        value={this.state.fields["confirmPassword"]}
                                    />
                                </div>

                            </div>
                            <div className="col-md-12">
                                <button type="submit" className="btn btn-primary block full-width m-b">Register</button>
                            </div>
                            <p className="text-muted text-center"><small>Already have an account?</small></p>
                            <div className="col-md-12">
                                <a className="submit btn btn-sm btn-white btn-block m-b" href="/">Login</a>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}