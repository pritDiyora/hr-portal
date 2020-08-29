import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            phoneNumber: ""
        }
    }
    componentWillMount() {

        $(document).ready(function () {
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        });

    }
    registerSubmit(e) {
        e.preventDefault();
        let { name, email, password, phoneNumber } = this.state;
        Meteor.call('createregister', name, email, password, phoneNumber, function (error, result) {

            if (error) {
                console.log(error);
            }
            else {
                console.log('Method 1 result is: ' + result);
                FlowRouter.go('/dashboard');
            }
        }
        );


    }


    render() {
        const mystyle = {
            position: "absolute",
            top: "0%",
            left: "0%",
            display: "block",
            width: "100%",
            height: "100%",
            margin: "0px",
            padding: "0px",
            background: "rgb(255, 255, 255)",
            border: "0px",
            opacity: 0
        };
        return (
            <div className="middle-box text-center loginscreen   animated fadeInDown">
                <div>
                    <div>
                        <h1 className="logo-name">IN+</h1>
                    </div>
                    <h3>Register to IN+</h3>
                    <p>Create account to see it in action.</p>
                    <form className="m-t" role="form" onSubmit={(e) => { this.registerSubmit(e) }}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                required=""
                                onChange={(name) => this.setState({ name })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                required=""
                                onChange={(email) => this.setState({ email })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                class="form-control"
                                placeholder="Password"
                                required=""
                                onChange={(password) => this.setState({ password })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                placeholder="Phone Number"
                                pattern="+[0-9]{2}-[0-9]{5}-[0-9]{5}"
                                onChange={(phoneNumber) => this.setState({ phoneNumber })}
                            />
                        </div>
                        {/* <div className="form-group">
                            <div className="checkbox i-checks"><label class="">
                                <div className="icheckbox_square-green" style="position: relative;">
                                    <input
                                        type="checkbox"
                                        style="position: absolute; opacity: 0;"
                                    />
                                    <ins
                                        className="iCheck-helper"
                                        style={mystyle}>
                                    </ins>
                                </div>
                                <i></i> Agree the terms and policy </label>
                            </div>
                        </div> */}
                        <button type="submit" className="btn btn-primary block full-width m-b">Register</button>
                        <p className="text-muted text-center"><small>Already have an account?</small></p>
                        <a className="btn btn-sm btn-white btn-block" href="/">Login</a>
                    </form>
                    <p className="m-t"> <small>Inspinia we app framework base on Bootstrap 3 © 2014</small> </p>
                </div>
            </div>

        )
    }
}


