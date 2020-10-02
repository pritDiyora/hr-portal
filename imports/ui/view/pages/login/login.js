import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
        Meteor.loginWithPassword(email, password, (err, res) => {
            if (!err) {
                let user = Meteor.user();
                localStorage.setItem('user',JSON.stringify(user) );
                FlowRouter.go('/dashboard');
                // $('#btnModal').click();
            }else
            {
                alert('Incorrect password and email');
            }
        })
    }

    render() {
        return (
            <div >

                <div className="middle-box text-center loginscreen animated fadeInDown" >
                    <img src="img/logo-2.png" className="img-responsive" style={{height:'70px', margin:'0 auto'}} />

                    <form className="m-t" role="form" onSubmit={(e) => { this.loginSubmit(e) }}>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"    
                                placeholder="Username"
                                onChange={(e) => this.setState({ email: e.target.value })}
                                required=""
                            />
                        </div>
                        <div className="form-group">
                            <input type="password"
                                onChange={(e) => this.setState({ password: e.target.value })}
                                className="form-control" placeholder="Password" required="" />
                        </div>
                        <button type="submit" className="btn btn-primary block full-width m-b">Login</button>

                        <a href="/forgotPassword"><small>Forgot password?</small></a>
                        <p className="text-muted text-center"><small>Do not have an account?</small></p>
                        <a className="btn btn-sm btn-white btn-block" href="/register">Create an account</a>
                    </form>
                </div>
            </div>


        )
    }

}


