import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import User from '../../../../api/user/users';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import bootbox from 'bootbox';
import 'rc-datepicker/lib/style.css';
import TaskAssign from '../../../../api/taskassign/taskSchema';
import KanbanBoard from './kanboardComponet/KanbanBoard';
class Taskassign extends Component {

  constructor(props) {
    super(props, ...arguments);
    this.state = {
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
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ displayedTask: nextProps.tasks })
  }
  addTask(e) {
    e.preventDefault();
    let { description } = this.state, self = this;
    let task = {
      userId: FlowRouter._current.queryParams.id,
      taskDateTime: new Date(),
      taskDate: moment().format("YYYY/MM/DD"),
      description: description
    };
    if (this.state.button == true) {
      Meteor.call('updateTaskdata', task, this.state.taskid, function (err, result) {
        if (!err) {
          toast.success("Task updated successfully...", result);
          $("#add-panel").modal("hide");
          self.setState({ userid: "", status: "", taskdate: "", description: '', button: false, stateid: "" })
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
        } else {
          toast.error(err.message);
        }
      })
    }
  }
  modelclick(event) {
    $("#add-panel").modal("show");
  }
  deleteTask(e, id) {
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
              toast.success("Task deleted successfully...", res)
            } else {
              toast.error(err.message)
            }
          });
        }
      },
    });
  }
  updateTask(e, id) {
    let task = this.state.displayedTask.find(task => task._id == id);
    this.setState({ description: task.description, button: true, taskid: id })
    $("#add-panel").modal("show");
  }
  cancel(e) {
    this.setState({ countryid: "", statename: "", button: false, stateid: "" })
    $("#add-panel").modal("hide");
  }
  render() {
    return (
      <div>
        <div className="wrapper wrapper-content animated fadeInRight" >
          {Meteor.user() && Meteor.user().profile.userType == 'superadmin' ? <p></p> : <a data-toggle="modal" className="btn btn-primary addmodel" style={{ marginLeft: "0px" }} onClick={(e) => this.modelclick(e)}><i className="fa fa-plus"></i>&nbsp;&nbsp;Add Task</a>}

          <KanbanBoard
            tasks={this.state.displayedTask}
            updateTask={this.updateTask}
            deleteTask={this.deleteTask}
          />
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
                      <label>Description <span className="text-danger">*</span></label>
                      <textarea rows="4"
                        className="reason"
                        name="description"
                        placeholder="Add Task"
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
                    <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addTask(e) }}>Update Task</button>
                    : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addTask(e) }}>Add Task</button>
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
    tasks: TaskAssign.find({ userId: FlowRouter._current.queryParams.id }).fetch()
  }
})(Taskassign);

