
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base'


export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
        }
    }
    // if(Accounts._resetPasswordToken) {
    //     Session.set('resetPassword', Accounts._resetPasswordToken);
    // }

    resetPassword(e) {
        e.preventDefault();
        // var email = this.state.email;
        // Session.set('resetPassword', Accounts._resetPasswordToken);
        console.log("msdhoni");
        const password ="wLJpdux5bvS5rNn7JObXORyP5LHtSKum00dRuiatlUB";

        Accounts.resetPassword(password, "radhediyora@gmail.com", function(err) {

            if (err) {
              console.log('We are sorry but something went wrong.', err);
            } else {
              console.log('Your password has been changed. Welcome back!');
              Session.set('resetPassword', null);
            }
        })
    }

    render() {
        return (

            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <form className="m-t form-group" onSubmit={(e) => this.resetPassword(e)}>
                        <input
                            className="form-control"
                            id="resetPasswordPassword" 
                            name="password" 
                            placeholder="New Password" 
                            type="password" 
                        />
                        
                        <input 
                            className="form-control"
                            id="resetPasswordPasswordConfirm" 
                            name="password-confirm" 
                            placeholder="Confirm" 
                            type="password" 
                        />
                        <br />
                        <input 
                            className="btn btn-primary block full-width m-b" 
                            type="submit" 
                            value="Reset" 
                        />
                    </form>

                </div>
            </div>


        )
    }

}


