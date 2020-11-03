import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {}
    }
    this.handleValidation = this.handleValidation.bind(this);
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  //validation
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields["fname"]) {
      formIsValid = false;
      errors["fname"] = "Cannot be empty";
    }

    if (typeof fields["fname"] !== "undefined") {
      if (!fields["fname"].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors["fname"] = "Only letters";
      }
    }
    if (!fields["lname"]) {
      formIsValid = false;
      errors["lname"] = "Cannot be empty";
    }

    if (typeof fields["lname"] !== "undefined") {
      if (!fields["lname"].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors["lname"] = "Only letters";
      }
    }
    //password
    if (fields["password"] !== fields["confirmPassword"]) {
      formIsValid = false;
      errors["password"] = "Cannot be different";

    }

    //Email
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Cannot be empty";
    }

    if (typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf('@');
      let lastDotPos = fields["email"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  registerSubmit(e) {
    e.preventDefault();
    if (this.handleValidation()) {
      let flag = true;
      let { fname, lname, email, password, confirmPassword, phoneNumber } = this.state.fields;
      var options = {
        username: email,
        email: email,
        password: password,
        profile: {
          userType: 'superadmin',
          firstName: fname,
          lastName: lname,
          phone: phoneNumber,
          clockStatus: false
        }
      }
      console.log('options :: ', options);
      if (flag) {
        Meteor.call('registerUser', options, function (err, res) {
          if (!err) {
            toast.success("Registration success!");
            FlowRouter.go('/')
          } else {
            toast.error("getting error!", err);
          }
        });
      }
    }
  }

  render() {
    return (
      <div style={{ backgroundImage: "url('img/login.png')", height: "800px" }}>
        <div className="container">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div class="ibox main-form-wrapper">
              <div className="ibox-content1">
                <div class="main-form-header">
                  <h3 class="header-title">Create an Account</h3>
                  <span class="header-subtitle">Already have an account? <a href="/">Sign In</a></span>
                </div>
                <form className="m-t" onSubmit={(e) => this.registerSubmit(e)}>
                  <fieldset>
                    <div>
                      <div className="col-md-12 form-group no-padding" style={{ marginTop: "10px" }}>
                        <div className="col-md-6">
                          <label>First Name</label>
                          <input
                            ref="fname"
                            type="text"
                            data-required
                            data-onblur
                            className="form-control"
                            required=""
                            onChange={this.handleChange.bind(this, "fname")}
                            value={this.state.fields["fname"]}
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Last Name</label>
                          <input
                            ref="lname"
                            type="text"
                            data-required
                            data-onblur
                            className="col"
                            className="form-control"
                            required=""
                            onChange={this.handleChange.bind(this, "lname")}
                            value={this.state.fields["lname"]}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 form-group" style={{ marginTop: "10px" }}>
                      <label>Email</label>
                      <input
                        type="email"
                        data-onblur
                        className="form-control"
                        data-email
                        required=""
                        onChange={this.handleChange.bind(this, "email")}
                        value={this.state.fields["email"]}
                      />
                    </div>
                    <div className="col-md-12 form-group" style={{ marginTop: "10px" }}>
                      <label>Mobile Number</label>
                      <input
                        type="tel"
                        data-onblur
                        className="form-control"
                        onChange={this.handleChange.bind(this, "tel")}
                        value={this.state.fields["tel"]}
                      />
                    </div>
                    <div className="col-md-12 form-group no-padding" style={{ marginTop: "10px" }}>
                      <div className="col-md-6">
                      <label>Password</label>
                        <input
                          type="password"
                          className="form-control"
                          data-onblur
                          data-alphanumeric
                          required=""
                          onChange={this.handleChange.bind(this, "password")}
                          value={this.state.fields["password"]}
                        />
                      </div>
                      <div className="col-md-6">
                      <label>Confirm Password</label>
                        <input
                          type="password"
                          data-onblur
                          className="form-control"
                          data-alphanumeric
                          required=""
                          onChange={this.handleChange.bind(this, "confirmPassword")}
                          value={this.state.fields["confirmPassword"]}
                        />
                      </div>

                    </div>
                    <div className="col-md-12" style={{ marginTop: "10px" }}>
                      <button type="submit" className="btn btn-primary block full-width m-b">Register</button>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="ibox-footer">
                <p className="text-center">© scaleteam. All rights reserved.</p>
                <p className="text-center"><a href="#" >Privacy Policy</a></p>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}