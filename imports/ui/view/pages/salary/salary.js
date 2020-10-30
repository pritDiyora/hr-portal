import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import User from '../../../../api/user/users';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import Leave from '../../../../api/leave/leaveScheme';
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import GeneralSetting from '../../../../api/generalsetting/generalsetting';
import bootbox from 'bootbox'

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
      displayedUser: [],
    }
  }
  componentDidMount() {
    this.getSalaryData();
    this.getUser()
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
        toast.error(err);
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
          toast.success("Record Updated..." + result);
          $("#add-panel").modal("hide");
          self.setState({
            userid: "",
            totalsalary: "",
            button: false
          })
          self.getSalaryData();
        } else {
          toast.error("Error ::" + err);

        }
      })
      this.setState({ userid: "", totalsalary: "", button: false, stateid: "" })
    } else {
      Meteor.call('addsalary', userid, totalsalary, function (err, result) {
        if (!err) {
          toast.success("Record Inserted..." + result);
          $("#add-panel").modal("hide");
          self.setState({
            userid: "",
            totalsalary: "",
            button: false
          })
          self.getSalaryData();
        } else {
          toast.error("Error ::" + err);

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
              toast.success("Record Deleted.." + res)
              self.getSalaryData();
            } else {
              toast.error(err)
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

  getUser() {
    const self = this;
    let pipeline = [
      {
        "$lookup": {
          from: "country",
          localField: "address.0.country",
          foreignField: "_id",
          as: "countryname"
        }
      },
      { "$unwind": "$countryname" },
      {
        "$lookup": {
          from: "state",
          localField: "address.0.state",
          foreignField: "_id",
          as: "statename"
        }
      },
      { "$unwind": "$statename" },
      {
        "$lookup": {
          from: "city",
          localField: "address.0.city",
          foreignField: "_id",
          as: "cityname"
        }
      },
      { "$unwind": "$cityname" },
    ];
    Meteor.call("searchUser", pipeline, function (err, res) {
      if (!err) {
        self.setState({ displayedUser: res });
      } else {
        toast.error(err);
      }
    });
  }

  noOfDayLeave(start, end, isApprove) {
    let startDate, str, endDate, days;
    startDate = moment(start, "YYYY/MM/DD");
    endDate = moment(end, "YYYY/MM/DD");
    if (isApprove == true) {
      days = endDate.diff(startDate, 'days');
      startDate.add(days, 'days');
      if (startDate == endDate) {
        var startdate = new Date(start), enddate = new Date(end);
        let starthour = moment(startdate, "hh:mm"), endHour = moment(enddate, "hh:mm"), hour, minutes;
        hour = endHour.diff(starthour, 'hours');
        starthour.add(hour, 'days');
        str = hour;
      } else {
        str = days;
      }
    } else {
      str = 0;
    }
    return str;
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
                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}>Add Salary</a>
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
                      </select> entries</label>
                    </div>
                  </div>
                  <div className="col-sm-6" style={{ paddingRight: "0px" }}>
                    <div className="page1" id="example_length">
                      <label className="dataTables_length1 text">Search :
                                            <input type="text" name="example_length" onChange={this.search.bind(this)}
                          className="form-control" style={{ width: "200px" }} /></label>
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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.displayedSalary.map((salary, i) => {
                          let noofDay
                          let fullName = salary.name.profile.firstName + " " + salary.name.profile.lastName
                          leave.map((le, i) => {

                            noofDay = this.noOfDayLeave(le.startDate, le.endDate, le.isApprove)
                            if (salary.userId == le.userId) {
                              noofDay
                            } else {
                              noofDay = 0
                            }
                            // return noofDay
                          })
                          return (
                            <tr key={i}>
                              <td>{fullName}</td>
                              <td>{salary.totalSalary}</td>

                              <td>{noofDay}</td>
                              <td>{gsetting.map((e) => {
                                let totalday = e.workDayOfMonth
                                let diff = totalday - noofDay
                                return diff
                              })}</td>
                              <td>
                                <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.openmodeldelete(e, salary._id)}>
                                  <i className="fa fa-trash-o"></i></a>
                                <a className="btn btn-xs btn-primary " onClick={(e) => this.updaterecord(e, salary._id)}>
                                  <i className="fa fa-edit"></i></a>
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
                        value={this.state.userid}
                      >
                        <option defaultValue>Select Employee</option>
                        {this.state.displayedUser.map((user) => {
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
  Meteor.subscribe('CountryData');
  Meteor.subscribe('Statedata');
  Meteor.subscribe('Citydata');
  Meteor.subscribe('generaleSetting')
  return {
    leave: Leave.find({}).fetch(),
    country: Country.find({}).fetch(),
    states: State.find({}).fetch(),
    city: Cities.find({}).fetch(),
    gsetting: GeneralSetting.find({}).fetch()
  }
})(Salary);

