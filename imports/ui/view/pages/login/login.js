import React, { Component, PropTypes } from 'react';
import Meteor from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    loginSubmit(e) {
        e.preventDefault();
        let { email, password } = this.state;
        Meteor.LoginWithPassword(email, password, (err, res) => {
            if (!err) {
                let user = Meteor.user();
                FlowRouter.go('/dashboard');
            }
        })
    }

    render() {
        return (
            
                <div class="middle-box text-center loginscreen animated fadeInDown">
                    <div>
                        <div>
                            <h1 class="logo-name">IN+</h1>
                        </div>
                        <h3>Welcome to IN+</h3>
                        <p>Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views.</p>
                        <p>Login in. To see it in action.</p>
                        <form class="m-t" role="form" onSubmit={(e) => { this.loginSubmit(e) }}>
                            <div class="form-group">
                                <input
                                    type="email"
                                    class="form-control"
                                    placeholder="Username"
                                    onChange={(email) => this.setState({ email })}
                                    required=""
                                />
                            </div>
                            <div class="form-group">
                                <input type="password"
                                    onChange={(password) => this.setState({ password })}
                                    class="form-control" placeholder="Password" required="" />
                            </div>
                            <button type="submit" class="btn btn-primary block full-width m-b">Login</button>

                            <a href="#"><small>Forgot password?</small></a>
                            <p class="text-muted text-center"><small>Do not have an account?</small></p>
                            <a class="btn btn-sm btn-white btn-block" href="/register">Create an account</a>
                        </form>
                        <p class="m-t"> <small>Inspinia we app framework base on Bootstrap 3 © 2014</small> </p>
                    </div>
                </div>
            

        )
    }

}


