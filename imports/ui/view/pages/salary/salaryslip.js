import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Leave from '../../../../api/leave/leaveScheme';
import GeneralSetting from '../../../../api/generalsetting/generalsetting';
import Avatar from 'react-avatar';

class Salaryslip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedSalary: []
    }
  }
  componentDidMount() {
    this.getSalaryData();
  }

  getSalaryData() {
    const self = this;
    let pipeline = [
      {
        "$match": { "userId": FlowRouter.current().queryParams.id || Meteor.userId() }
      },
      {
        "$lookup": {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "name"
        }
      },
      { "$unwind": "$name" },

    ];
    Meteor.call("searchSalary", pipeline, function (err, res) {
      if (!err) {
        Meteor.call("countSalarydata", res, function (err1, res1) {
          if (!err) {
            self.setState({ totalpage: res1 });
          }
        })
        self.setState({ displayedSalary: res });
      } else {
        toast.error(err.message);
      }
    });
  }
  render() {
    let { displayedSalary } = this.state
    let { gsetting, leave } = this.props
    return (
      <div className="wrapper wrapper-content animated fadeInRight" >
        <div className="ibox ">
          <div className="ibox-content">
            <div className="row text-center">
              <center>
                <h3 className="text-uppercase"><u>Payslip for the month of {moment().format("MMM YYYY")}</u></h3>
              </center>
              <div className="col-lg-12">
                <div className="col-md-6">
                  <img src="img/logo-2.png" className="img-responsive" style={{ height: '40px' }} />
                  <ul className="list-unstyled">
                    <li>Scaleteam Technologies Pvt. Ltd</li>
                    <li>301-302, Amora Arcada, </li>
                    <li>near Mauni International School, </li>
                    <li>Uttran, Surat, Gujarat 394105</li>
                  </ul>
                </div>
                <div className="col-md-3 rightside">

                  <h3 className="text-uppercase"><b>Payslip</b></h3>
                  <ul className="list-unstyled">
                    <li>Salary Month: {moment().format("MMMM, YYYY")}</li>
                  </ul>

                </div>
              </div>
              <div>&nbsp;</div>
              <div className="col-lg-12">
                <div className="col-md-6"></div>
                <div className="col-md-3 rightside">
                  {displayedSalary.map((salary, i) => {
                    let fullname = salary.name.profile.firstName + ' ' + salary.name.profile.lastName
                    return (
                      <ul className="list-unstyled" key={i}>
                        <li>
                          <span>
                            <Avatar className="img-circle" size="80" color="#ffcccc" fgColor="#990000" name={fullname} maxInitials={2} style={{ marginBottom: "5px"}} />
                          </span>
                        </li>
                        <li><strong>{fullname}</strong></li>
                        <li>Designation: {salary.name.profile.designation}</li>
                        <li>Email Id: {salary.name.emails[0].address}</li>
                        <li>Contact No: {salary.name.profile.phone}</li>
                      </ul>
                    )
                  })}
                </div>
              </div>
              <div>&nbsp;</div>
              <div className="col-md-12">
                <center>
                  <h3><b>Payment Information</b></h3>
                </center>
              </div>
              {displayedSalary.map((salary, i) => {
                let noofDay = 0
                let noofleave = leave && leave.find(le => le.userId == salary.userId);
                let month = moment().format("MM") - 1
                if (month == moment(noofleave && noofleave.startDate).format("MM") && month == moment(noofleave && noofleave.endDate).format("MM") && noofleave.isApprove == true) {
                  let diffDay = moment(noofleave && noofleave.endDate, "YYYY/MM/DD").diff(moment(noofleave && noofleave.startDate, "YYYY/MM/DD"), "days")
                  noofDay = diffDay + 1
                }
                let workDay = gsetting[0] && gsetting[0].workDayOfMonth
                let diffWorkDay = workDay - noofDay
                let workSalary = Math.floor(salary.totalSalary - ((salary.totalSalary / workDay) * noofDay))
                return (
                  <div className="col-lg-12">
                    <div className="col-sm-12">
                      <table className="table table-striped table-bordered table-hover dataTables-example dataTable" id="dataTables-example">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Amount (<i className="fa fa-rupee"></i>)</th>
                          </tr>
                        </thead>
                        <tbody key={i}>
                          <tr>
                            <td>Basic Salary</td>
                            <td>{salary.totalSalary}</td>
                          </tr>
                          <tr>
                            <td>Total Leave</td>
                            <td>{noofDay}</td>
                          </tr>
                          <tr>
                            <td>Working Days</td>
                            <td>{diffWorkDay}</td>
                          </tr>
                          <tr>
                            <td>Total Salary</td>
                            <td><strong>{workSalary}</strong></td>
                          </tr>
                        </tbody>

                      </table>
                      <p>&nbsp;</p>
                      <h3><strong>Net Salary: <i className="fa fa-rupee"> <strong>{workSalary}</strong></i></strong></h3>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withTracker(() => {
  Meteor.subscribe('ListleaveApply')
  Meteor.subscribe('generaleSetting')
  return {
    leave: Leave.find({}).fetch(),
    gsetting: GeneralSetting.find({}).fetch()
  }
})(Salaryslip);