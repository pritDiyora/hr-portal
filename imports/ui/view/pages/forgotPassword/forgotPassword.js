import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base'


export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
        }
    }


    forgotPassword(e) {
        e.preventDefault();
        var email = this.state.email;
        console.log(email);

        Accounts.forgotPassword({ email: email }, function (err, res) {

            if (err) {
                if (err.message === 'User not found [403]') {
                    console.log('This email does not exist.');
                } else {
                    console.log('We are sorry but something went wrong.');
                }
            } else {
                
            //     Meteor.call('sendEmail',
            //     'akshitaapex@gmail.com',
            //     'from@server.com',
            //     'Test',
            //     'Hello world!'
            // );
                console.log('Email Sent. Check your mailbox.', res);
            }
           
        });
        
        // aa link che terminal ma che ae!
    }

    render() {
        return (

            <div className="middle-box text-center loginscreen animated fadeInDown">
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
                                <br />
                                <input
                                    className="btn btn-primary block full-width m-b"
                                    type="submit"
                                    value="Send"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>


        )
    }

}


