import React, { Component, PropTypes } from 'react';
import Meteor from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base'

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
            
                <div className="middle-box text-center loginscreen animated fadeInDown"  onSubmit={(e) => this.LoginWithPassword(e)}>
                    <div>
                        {/* <div>
                            <h1 className="logo-name">IN+</h1>
                        </div>
                        <h3>Welcome to ST+</h3> */}
                        <form className="m-t" role="form" onSubmit={(e) => { this.loginSubmit(e) }}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Username"
                                    onChange={(email) => this.setState({ email })}
                                    required=""
                                />
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    onChange={(password) => this.setState({ password })}
                                    className="form-control" placeholder="Password" required="" />
                            </div>
                            <button type="submit" className="btn btn-primary block full-width m-b">Login</button>

                            <a href="#"><small>Forgot password?</small></a>
                            <p className="text-muted text-center"><small>Do not have an account?</small></p>
                            <a className="btn btn-sm btn-white btn-block" href="/register">Create an account</a>
                        </form>
                    </div>
                </div>
            

        )
    }

}


