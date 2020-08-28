import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opwd: '',
            npwd: '',
            cnpwd: ''
        }
    }

    changePasswordSubmit(e) {
        e.preventDefault();
        let { opwd, npwd, cnpwd } = this.state;
        Meteor.call('checkPassword', Meteor.userId(), opwd, function (err, result) {
            if (result && !result.error) {
                if(npwd.length >= 8){
                    if (npwd === cnpwd) {
                        Accounts.changePassword(opwd, npwd, function (err) {
                            if (err) {
                                toast.error(err.message)
                            } else {    
                                toast.success('Password changed successfully')
                                FlowRouter.go('/dashboard')
                            }
                        });
                    } else {
                        toast.error('Password and confirm password must be same.')
                    }
                }else{
                    toast.error('Password at least 8 character')
                }
                
            } else {
                toast.error('Old password not correct')
            }
        });
    }

    render() {
        return (
            <div className="passwordBox animated fadeInDown">
                <div className="row">
                    <div className="col-md-12">
                        <div className="ibox-content">
                            <h2 className="font-bold">Change Password </h2>
                            <div className="row">
                                <div className="col-lg-12">
                                    <form className="m-t" role="form" action="#" onSubmit={(e) => { this.changePasswordSubmit(e) }} >
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter old password"
                                                id="opwd"
                                                onChange={(e) => this.setState({ opwd: e.target.value })}
                                                required="" />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter new password"
                                                id="npwd"
                                                onChange={(e) => this.setState({ npwd: e.target.value })}
                                                required="" />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter confirm new password"
                                                id="cnpwd"
                                                onChange={(e) => this.setState({ cnpwd: e.target.value })}
                                                required="" />
                                        </div>
                                        <button type="submit" className="btn btn-primary block full-width m-b">Change Password</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}