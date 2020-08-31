
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
                Accounts.resetPassword(Session.get('resetpassword'), newpassword, function (err) {
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

            <div className="middle-box text-center loginscreen animated fadeInDown">

                <form className="m-t form-group" onSubmit={(e) => this.resetPassword(e)}>
                    <input
                        className="form-control"
                        name="newpassword"
                        placeholder="New Password"
                        type="password"
                        onChange={(e) => this.setState({ newpassword: e.target.value })}
                    />

                    <input
                        className="form-control"
                        name="confirmpassword"
                        placeholder="Confirm"
                        type="password"
                        onChange={(e) => this.setState({ confirmpassword: e.target.value })}
                    />
                    <br />
                    <input
                        className="btn btn-primary block full-width m-b"
                        type="submit"
                        value="Reset"
                    />
                </form>


            </div>


        )
    }

}


