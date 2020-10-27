import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import SimpleReactValidator from 'simple-react-validator';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import bootbox from 'bootbox'

export default class Holiday extends Component {

  constructor(props) {
    super(props);
    this.state = {
      holidayname: "",
      holidaydate: "",
      holidayid: "",
      button: false,
      displayedHoliday: [],
      //table (sorting,seraching,pagination)
      pageLength: 10,
      searchStr: "",
      sortKey: "createdAt",
      sortValue: 1,
      currentPage: 1,
      totalpage: 0
    }
    this.holidayValidator = new SimpleReactValidator({ autoForceUpdate: this, className: "text-danger" });
  }
  //Dropdown pagination
  showhandle(event) {
    this.setState({
      currentPage: 1,
      pageLength: parseInt(event.target.value)
    }, () => {
      this.getHolidayData();
    })
  }
  componentDidMount() {
    this.getHolidayData();
  }
  handlePageChange(pageNumber) {
    const currentPage = pageNumber;
    const totalpage = pageNumber;
    this.setState({
      currentPage, totalpage
    }, () => {
      this.getHolidayData();
    });
  }
  addholiday(e) {
    e.preventDefault();
    const self = this;
    let { holidayname, holidaydate } = this.state;

    if (self.holidayValidator.allValid()) {
      if (this.state.button == true) {
        Meteor.call('updateholiday', holidayname, holidaydate, this.state.holidayid, function (err, result) {
          if (!err) {
            toast.success("Record updates..." + result);
            $("#add-panel").modal("hide");
            self.setState({
              holidayname: "",
              holidaydate: "",
              holidayid: "",
              button: false
            })
            self.getHolidayData();
          } else {
            toast.error("Error ::" + err);

          }
        })
      } else {
        Meteor.call('addholiday', holidayname, holidaydate, function (err, result) {
          if (!err) {
            toast.success("Record Inserted..." + result);
            $("#add-panel").modal("hide");
            self.getHolidayData();
          } else {
            toast.error("Error ::" + err);
          }
        })
      }
    } else {
      self.holidayValidator.showMessages();
    }


  }
  //Delete Model
  deletemodel(e, id) {
    this.setState({ leaveTypeId: id })
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
          const self = this;
          console.log('self :: ', self);
          Meteor.call('deleteLeaveType', this.state.leaveTypeId, function (err, res) {
            if (!err) {
              toast.success("Record Deleted.." + res)
              self.getLeaveTypeData();
            } else {
              toast.error(err)
            }
          });
        }
      },
    });
  }

  //Insert and Edit Model
  modelclick(event, id) {
    event.preventDefault()
    $("#add-panel").modal("show");
  }
  updaterecord(e, id) {
    let holiday = this.state.displayedHoliday.find(holiday => holiday._id == id);
    this.setState({ holidayname: holiday.holidayname, holidaydate: holiday.holidaydate, button: true, holidayid: id })
    $("#add-panel").modal("show");
  }
  cancel(e) {
    this.setState({
      holidayname: "",
      holidaydate: "",
      holidayid: "",
      button: false
    })
    $("#add-panel").modal("hide");
  }
  search(e) {
    this.setState({
      currentPage: 1,
      searchStr: e.target.value
    }, () => {
      this.getHolidayData();
    })
  }
  getHolidayData() {
    const self = this;
    let pipeline = [
      {
        "$match": {
          "$or": [
            { holidayname: { $regex: this.state.searchStr, $options: 'i' } },
            { holidaydate: { $regex: this.state.searchStr, $options: 'i' } }
          ]
        }
      },
      { "$sort": { [this.state.sortKey]: this.state.sortValue } },
      { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
      { "$limit": this.state.pageLength },
    ];
    Meteor.call("searchholiday", pipeline, function (err, res) {
      if (!err) {
        Meteor.call("countHolidaydata", res, function (err1, res1) {
          if (!err) {
            self.setState({ totalpage: res1 });
          }
        })
        self.setState({
          displayedHoliday: res
        })
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
        this.getHolidayData();
      })
    } else {
      this.setState({
        sortValue: 1,
        sortKey: keyName,
        currentPage: 1
      }, () => {
        this.getHolidayData();
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
              <h5>Holiday List</h5>
              <IboxTools />
            </div>
            <div className="ibox-content">
              <div className="row text-center">
                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}>Add holiday</a>
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
                                            <input type="text" name="example_length" onChange={this.search.bind(this)} className="form-control" style={{ width: "200px" }} /></label>
                    </div>
                  </div>
                </div>
                <div className="container-fluid">
                  <table className="table table-striped table-bordered table-hover dataTables-example dataTable" id="dataTables-example">
                    <thead>
                      <tr>
                        <th onClick={(e) => this.ascDesc(e, "holidayname")}>Holiday Name  <i className={`fa fa-sort mr-10 ${sortKey === 'holidayname' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th onClick={(e) => this.ascDesc(e, "holidaydate")}>Holiday Date <i className={`fa fa-sort mr-10 ${sortKey === 'holidaydate' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                        <th>Holiday Day</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.displayedHoliday.map((holiday, i) => {
                        return (
                          <tr key={i}>
                            <td>{holiday.holidayname}</td>
                            <td>{moment(holiday.holidaydate).format("DD/MM/YYYY")}</td>
                            <td>{moment(holiday.holidaydate).format("dddd")}</td>
                            <td> <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.deletemodel(e, holiday._id)}> <i className="fa fa-trash-o"></i></a>
                              <a className="btn btn-xs btn-primary " onClick={(e) => this.updaterecord(e, holiday._id)}><i className="fa fa-edit"></i></a>
                            </td>
                          </tr>)
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
                      onChange={this.handlePageChange.bind(this)} />
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
                <h4 className="modal-title">Add Holiday Data</h4>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label>Holiday Name</label>
                      <input type="text" className="form-control" value={this.state.holidayname}
                        onChange={(e) => this.setState({ holidayname: e.target.value })}
                      /><br />
                      {this.holidayValidator.message('Holiday Name', this.state.holidayname, 'required')}
                    </div>

                    <div className="col-md-6">
                      <label>Holiday Date</label>
                      <DatePickerInput
                        className='my-custom-datepicker-component'
                        name="holidaydate"
                        value={this.state.holidaydate}
                        onChange={(e) => this.setState({ holidaydate: e })}
                      />

                      {this.holidayValidator.message('Holiday Date', this.state.holidaydate, 'required')}

                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" id="cancel-button" onClick={(e) => this.cancel(e)}>Cancel</button>
                {this.state.button ? <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addholiday(e) }}>Update Holiday</button>
                  : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addholiday(e) }}>Add Holiday</button>}
              </div>
            </div>
          </div>
        </div>


      </div >
    )
  }
}


