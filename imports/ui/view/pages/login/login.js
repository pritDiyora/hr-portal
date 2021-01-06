import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Images from '../../../../api/fileUploading/cfsCollection';
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
        localStorage.setItem('user', JSON.stringify(user));
        if (user.profile.userType == 'employee') {
          FlowRouter.go('/profile');
        }else{
          FlowRouter.go('/dashboard');
        }
        console.log(Images.find({}).fetch());

        // $('#btnModal').click();
      } else {
        alert('Incorrect password and email');
      }
    })
  }

  render() {
    return (
      <div style={{ backgroundImage: "url('img/login.png')", height: "800px" }}>
        <div className="container">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div className="ibox main-form-wrapper">
              <div className="ibox-content1">
                <div className="main-form-header">
                  <h3 className="header-title">Sign In</h3>
                  <span className="header-subtitle">Don't have an account? <a href="/register">Sign Up</a></span>
                </div>
                <div className="contanier">
                  <form className="m-t" role="form" onSubmit={(e) => { this.loginSubmit(e) }}>
                    <div className="col-md-12 form-group" style={{ marginTop: "10px" }}>
                      <label>Username</label>
                      <input
                        type="email"
                        className="form-control"
                        onChange={(e) => this.setState({ email: e.target.value })}
                        required=""
                      />
                    </div>
                    <div className="col-md-12 form-group" style={{ marginTop: "10px" }}>
                      <label>Password</label>
                      <input type="password"
                        onChange={(e) => this.setState({ password: e.target.value })}
                        className="form-control" required="" />
                    </div>
                    <div className="col-md-12" style={{ marginTop: "20px" }}> <button type="submit" className="btn btn-primary block full-width m-b">Login</button></div>
                    <div className="col-md-12" style={{ textAlign: "right" }}><a href="/forgotPassword"><b>Forgot password?</b></a> </div>
                  </form>
                </div>
              </div>
              <div className="ibox-footer1" >
                <p className="text-center" style={{ marginTop: "8px" }}>© scaleteam. All rights reserved.</p>
                <p className="text-center"><a href="#" >Privacy Policy</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}


