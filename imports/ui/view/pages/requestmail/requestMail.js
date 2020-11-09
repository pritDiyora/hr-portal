import React, { Component } from 'react'
import { toast } from 'react-toastify';
import { Accounts } from 'meteor/accounts-base'
import {Meteor} from 'meteor/meteor';
export default class RequestMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: "",
      from: "",
      subject: "",
      text: ""
    }
  }

  requestMail(e) {
    e.preventDefault();
    let {to, from, subject, text} =this.state
    let sendEmail ={
      to: to,
      from: from,
      subject: subject,
      text: text
    }
    Meteor.call('sendEmail', sendEmail, function(err, res){
      if(!err){
        toast.success("Email send successfully...");
      }else{
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
                  <div className="form-group row"><label className="col-sm-2 col-form-label">From:</label>
                    <div className="col-sm-10"><input type="text" className="form-control" name="from" onChange={(e) => this.setState({ from: e.target.value })} /></div>
                  </div><br />
                  <div className="form-group row"><label className="col-sm-2 col-form-label">Subject:</label>
                    <div className="col-sm-10"><input type="text" className="form-control" name="subject" onChange={(e) => this.setState({ subject: e.target.value })} /></div>
                  </div><br />
                  <div className="note-editing-area">
                    <textarea className="note-codable textarea-mailbox" role="textbox" aria-multiline="true" onChange={(e) => this.setState({ text: e.target.value })}></textarea>
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