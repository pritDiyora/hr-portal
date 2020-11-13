import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import User from '../../../../api/user/users';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import Leave from '../../../../api/leave/leaveScheme';
import GeneralSetting from '../../../../api/generalsetting/generalsetting';
import bootbox from 'bootbox'
var Sugar = require('sugar');

class Salary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      totalsalary: "",
      salaryid: "",
      button: false,
      displayedSalary: [],
      sortbutton: "default",
      pageLength: 10,
      searchStr: "",
      sortKey: "createdAt",
      sortValue: 1,
      currentPage: 1,
      totalpage: 0,
    }
  }
  componentDidMount() {
    this.getSalaryData();
  }
  showhandle(event) {
    this.setState({
      currentPage: 1,
      pageLength: parseInt(event.target.value)
    }, () => {
      this.getSalaryData();
    })
  }
  handlePageChange(pageNumber) {
    const currentPage = pageNumber;
    const totalpage = pageNumber;
    this.setState({
      currentPage, totalpage
    }, () => {
      this.getSalaryData();
    });
  }
  search(e) {
    this.setState({
      currentPage: 1,
      searchStr: e.target.value
    }, () => {
      this.getSalaryData();
    })
  }
  getSalaryData() {
    const self = this;
    let pipeline = [
      {
        "$lookup": {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "name"
        }
      },
      { "$unwind": "$name" },

      {
        "$match": {
          "$or": [
            { "name.profile.firstName": { $regex: this.state.searchStr, $options: 'i' } },
            { "name.profile.lastName": { $regex: this.state.searchStr, $options: 'i' } },
            { totalSalary: { $regex: this.state.searchStr, $options: 'i' } }
          ]
        }
      },
      { "$sort": { [this.state.sortKey]: this.state.sortValue } },
      { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
      { "$limit": this.state.pageLength },
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
  ascDesc(e, keyName) {
    let { sortKey, sortValue } = this.state;
    if (sortKey == keyName && sortValue == 1) {
      this.setState({
        sortValue: -1,
        sortKey: keyName,
        currentPage: 1
      }, () => {
        this.getSalaryData();
      })
    } else {
      this.setState({
        sortValue: 1,
        sortKey: keyName,
        currentPage: 1
      }, () => {
        this.getSalaryData();
      })
    }
  }
  addsalary(e) {
    e.preventDefault();
    let { userid, totalsalary } = this.state, self = this;
    if (this.state.button == true) {
      Meteor.call('updatesalarydata', userid, totalsalary, this.state.salaryid, function (err, result) {
        if (!err) {
          toast.success("Salary updated successfully...", result);
          $("#add-panel").modal("hide");
          self.setState({
            userid: "",
            totalsalary: "",
            button: false
          })
          self.getSalaryData();
        } else {
          toast.error(err.message);
        }
      })
      this.setState({ userid: "", totalsalary: "", button: false, stateid: "" })
    } else {
      Meteor.call('addsalary', userid, totalsalary, function (err, result) {
        if (!err) {
          toast.success("Salary added successfully...", result);
          $("#add-panel").modal("hide");
          self.setState({
            userid: "",
            totalsalary: "",
            button: false
          })
          self.getSalaryData();
        } else {
          toast.error(err.message);

        }
      })
    }
  }
  modelclick(event) {
    $("#add-panel").modal("show");
  }
  openmodeldelete(e, id) {
    const self = this;
    self.setState({ salaryId: id })
    bootbox.confirm({
      message: "Are you sure you want to delete.. ?",
      className: 'rubberBand animated',
      buttons: {
        confirm: {
          label: 'Yes',
          className: 'btn-info'
        },
        cancel: {
          label: 'No',
          className: 'btn-danger'
        }
      },
      callback: function (result) {
        if (result) {
          Meteor.call('deletesalary', self.state.salaryId, function (err, res) {
            if (!err) {
              toast.success("Salary deleted successfully...", res)
              self.getSalaryData();
            } else {
              toast.error(err.message)
            }
          });
        }
      },
    });
  }

  updaterecord(e, id) {
    let salary = this.state.displayedSalary.find(salary => salary._id == id);
    this.setState({ userid: salary.userId, totalsalary: salary.totalSalary, button: true, salaryid: id })
    $("#add-panel").modal("show");
  }
  cancel(e) {
    this.setState({ userid: "", totalsalary: "", button: false, salaryid: "" })
    $("#add-panel").modal("hide");
  }

  sendSalarySlip(event, rUserId) {
    event.preventDefault();
    const self = this;
    let userFullname = Meteor.user() && Meteor.user().profile && Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName
    console.log('userFullname :: ', userFullname);
    let sendSalarySlipNotification = {
      title: userFullname,
      description: 'Show the Salary Slip..',
      sendId: Meteor.userId(),
      receiverId: [rUserId],
      type: 'salarySlip',
      createdAtDate: new Date(),
      createdBy: Meteor.userId(),
      modifiedBy: Meteor.userId()
    }
    Meteor.call('LeaveApprove.Notification', sendSalarySlipNotification, function (err, res) {
      if (!err) {
        toast.success('Notification send successfully...', res)
      }
    });
  }

  render() {
    let { sortKey, sortValue } = this.state;
    let { gsetting, leave } = this.props
    return (
      <div>
        <div className="wrapper wrapper-content animated fadeInRight" >
          <div className="ibox ">
            <div className="ibox-title">
              <h5>Salary Lists</h5>
              <IboxTools />
            </div>
            <div className="ibox-content">
              <div className="row text-center">
                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}><i className="fa fa-plus"></i>&nbsp;&nbsp;Add Salary</a>
                <div className="col-sm-12" style={{ marginBottom: "15px" }}>
                  <div className="col-sm-6" style={{ paddingLeft: "0px" }}>
                    <div className="dataTables_length" id="example_length">
                      <label className="dataTables_length text">Show <select name="example_length" value={this.state.pageLength}
                        className="form-control" onChange={this.showhandle.bind(this)}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>entries</label>
                    </div>
                  </div>
                  <div className="col-sm-6" style={{ paddingRight: "0px" }}>
                    <div className="page1" id="example_length">
                      <label className="dataTables_length1 text">Search :
                          <input type="text" name="example_length" onChange={this.search.bind(this)} className="form-control" style={{ width: "200px" }} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="container-fluid">
                  <table className="table table-striped table-bordered table-hover dataTables-example dataTable" id="dataTables-example">
                    <thead>
                      <tr>
                        <th onClick={(e) => this.ascDesc(e, "firstName")}>Employee Name  <i className={`fa fa-sort mr-10 ${sortKey === 'firstName' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th onClick={(e) => this.ascDesc(e, "totalSalary")}>Total Salary  <i className={`fa fa-sort mr-10 ${sortKey === 'totalSalary' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th>Total Leave</th>
                        <th>Work Day of Month</th>
                        <th>Working Salary</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.displayedSalary.map((salary, i) => {
                          let noofDay = 0, diffWorkDay = 0, workSalary = 0, noofDays = [], months = []
                          let fullName = salary.name.profile.firstName + " " + salary.name.profile.lastName
                          leave.map((le) => {
                            let month = moment().subtract(1, "month").format('MM');
                            const previousMonth = moment().subtract(1-3, 'month').startOf('month').format('MM');
                            console.log('previousMonth :: ' ,previousMonth);
                            let getmonths = Array.apply(0, Array(12)).map(function (_, i) { return parseInt(moment().month(i).format('MM')) })
                            // console.log('getmonths :: ', getmonths);
                            let monthleave = moment(le.startDate).format("MM")
                            months.push(parseInt(monthleave))
                            // console.log('months :: ', months);
                            let filterMonth = getmonths.filter((month) => !months.includes(month))
                            // console.log('filterMonth :: ', filterMonth);

                            if (month == moment(le.startDate).format("MM") && month == moment(le.endDate).format("MM") && le.isApprove == true && le.userId == salary.userId) {
                              let diffDay = moment(le.endDate, "YYYY/MM/DD").diff(moment(le.startDate, "YYYY/MM/DD"), "days")
                              let monthlyLeave = gsetting[0] && gsetting[0].monthlyLeave
                              let diffDays = ((diffDay + 1) - monthlyLeave)
                              let curryForwordLeave = gsetting[0] && gsetting[0].carryForwardLeave

                              noofDays.push(diffDays)
                              noofDay = Sugar.Array.sum(noofDays)
                            }
                            let workDay = gsetting[0] && gsetting[0].workDayOfMonth
                            diffWorkDay = workDay - noofDay
                            workSalary = Math.floor(salary.totalSalary - ((salary.totalSalary / workDay) * noofDay))
                          });

                          return (
                            <tr key={i}>
                              <td>{fullName}</td>
                              <td>{salary.totalSalary}</td>
                              <td>{noofDay}</td>
                              <td>{diffWorkDay}</td>
                              <td>{workSalary}</td>
                              <td>
                                <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.openmodeldelete(e, salary._id)}><i className="fa fa-trash-o"></i></a>
                                <a className="btn btn-xs btn-primary " onClick={(e) => this.updaterecord(e, salary._id)}><i className="fa fa-edit"></i></a>&nbsp;
                                <a className="btn btn-xs btn-success " href={`/salarySlip?id=${salary.name._id}`}><i className="fa fa-eye"></i></a>&nbsp;&nbsp;
                                <a className="btn btn-xs btn-info" onClick={(e) => this.sendSalarySlip(e, salary.userId, salary._id)}><i className="fa fa-send"></i></a>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  <div style={{ textAlign: "right" }}>
                    <Pagination
                      activePage={this.state.currentPage}
                      itemsCountPerPage={this.state.pageLength}
                      totalItemsCount={this.state.totalpage}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="add-panel" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Add Salary Data</h4>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label>Employee Name</label>
                      <select className="form-control"
                        onChange={(e) => this.setState({ userid: e.target.value })}
                        value={this.state.userid}>
                        <option defaultValue>Select Employee</option>
                        {this.props.users.map((user) => {
                          let fullName = user.profile.firstName + " " + user.profile.lastName
                          return (
                            <option value={user._id} key={user._id}>{fullName}</option>
                          )
                        })}
                      </select><br />
                      <label>Total Salary</label>
                      <input type="text"
                        className="form-control"
                        onChange={(e) => this.setState({ totalsalary: e.target.value })}
                        value={this.state.totalsalary}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" id="cancel-button" data-dismiss="modal" onClick={(e) => this.cancel(e)}>Cancel</button>
                {
                  this.state.button ?
                    <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addsalary(e) }}>Update Salary</button>
                    : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addsalary(e) }}>Add Salary</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withTracker(() => {
  Meteor.subscribe('ListleaveApply')
  Meteor.subscribe('user');
  Meteor.subscribe('generaleSetting')
  return {
    leave: Leave.find({}).fetch(),
    users: User.find({ 'profile.userType': { $in: ["admin", "employee"] } }).fetch(),
    gsetting: GeneralSetting.find({}).fetch()
  }
})(Salary);

