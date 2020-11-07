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
class UserTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedEmployeeTask: [],
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
    this.getEmployeeTaskData();
  }
  showhandle(event) {
    this.setState({
      currentPage: 1,
      pageLength: parseInt(event.target.value)
    }, () => {
      this.getEmployeeTaskData();
    })
  }
  handlePageChange(pageNumber) {
    const currentPage = pageNumber;
    const totalpage = pageNumber;
    this.setState({
      currentPage, totalpage
    }, () => {
      this.getEmployeeTaskData();
    });
  }
  search(e) {
    this.setState({
      currentPage: 1,
      searchStr: e.target.value
    }, () => {
      this.getEmployeeTaskData();
    })
  }
  getEmployeeTaskData() {
    const self = this;
    let pipeline = [
    
      {
        "$match": {
          "profile.userType": { $in: ["admin", "employee"] },
          "$or": [
            { "profile.firstName": { $regex: this.state.searchStr, $options: 'i' } },
            { "profile.lastName": { $regex: this.state.searchStr, $options: 'i' } },
          ]
        }
      },
      { "$sort": { [this.state.sortKey]: this.state.sortValue } },
      { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
      { "$limit": this.state.pageLength },
    ];
    Meteor.call("searchUser", pipeline, function (err, res) {
      if (!err) {
        Meteor.call("countUserTaskdata", function (err1, res1) {
          if (!err) {
            self.setState({ totalpage: res1 });
          }
        })
        self.setState({ displayedEmployeeTask: res });
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
        this.getEmployeeTaskData();
      })
    } else {
      this.setState({
        sortValue: 1,
        sortKey: keyName,
        currentPage: 1
      }, () => {
        this.getEmployeeTaskData();
      })
    }
  }

  render() {
    let { sortKey, sortValue } = this.state;
    return (
      <div>
        <div className="wrapper wrapper-content animated fadeInRight" >
          <div className="ibox ">
            <div className="ibox-title">
              <h5>Employee Task Lists</h5>
              <IboxTools />
            </div>
            <div className="ibox-content">
              <div className="row text-center">
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
                     
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.displayedEmployeeTask.map((salary, i) => {
                          let fullName = salary.profile.firstName + " " + salary.profile.lastName
                          return (
                            <tr key={i}>
                              <td>{fullName}</td>
                              <td>
                                <a className="btn btn-xs btn-success " href={`/task?id=${salary._id}`}>
                                  <i className="fa fa-eye"></i></a>
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
      </div>
    );
  }
}

UserTaskList.propTypes = {

};

export default UserTaskList;