import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../../layout/iboxTools';
import $ from 'jquery';
import { withTracker } from 'meteor/react-meteor-data';
import User from '../../../../../api/user/users';
import Country from '../../../../../api/country/country';
import State from '../../../../../api/states/states';
import Cities from '../../../../../api/cites/cites';
import Pagination from "react-js-pagination";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ListUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: "",
            displayedUser: [],
            sortbutton: "default",
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
        this.getUserData();
    }
    showhandle(event) {
        this.setState({
            currentPage: 1,
            pageLength: parseInt(event.target.value)
        }, () => {
            this.getUserData();
        })
    }
    handlePageChange(pageNumber) {
        const currentPage = pageNumber;
        const totalpage = pageNumber;
        this.setState({
            currentPage, totalpage
        }, () => {
            this.getUserData();
        });
    }
    search(e) {
        this.setState({
            currentPage: 1,
            searchStr: e.target.value
        }, () => {
            this.getUserData();
        })
    }
    getUserData() {
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
            {
                "$match": {
                    "$or": [
                        { "countryname.countryname": { $regex: this.state.searchStr, $options: 'i' } },
                        { "statename.stateName": { $regex: this.state.searchStr, $options: 'i' } },
                        { "cityname.cityName": { $regex: this.state.searchStr, $options: 'i' } },
                        { "profile.joiningDate": { $regex: this.state.searchStr, $options: 'i' } },
                        { 'emails.0.address': { $regex: this.state.searchStr, $options: 'i' } },
                        { "profile.phone": { $regex: this.state.searchStr, $options: 'i' } },
                        { "profile.birthDate": { $regex: this.state.searchStr, $options: 'i' } },
                        { "profile.gender": { $regex: this.state.searchStr, $options: 'i' } },
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
                Meteor.call("countUserdata", res, function (err1, res1) {
                    if (!err) {
                        self.setState({ totalpage: res1 });
                    }
                })
                self.setState({ displayedUser: res });
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
                this.getUserData();
            })
        } else {
            this.setState({
                sortValue: 1,
                sortKey: keyName,
                currentPage: 1
            }, () => {
                this.getUserData();
            })
        }
    }
    openmodeldelete(e, id) {
        e.preventDefault();
        $("#deletemodel").modal("show");
        this.setState({ userid: id })
    }
    deletrecord(e) {
        e.preventDefault();
        const self = this;
        Meteor.call('deleteuser', this.state.userid, function (err, res) {
            if (!err) {
                $("#deletemodel").modal("hide");
                toast.success("Record Deleted.." + res)
                self.getUserData();
            } else {
                toast.error(err)
            }
        })
    }
    datedifferent(date1, date2) {
        var str;
        var joinindate = date1 || undefined;
        joinindate = moment(date1, "DD/MM/YYYY");
        const cuurentdate = moment(date2, "DD/MM/YYYY");

        let years = cuurentdate.diff(joinindate, 'year');
        joinindate.add(years, 'years');

        let months = cuurentdate.diff(joinindate, 'months');
        joinindate.add(months, 'months');

        let days = cuurentdate.diff(joinindate, 'days');
        joinindate.add(days, 'days');
        if (years == 0) {
            if (months == 0) {
                if (days == 0) {
                    str = "No Date found";
                } else {
                    str = days + ' days ';
                }
            } else {
                str = months + ' months ' + days + ' days ';
            }
        } else if (months == 0) {
            if (days == 0) {
                str = years + ' years ';
            } else {
                str = years + ' years ' + days + ' days ';
            }
        } else if (isNaN(years) && isNaN(months) && isNaN(days)) {
            str = "---";
        }
        else {
            str = years + ' years ' + months + ' months ' + days + ' days ';
        }
        return str;
    }
    experiance(exp) {
        let exps = exp || [] || undefined;
        let count = 0;
        for (let i = 0; i < exps.length; i++) {
            count = count + parseFloat(exps[i].workExpeience);
        }
        if (count == 0) {
            count = "    ";
        } else if (isNaN(count)) {
            count = "   ";
        }
        return count;
    }
    render() {
        let { sortKey, sortValue } = this.state;
        return (
            <div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title">
                                    <h5>User Lists</h5>
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
                                                        <th onClick={(e) => this.ascDesc(e, "profile.joiningDate")}>Joining Date <i className={`fa fa-sort mr-10 ${sortKey === 'profile.joiningDate' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                        <th onClick={(e) => this.ascDesc(e, "profile.firstName")}>Name<i className={`fa fa-sort mr-10 ${sortKey === 'profile.firstName' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                        <th onClick={(e) => this.ascDesc(e, "emails.0.address")}>Emaile Id<i className={`fa fa-sort mr-10 ${sortKey === 'emails.0.address' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                        <th onClick={(e) => this.ascDesc(e, "profile.phone")}>Conatct No <i className={`fa fa-sort mr-10 ${sortKey === 'profile.phone' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                        <th>No of Experiance</th>
                                                        <th onClick={(e) => this.ascDesc(e, "profile.birthDate")}>Date Of Birth<i className={`fa fa-sort mr-10 ${sortKey === 'profile.birthDate' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                        <th onClick={(e) => this.ascDesc(e, "address.0.country")}>Location<i className={`fa fa-sort mr-10 ${sortKey === 'address.0.country' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                        <th onClick={(e) => this.ascDesc(e, "profile.gender")}>Gender<i className={`fa fa-sort mr-10 ${sortKey === 'profile.gender' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                        <th>Joining Year</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.displayedUser.map((event, i) => {
                                                        let name = event.profile.firstName + " " + event.profile.lastName;
                                                        let experiances = this.experiance(event.experiance)
                                                        let location = event.countryname.countryname + "," + event.statename.stateName + "," + event.cityname.cityName;
                                                        const dateFormat = "DD/MM/YYYY";
                                                        let datediff = this.datedifferent(event.profile.joiningDate, moment().format(dateFormat));
                                                        return (
                                                            <tr key={i}>
                                                                <td>{moment(event.profile.joiningDate).format('DD/MM/YYYY')}</td>
                                                                <td>{name}</td>
                                                                <td>{event.emails[0].address}</td>
                                                                <td>{event.profile.phone}</td>
                                                                <td>{experiances}</td>
                                                                <td>{moment(event.profile.birthDate).format('DD/MM/YYYY')}</td>
                                                                <td>{location}</td>
                                                                <td>{event.profile.gender}</td>
                                                                <td>{datediff}</td>
                                                                <td>
                                                                    <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.openmodeldelete(e, event._id)}> <i className="fa fa-trash-o"></i></a>
                                                                    <a href={`updateuser/${event._id}`} className="btn btn-xs  btn-primary "><i className="fa fa-edit"></i></a>
                                                                    <a href={`/employeeAttendance?id=${event._id}`} className="label label-warning" style={{ marginLeft: '5px' }}>Attendance</a>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
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
                    </div>
                </div>
                <div className="modal" tabIndex="-1" role="dialog" id="deletemodel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modal title</h5>
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
            </div>
        )
    }
}
export default withTracker(() => {
    Meteor.subscribe('CountryData');
    Meteor.subscribe('Statedata');
    Meteor.subscribe('Citydata');
    return {
        country: Country.find({}).fetch(),
        states: State.find({}).fetch(),
        city: Cities.find({}).fetch()
    }
})(ListUser);
