import React, { Component } from 'react'
import { toast } from 'react-toastify';
import { Meteor } from 'meteor/meteor';
import User from '../../../../api/user/users';
export default class RequestMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: "",
      subject: "",
      text: ""
    }
  }
  requestMail(e) {
    e.preventDefault();
    let { to, subject, text } = this.state
    let superAdminId = User.findOne({ 'profile.userType': 'superadmin' })._id;
    let AdminId = User.findOne({ 'profile.userType': 'admin' })._id;
    Meteor.call('sendEmail', to, subject, text, function (err, res) {
      if (!err) {
        toast.success("Email send successfully...");
        let leaveApproveNotification = {
          title: 'Email',
          description: 'Check your email...',
          sendId: Meteor.userId(),
          receiverId: [superAdminId, AdminId],
          type: 'dashboard',
          createdAtDate: new Date(),
          createdBy: Meteor.userId(),
          modifiedBy: Meteor.userId()
        }
        Meteor.call('LeaveApprove.Notification', leaveApproveNotification, function (err, res) {
          if (!err) {
            console.log('notification send', res);
          }
        });

      } else {
        toast.error("Email not send ...")
      }
    });

  }
  render() {
    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="ibox">

          <div className="col-lg-12">
            <div className="mail-box-header">
              <div className="col-md-6 mailbox">
                <a href="mailbox.html" className="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to draft folder"><i className="fa fa-pencil"></i> Draft</a>
                <a href="mailbox.html" className="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" title="Discard email"><i className="fa fa-times"></i> Discard</a>
              </div>
              <h2>Compse mail</h2>
            </div>
            <div className="mail-box">
              <div className="mail-body">
                <form method="get" onSubmit={(e) => this.requestMail(e)}>
                  <div className="form-group row"><label className="col-sm-2 col-form-label">To:</label>
                    <div className="col-sm-10"><input type="text" className="form-control" name="to" onChange={(e) => this.setState({ to: e.target.value })} /></div>
                  </div><br />
                  <div className="form-group row"><label className="col-sm-2 col-form-label">Subject:</label>
                    <div className="col-sm-10"><input type="text" className="form-control" name="subject" onChange={(e) => this.setState({ subject: e.target.value })} /></div>
                  </div><br />
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <textarea type="text" className="textarea-mailbox" role="textbox" aria-multiline="true" onChange={(e) => this.setState({ text: e.target.value })}></textarea>
                    </div>
                  </div><br />
                  <center>
                    <input
                      className="btn btn-primary block "
                      type="submit"
                      value="Send"
                    />
                  </center>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}