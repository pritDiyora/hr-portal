import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import SimpleReactValidator from 'simple-react-validator';
export default class LeaveType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typename: "",
            noofday: undefined,
            leaveTypeId: "",
            button: false,
            displayedLeaveType: [],
            //table (sorting,seraching,pagination)
            pageLength: 10,
            searchStr: "",
            sortKey: "createdAt",
            sortValue: 1,
            currentPage: 1,
            totalpage: 0
        }
        this.leaveTypeValidator = new SimpleReactValidator({ autoForceUpdate: this, className: "text-danger" });
    }
    //Dropdown pagination
    showhandle(event) {
        this.setState({
            currentPage: 1,
            pageLength: parseInt(event.target.value)
        }, () => {
            this.getCountryData();
        })
    }
    componentDidMount() {
        this.getCountryData();
    }
    handlePageChange(pageNumber) {
        const currentPage = pageNumber;
        const totalpage = pageNumber;
        this.setState({
            currentPage, totalpage
        }, () => {
            this.getCountryData();
        });
    }
    addLeaveType(e) {
        e.preventDefault();
        const self = this;
        let { typename, noofday ,leaveTypeId} = this.state;
        if (this.state.button == true) {
            Meteor.call('updateLeaveType', typename, noofday, leaveTypeId, function (err, result) {
                if (!err) {
                    toast.success("Record updates..." + result);
                    $("#add-panel").modal("hide");
                    self.setState({
                        typename: "",
                        noofday: "",
                        leaveTypeId: "",
                        button: false
                    })
                    // window.location.reload(false);
                } else {
                    toast.error("Error ::" + err);
                }
            })
        } else {
            Meteor.call('addleaveType', typename, noofday, function (err, result) {
                if (!err) {
                    toast.success("Record Inserted..." + result);
                    $("#add-panel").modal("hide");
                    // window.location.reload(false);
                } else {
                    toast.error("Error ::" + err);
                }
            })
        }

    }
    //Delete Model
    deletemodel(e, id) {
        e.preventDefault();
        $("#deletemodel").modal("show");
        this.setState({ countryid: id })
    }
    deletrecord(e) {
        e.preventDefault();
        Meteor.call('deleteLeaveType', this.state.leaveTypeId, function (err, res) {
            if (!err) {
                $("#deletemodel").modal("hide");
                toast.success("Record Deleted.." + res)
            } else {
                toast.error(err)
            }
        })
    }
    //Insert and Edit Model
    modelclick(event, id) {
        event.preventDefault()
        $("#add-panel").modal("show");
    }
    updaterecord(e, id) {
        this.state.displayedLeaveType.map((le, i) => {
            if (le._id == id) {
                this.setState({ typename: le.leaveTypeName, noofday: le.noOfDay, button: true, leaveTypeId: id })
            }
        })
        $("#add-panel").modal("show");
    }
    cancel(e) {
        this.setState({
            countryname: "",
            countrycode: "",
            countryid: "",
            button: false
        })
        $("#add-panel").modal("hide");
    }
    search(e) {
        this.setState({
            currentPage: 1,
            searchStr: e.target.value
        }, () => {
            this.getCountryData();
        })
    }
    getCountryData() {
        const self = this;
        let pipeline = [
            {
                "$match": {
                    "$or": [
                        { leaveTypeName: { $regex: this.state.searchStr, $options: 'i' } },
                        { noOfDay: { $regex: this.state.searchStr, $options: 'i' } }
                    ]
                }
            },
            { "$sort": { [this.state.sortKey]: this.state.sortValue } },
            { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
            { "$limit": this.state.pageLength },
        ];
        Meteor.call("searchLeaveType", pipeline, function (err, res) {
            if (!err) {
                Meteor.call("countLeaveTypeData", res, function (err1, res1) {
                    if (!err) {
                        self.setState({ totalpage: res1 });
                    }
                })
                self.setState({ displayedLeaveType: res });
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
                this.getCountryData();
            })
        } else {
            this.setState({
                sortValue: 1,
                sortKey: keyName,
                currentPage: 1
            }, () => {
                this.getCountryData();
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
                            <h5>Leave Type List</h5>
                            <IboxTools />
                        </div>
                        <div className="ibox-content">
                            <div className="row text-center">
                                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}>Add Leave Type</a>
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
                                                <th onClick={(e) => this.ascDesc(e, "leaveTypeName")}>Leave Type Name  <i className={`fa fa-sort mr-10 ${sortKey === 'leaveTypeName' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th onClick={(e) => this.ascDesc(e, "noOfDay")}>No Of Day<i className={`fa fa-sort mr-10 ${sortKey === 'noOfDay' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.displayedLeaveType.map((lev, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{lev.leaveTypeName}</td>
                                                        <td>{lev.noOfDay}</td>
                                                        <td> <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.deletemodel(e, lev._id)}> <i className="fa fa-trash-o"></i></a>
                                                            <a className="btn btn-xs btn-primary " onClick={(e) => this.updaterecord(e, lev._id)}><i className="fa fa-edit"></i></a>
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
                                <h4 className="modal-title">Add Country Data</h4>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <label>Leave Type Name</label>
                                                <input type="text" className="form-control" value={this.state.typename} onChange={(e) => this.setState({ typename: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label>No Of Day</label>
                                                <input type="text" className="form-control" value={this.state.noofday} onChange={(e) => this.setState({ noofday: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" id="cancel-button" onClick={(e) => this.cancel(e)}>Cancel</button>
                                {this.state.button ? <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addLeaveType(e) }}>Update LeaveType</button>
                                    : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addLeaveType(e) }}>Add LeaveType</button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal" tabIndex="-1" role="dialog" id="deletemodel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Model</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete.. ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={(e) => this.deletrecord(e)}>Delete record</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}