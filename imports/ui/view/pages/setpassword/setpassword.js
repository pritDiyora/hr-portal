import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from '/node_modules/meteor/kadira:flow-router';

export default class SetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newpassword: "",
            confirmpassword: ""
        }
    }
    
    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }
    loginSubmit(e) {
        e.preventDefault();
        let newpassword = this.state.newpassword;
        let confirmpassword = this.state.confirmpassword;
        if (newpassword.length < 8) {
            alert("Password Must be at least 8 character")
        } else {
            if (newpassword == confirmpassword) {
                Meteor.call('resetpassword', this.userId, newpassword, function (err, result) {
                    if (!err) {
                        console.log("Congrats you change the password")
                    } else {
                        console.log("pup there is an error caused by " + err.reason)
                    }
                })
            } else {
                alert("Password doesn't match");
            }
        }

    }

    render() {
        return (

            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <h3>Welcome to HR system</h3>
                    <p>Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views.</p>
                    <p>Login in. To see it in action.</p>
                    <form className="m-t" role="form" onSubmit={(e) => { this.loginSubmit(e) }}>
                        <div className="form-group">
                            <input
                                type="password"
                                name="newpassword"
                                className="form-control"
                                placeholder="Enter New Password"
                                onChange={this.myChangeHandler}
                                required=""
                            />
                        </div>
                        <div className="form-group">
                            <input type="password"
                                name="confirmpassword"
                                onChange={this.myChangeHandler}
                                className="form-control" placeholder="Password" required="" />
                        </div>
                        <button type="submit" className="btn btn-primary block full-width m-b">Reset Password</button>

                    </form>
                    <p className="m-t"> <small>Inspinia we app framework base on Bootstrap 3 © 2014</small> </p>
                </div>
            </div>


        )
    }

}


