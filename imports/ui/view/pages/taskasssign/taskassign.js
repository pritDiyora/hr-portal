import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import User from '../../../../api/user/users';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import bootbox from 'bootbox';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import TaskAssign from '../../../../api/taskassign/taskSchema';
class Taskassign extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      status: "",
      taskdate: "",
      description: "",
      button: false,
      displayedTask: [],
      sortbutton: "default",
      taskid: "",
      //table (sorting,seraching,pagination)
      pageLength: 10,
      searchStr: "",
      sortKey: "createdAt",
      sortValue: 1,
      currentPage: 1,
      totalpage: 0

    }
  }
  componentDidMount() {
    this.getTaskAssignData();
  }
  showhandle(event) {
    this.setState({
      currentPage: 1,
      pageLength: parseInt(event.target.value)
    }, () => {
      this.getTaskAssignData();
    })
  }
  handlePageChange(pageNumber) {
    const currentPage = pageNumber;
    const totalpage = pageNumber;
    this.setState({
      currentPage, totalpage
    }, () => {
      this.getTaskAssignData();
    });
  }
  search(e) {
    this.setState({
      currentPage: 1,
      searchStr: e.target.value
    }, () => {
      this.getTaskAssignData();
    })
  }
  getTaskAssignData() {
    const self = this;
    let pipeline = [
      {
        "$lookup": {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "username"
        }
      },
      { "$unwind": "$username" },
      {
        "$match": {
          "$or": [
            { "username.profile.firstName": { $regex: self.state.searchStr, $options: 'i' } },
            { "taskDate": { $regex: self.state.searchStr, $options: 'i' } },
            { "status": { $regex: self.state.searchStr, $options: 'i' } },
            { "description": { $regex: self.state.searchStr, $options: 'i' } }
          ]
        }
      },
      { "$sort": { [self.state.sortKey]: self.state.sortValue } },
      { "$skip": (self.state.currentPage - 1) * self.state.pageLength },
      { "$limit": self.state.pageLength },
    ];
    Meteor.call("searchTask", pipeline, function (err, res) {
      if (!err) {
        Meteor.call("countTaskdata", res, function (err1, res1) {
          if (!err) {
            self.setState({ totalpage: res1 });
          }
        })
        self.setState({ displayedTask: res });
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
        this.getTaskAssignData();
      })
    } else {
      this.setState({
        sortValue: 1,
        sortKey: keyName,
        currentPage: 1
      }, () => {
        this.getTaskAssignData();
      })
    }
  }
  addTask(e) {
    e.preventDefault();
    let { userid, status, taskdate, description } = this.state, self = this;
    let task = {
      userId: userid,
      status: status,
      taskDate: taskdate,
      description: description
    };
    if (this.state.button == true) {
      Meteor.call('updateTaskdata', task, this.state.taskid, function (err, result) {
        if (!err) {
          toast.success("Task updated successfullt...", result);
          $("#add-panel").modal("hide");
          self.setState({ userid: "", status: "", taskdate: "", description: '', button: false, stateid: "" })
          self.getTaskAssignData();
        } else {
          toast.error(err.message);
        }
      })
      self.setState({ userid: "", status: "", taskdate: "", description: '', button: false, stateid: "" })
    } else {
      Meteor.call('addTaskOfUser', task, function (err, result) {
        if (!err) {
          toast.success("Task added successfully...", result);
          $("#add-panel").modal("hide");
          self.setState({ userid: "", status: "", taskdate: "", description: '' })
          self.getTaskAssignData();
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
    self.setState({ taskid: id })
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
          Meteor.call('deletetask', self.state.taskid, function (err, res) {
            if (!err) {
              toast.success("State deleted successfully...", res)
              self.getTaskAssignData();
            } else {
              toast.error(err.message)
            }
          });
        }
      },
    });
  }

  updaterecord(e, id) {
    let task = this.state.displayedTask.find(task => task._id == id);
    this.setState({ userid: task.userId, status: task.status, taskdate: task.taskDate, description: task.description, button: true, taskid: id })
    $("#add-panel").modal("show");
  }
  cancel(e) {
    this.setState({ countryid: "", statename: "", button: false, stateid: "" })
    $("#add-panel").modal("hide");
  }
  render() {
    let { sortKey, sortValue } = this.state;
    return (
      <div>
        <div className="wrapper wrapper-content animated fadeInRight" >
          <div className="ibox ">
            <div className="ibox-title">
              <h5>Task Lists</h5>
              <IboxTools />
            </div>
            <div className="ibox-content">
              <div className="row text-center">
                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}><i className="fa fa-plus"></i>&nbsp;&nbsp;Add Task</a>
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
                        <th onClick={(e) => this.ascDesc(e, "userId")}>User Name  <i className={`fa fa-sort mr-10 ${sortKey === 'userId' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th onClick={(e) => this.ascDesc(e, "status")}>Status  <i className={`fa fa-sort mr-10 ${sortKey === 'status' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th onClick={(e) => this.ascDesc(e, "taskDate")}>Date <i className={`fa fa-sort mr-10 ${sortKey === 'taskDate' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th onClick={(e) => this.ascDesc(e, "description")}>Description  <i className={`fa fa-sort mr-10 ${sortKey === 'description' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.displayedTask.map((task, i) => {
                          return (
                            <tr key={i}>
                              <td>{task.username.profile.firstName}</td>
                              <td>{task.status}</td>
                              <td>{moment(task.taskDate).format("DD/MM/YYYY")}</td>
                              <td>{task.description}</td>
                              <td>
                                <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.openmodeldelete(e, task._id)}>
                                  <i className="fa fa-trash-o"></i></a>
                                <a className="btn btn-xs btn-primary " onClick={(e) => this.updaterecord(e, task._id)}>
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
                <h4 className="modal-title">Add Task</h4>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="form-group row">
                    <div className="form-group">
                      <label>User Name</label>
                      <select className="form-control"
                        onChange={(e) => this.setState({ userid: e.target.value })}
                        value={this.state.userid}>
                        <option defaultValue>Select Country</option>
                        {this.props.users.map((user) => (
                          <option value={user._id} key={user._id}>{user.profile.firstName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <input type="text"
                        className="form-control"
                        onChange={(e) => this.setState({ status: e.target.value })}
                        value={this.state.status}
                      />
                    </div>
                    <div className="form-group">
                      <label>Task Date</label>
                      <DatePickerInput
                        className='my-custom-datepicker-component'
                        name="taskdate"
                        //  minDate={new Date()}
                        value={this.state.taskdate}
                        onChange={(e) => this.setState({ taskdate: e })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description <span className="text-danger">*</span></label>
                      <textarea rows="4"
                        className="reason"
                        name="description"
                        value={this.state.description}
                        onChange={(e) => this.setState({ description: e.target.value })}></textarea>
                    </div>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" id="cancel-button" data-dismiss="modal" onClick={(e) => this.cancel(e)}>Cancel</button>
                {
                  this.state.button ?
                    <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addTask(e) }}>Update State</button>
                    : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addTask(e) }}>Add State</button>
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
  Meteor.subscribe('user');
  Meteor.subscribe('getTaskInfo');
  return {
    users: User.find({}).fetch(),
    tasks: TaskAssign.find({}).fetch()
  }
})(Taskassign);

