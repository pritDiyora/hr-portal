import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newpassword: "",
            confirmpassword: ""
        }
    }



    resetPassword(e) {
        e.preventDefault();

        let { newpassword, confirmpassword } = this.state;
        if (newpassword.length >= 8) {
            if (newpassword === confirmpassword) {
                Accounts.resetPassword(FlowRouter.current().params.token, newpassword, function (err) {
                    if (err) {
                        toast.error(err.message)
                    } else {
                        toast.success('Password Reset successfully');
                        FlowRouter.go('/');
                    }
                })
            } else {
                toast.error('Password and confirm password must be same.');
            }
        } else {
            toast.error('Password at least 8 character');
        }
    }

    render() {
        return (
            <div className=" middle-box text-center loginscreen animated fadeInDown">
                <img src="/img/logo-2.png" className="img-responsive" style={{ height: '70px', margin: '0 auto' }} />
                <form className="m-t" onSubmit={(e) => this.resetPassword(e)}>
                    <div className="form-group col-md-12 no-padding">
                        <input
                            className="form-control"
                            name="newpassword"
                            placeholder="New Password"
                            type="password"
                            onChange={(e) => this.setState({ newpassword: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-12 no-padding">
                        <input
                            className="form-control"
                            name="confirmpassword"
                            placeholder="Confirm"
                            type="password"
                            onChange={(e) => this.setState({ confirmpassword: e.target.value })}
                        />
                    </div>
                    <div className="form-group com-md-12">
                        <input
                            className="btn btn-primary block full-width m-b"
                            type="submit"
                            value="Reset"
                        />
                    </div>
                </form>
            </div>
        )
    }
}


