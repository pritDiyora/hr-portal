import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            // password: ""
        }
    }
    forgotPassword(e) {
        e.preventDefault();
        var email = this.state.email;
        Accounts.forgotPassword({ email: email }, function (err, res) {
            if (err) {
                if (err.message === 'User not found [403]') {
                    toast.error('This email does not exist.');
                } else {
                    toast.error('We are sorry but something went wrong.');
                }
            } else {
                toast.success('Email Sent. Check your mailbox.', res);
            }
        });
    }

    render() {
        return (
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <img src="img/logo-2.png" className="img-responsive" style={{ height: '70px', margin: '0 auto' }} />
                <div>
                    <h3>Please enter your email address below to reset your password</h3>
                </div>
                <div>
                    <form className="m-t" id="forgotPasswordForm" onSubmit={(e) => this.forgotPassword(e)}>
                        <fieldset>
                            <div className="col-md-12 form-group no-padding">
                                <input
                                    className="form-control"
                                    id="forgotPasswordEmail"
                                    type="text"
                                    name="email"
                                    placeholder="Email Address"
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                />
                            </div>
                            <div className="col-md-12  no-padding">
                                <input
                                    className="btn btn-primary block full-width m-b"
                                    type="submit"
                                    value="Send"
                                />
                            </div>
                            <div className="col-md-12 no-padding">
                                <p className="text-muted text-center"><small>Already have an account?</small></p>
                            </div>

                            <div className="col-md-12  no-padding">
                                <a className="submit btn btn-sm btn-white btn-block m-b" href="/">Login</a>
                            </div>
                        </fieldset>
                    </form>

                </div>
            </div>
        )
    }

}


