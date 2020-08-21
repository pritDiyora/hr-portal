import React, { Component, PropTypes } from 'react';
import Meteor from 'meteor/meteor';


export default class register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name : "",
            email: "",
            password: "",
            phoneNumber: ""
        }
    }
    registerSubmit(e){ 
        e.preventDefault();
        let {name, email, password} = this.state;
        console.log('{name , mail, password , phoneNumber :: ',name, email, password, phoneNumber);
        Accounts.createUser({
            name : name ,
            email: email,
            password: password,
            phoneNumber: phoneNumber
        });
 
    }


    render() {
        return (
            <div class="middle-box text-center loginscreen   animated fadeInDown">
                <div>
                    <div>
                        <h1 class="logo-name">IN+</h1>
                    </div>
                    <h3>Register to IN+</h3>
                    <p>Create account to see it in action.</p>
                    <form class="m-t" role="form" onSubmit={(e) => { this.registerSubmit(e) }}>
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Name"
                                required=""
                                onChange={(name) => this.setState({ name })}
                            />
                        </div>
                        <div class="form-group">
                            <input
                                type="email"
                                class="form-control"
                                placeholder="Email"
                                required=""
                                onChange={(email) => this.setState({ email })}
                            />
                        </div>
                        <div class="form-group">
                            <input
                                type="password"
                                class="form-control"
                                placeholder="Password"
                                required=""
                                onChange={(password) => this.setState({ password })}
                            />
                        </div>
                        <div class="form-group">
                            <input 
                                type="tel" 
                                name="phone" 
                                class="form-control"
                                placeholder="Phone Number"
                                pattern="+[0-9]{2}-[0-9]{5}-[0-9]{5}"
                                onChange={(phoneNumber) => this.setState({ phoneNumber })}
                            />
                        </div>
                        <div class="form-group">
                            <div class="checkbox i-checks"><label class="">
                                <div class="icheckbox_square-green" style="position: relative;">
                                    <input
                                        type="checkbox"
                                        style="position: absolute; opacity: 0;"
                                    />
                                    <ins
                                        class="iCheck-helper"
                                        style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;">
                                    </ins>
                                </div>
                                <i></i> Agree the terms and policy </label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary block full-width m-b">Register</button>
                        <p class="text-muted text-center"><small>Already have an account?</small></p>
                        <a class="btn btn-sm btn-white btn-block" href="login.js">Login</a>
                    </form>
                    <p class="m-t"> <small>Inspinia we app framework base on Bootstrap 3 © 2014</small> </p>
                </div>
            </div>

        )
    }
}


