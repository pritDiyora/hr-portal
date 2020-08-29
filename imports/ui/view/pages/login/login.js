import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from '/node_modules/meteor/kadira:flow-router';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }
    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }
    loginSubmit(e) {
        e.preventDefault();
        let eid = this.state.email;
        let pwd = this.state.password;

        Meteor.loginWithPassword(eid, pwd, (err, res) => {
            if (!err) {
                let user = Meteor.user();
                console.log(user);

                FlowRouter.go('/dashboard');
            } else {
                alert("Error :" + err);
            }
        })
    }
    render() {
        return (

            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <div>
                        <h1 className="logo-name">IN+</h1>
                    </div>
                    <h3>Welcome to IN+</h3>
                    <p>Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views.</p>
                    <p>Login in. To see it in action.</p>
                    <form className="m-t" role="form" onSubmit={(e) => { this.loginSubmit(e) }}>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter Email Id"
                                onChange={this.myChangeHandler}
                                required=""
                            />
                        </div>
                        <div className="form-group">
                            <input type="password"
                                name="password"
                                onChange={this.myChangeHandler}
                                className="form-control" placeholder="Password" required="" />
                        </div>
                        <button type="submit" className="btn btn-primary block full-width m-b">Login</button>

                        <a href="#"><small>Forgot password?</small></a>
                        <p className="text-muted text-center"><small>Do not have an account?</small></p>
                        <a className="btn btn-sm btn-white btn-block" href="/register">Create an account</a>
                    </form>
                    <p className="m-t"> <small>Inspinia we app framework base on Bootstrap 3 © 2014</small> </p>
                </div>
            </div>


        )
    }

}


