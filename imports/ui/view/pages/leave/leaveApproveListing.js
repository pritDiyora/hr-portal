import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import { FlowRouter } from 'meteor/kadira:flow-router';
export default class LeaveApproveList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            button: false,
            displayedLeave: [],
            //table (sorting,seraching,pagination)
            pageLength: 10,
            searchStr: "",
            sortKey: "createdAt",
            sortValue: 1,
            currentPage: 1,
            totalpage: 0
        }
    }
    //Dropdown pagination
    showhandle(event) {
        this.setState({
            currentPage: 1,
            pageLength: parseInt(event.target.value)
        }, () => {
            this.getLeaveData();
        })
    }
    componentDidMount() {
        this.getLeaveData();
    }
    handlePageChange(pageNumber) {
        const currentPage = pageNumber;
        const totalpage = pageNumber;
        this.setState({
            currentPage, totalpage
        }, () => {
            this.getLeaveData();
        });
    }
    addcountry(e) {
        e.preventDefault();
        FlowRouter.go('/leave');
    }
    //Delete Model
    deletemodel(e, id) {
        e.preventDefault();
        $("#deletemodel").modal("show");
        this.setState({ countryid: id })
    }
    deletrecord(e) {
        e.preventDefault();
        const self = this;
        Meteor.call('deletecountry', this.state.countryid, function (err, res) {
            if (!err) {
                $("#deletemodel").modal("hide");
                toast.success("Record Deleted.." + res)
                self.getLeaveData();
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
            this.getLeaveData();
        })
    }
    getLeaveData() {
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
                "$lookup": {
                    from: "leavetype",
                    localField: "leaveType",
                    foreignField: "_id",
                    as: "leavetype"
                }
            },
            { "$unwind": "$leavetype" },
            {
                "$match": {
                    "$or": [
                        { "username.profile.firstName": { $regex: this.state.searchStr, $options: 'i' } },
                        { "username.profile.lastName": { $regex: this.state.searchStr, $options: 'i' } },
                        { "leavetype.leaveTypeName": { $regex: this.state.searchStr, $options: 'i' } },
                        { "startDate": { $regex: this.state.searchStr, $options: 'i' } },
                        { 'endDate': { $regex: this.state.searchStr, $options: 'i' } },
                        { "reason": { $regex: this.state.searchStr, $options: 'i' } },
                    ]
                }
            },
            { "$sort": { [this.state.sortKey]: this.state.sortValue } },
            { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
            { "$limit": this.state.pageLength },
        ];
        Meteor.call("searchLeave", pipeline, function (err, res) {
            if (!err) {
                Meteor.call("countLeaveData", function (err1, res1) {
                    if (!err) {
                        self.setState({ totalpage: res1 });
                    }
                })
                self.setState({ displayedLeave: res });
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
                this.getLeaveData();
            })
        } else {
            this.setState({
                sortValue: 1,
                sortKey: keyName,
                currentPage: 1
            }, () => {
                this.getLeaveData();
            })
        }
    }
    noOfDayLeave(start, end) {
        var startDate = start || undefined, str, endDate, days;
        startDate = moment(start, "YYYY/MM/DD");
        endDate = moment(end, "YYYY/MM/DD");
        days = endDate.diff(startDate, 'days');
        startDate.add(days, 'days');
        if (moment(start).format('YYYY/MM/DD') == moment(end).format('YYYY/MM/DD')) {
            var startdate = new Date(start), enddate = new Date(end);
            let starthour = moment(startdate, "hh:mm"), endHour = moment(enddate, "hh:mm"), hour, minutes;
            hour = endHour.diff(starthour, 'hours');
            starthour.add(hour, 'days');
            str = hour + 'hours';
        } else {
            str = days + 'days';
        }
        return str;
    }
    ApprovedLeave(event, id, leavename, rId) {
        event.preventDefault();
        const self = this;
        let approveByName = Meteor.user() && Meteor.user().profile && Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName;
        Meteor.call('updateLeaveApprove', id, approveByName, function (err, res) {
            if (!err) {
                $('.hover_bkgr_fricc').show();
                let leaveApproveNotification = {
                    title: leavename,
                    description: 'Leave Approved..',
                    sendId: Meteor.userId(),
                    receiverId: rId,
                    type: 'leaveApproved',
                    createdAtDate: new Date()
                }
                Meteor.call('LeaveApprove.Notification', leaveApproveNotification, function (err, res) {
                    if (!err) {
                        console.log('notification send', res);
                    }
                });
                self.getLeaveData();
            }
        });
    }
    cancel(e) {
        $('.hover_bkgr_fricc').hide();
    }
    declineLeave(e, id) {
        e.preventDefault();
        const self = this;
        Meteor.call('updateLeaveApprove', id, function (err, res) {
            if (!err) {
                $('.hover_bkgr_fricc').show();
                self.getLeaveData();
            }
        });
    }
    render() {
        let { sortKey, sortValue, displayedLeave } = this.state;
        return (
            <div>
                <div className="wrapper wrapper-content animated fadeInRight" >
                    <div className="ibox ">
                        <div className="ibox-title">
                            <h5>Country List</h5>
                            <IboxTools />
                        </div>
                        <div className="ibox-content">
                            <div className="row text-center">
                                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}>Add country</a>
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
                                                <th onClick={(e) => this.ascDesc(e, "userId")}>User Name  <i className={`fa fa-sort mr-10 ${sortKey === 'userId' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th onClick={(e) => this.ascDesc(e, "leaveType")}>Leave Name  <i className={`fa fa-sort mr-10 ${sortKey === 'leaveType' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th onClick={(e) => this.ascDesc(e, "startDate")}>Start Date  <i className={`fa fa-sort mr-10 ${sortKey === 'startDate' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th onClick={(e) => this.ascDesc(e, "endDate")}>End Date  <i className={`fa fa-sort mr-10 ${sortKey === 'endDate' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th onClick={(e) => this.ascDesc(e, "reason")}>Reason of Leave <i className={`fa fa-sort mr-10 ${sortKey === 'reason' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th>No Of Day/Hours</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedLeave.map((le, i) => {
                                                
                                                let noofDay = this.noOfDayLeave(le.startDate, le.endDate)
                                                return (
                                                    <tr key={i}>
                                                        <td>{le.username.profile.firstName + ' ' + le.username.profile.lastName}</td>
                                                        <td>{le.leavetype.leaveTypeName}</td>
                                                        <td>{moment(new Date(le.startDate)).format('YYYY-MM-DD hh:mm')}</td>
                                                        <td>{moment(new Date(le.endDate)).format('YYYY-MM-DD hh:mm')}</td>
                                                        <td>{le.reason}</td>
                                                        <td>{noofDay}</td>
                                                        <td> <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.declineLeave(e, le._id)}> <i className="fa fa-times-rectangle-o"> Declined</i></a>
                                                            {le.isApprove ? <a className="btn btn-xs btn-primary " disabled><i className="fa fa-check-square-o"> Approved</i></a>
                                                                : <a className="btn btn-xs btn-success " onClick={(e) => this.ApprovedLeave(e, le._id, le.leavetype.leaveTypeName, le.username._id)}><i className="fa fa-check-square-o"> Approve</i></a>
                                                            }

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

                <div className="hover_bkgr_fricc">
                    <span className="helper"></span>
                    <div>
                        <div className="popupCloseButton" onClick={(e) => this.cancel(e)}>&times;</div>
                        <button className="btn btn-info btn-circle btn-lg" type="button"><i className="fa fa-check"></i>
                        </button>
                        <h2><b>Approved Successfully...</b></h2>
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

