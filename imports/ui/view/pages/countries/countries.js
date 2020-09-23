import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
export default class Countries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryname: "",
            countrycode: "",
            countryid: "",
            button: false,
            displayedCountries: [],
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
    addcountry(e) {
        const self = this;
        let { countryname, countrycode } = this.state;
        if (this.state.button == true) {
            Meteor.call('updatecountry', countryname, countrycode, this.state.countryid, function (err, result) {
                if (!err) {
                    toast.success("Record updates..." + result);
                    $("#add-panel").modal("hide");
                    self.setState({
                        countryname: "",
                        countrycode: "",
                        countryid: "",
                        button: false
                    })
                    // window.location.reload(false);
                } else {
                    toast.error("Error ::" + err);
                }
            })


        } else {
            Meteor.call('addcountry', countryname, countrycode, function (err, result) {
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
        Meteor.call('deletecountry', this.state.countryid, function (err, res) {
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
        this.state.displayedCountries.map((cou, i) => {
            if (cou._id == id) {
                this.setState({ countryname: cou.countryname, countrycode: cou.countrycode, button: true, countryid: id })
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
                        { countryname: { $regex: this.state.searchStr, $options: 'i' } },
                        { countrycode: { $regex: this.state.searchStr, $options: 'i' } }
                    ]
                }
            },
            { "$sort": { [this.state.sortKey]: this.state.sortValue } },
            { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
            { "$limit": this.state.pageLength },
        ];
        Meteor.call("searchcountry", pipeline, function (err, res) {
            if (!err) {
                Meteor.call("countCountrydata", res, function (err1, res1) {
                    if (!err) {
                        self.setState({ totalpage: res1 });
                    }
                })
                self.setState({ displayedCountries: res });
            } else {
                toast.error(err);
            }
        });

    }
    descdata(e, name) {
        $(".default").removeClass('fa fa-fw fa-sort');
        this.setState({
            sortbutton: "desc",
            sortValue: -1,
            sortKey: name,
            currentPage: 1
        }, () => {
            this.getCountryData();
        })
    }
    asecdata(e, name) {
        $(".default").removeClass('fa fa-fw fa-sort');
        this.setState({
            sortbutton: "asc",
            sortValue: 1,
            sortKey: name,
            currentPage: 1
        }, () => {
            this.getCountryData();
        }
        );

    }
    render() {
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
                                    <div className="col-sm-6" >
                                        <div class="dataTables_length" id="example_length">
                                            <label className="dataTables_length text">Show <select name="example_length"
                                                className="form-control" onChange={this.showhandle.bind(this)}>
                                                <option value="5">5</option>
                                                <option value="10" selected>10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select> entries</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6" >
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
                                                {
                                                    this.state.sortbutton == "default" ? <th onClick={(e) => this.descdata(e, "countryname")}>Country Name <i class="fa fa-fw fa-sort default sortdata"></i></th>
                                                        : this.state.sortbutton == "asc" ? <th onClick={(e) => this.descdata(e, "countryname")}>Country Name <i className="fa fa-sort-amount-asc asc sortdata"></i></th>
                                                            : <th onClick={(e) => this.asecdata(e, "countryname")}>Country Name<i class="fa fa-sort-amount-desc desc sortdata" ></i></th>
                                                }
                                                {
                                                    this.state.sortbutton == "default" ? <th onClick={(e) => this.descdata(e, "countrycode")}>Country Code<i class="fa fa-fw fa-sort default sortdata"></i></th>
                                                        : this.state.sortbutton == "asc" ? <th onClick={(e) => this.descdata(e, "countrycode")}>Country Code<i className="fa fa-sort-amount-asc asc sortdata"></i></th>
                                                            : <th onClick={(e) => this.asecdata(e, "countrycode")}>Country Code<i class="fa fa-sort-amount-desc desc sortdata"></i></th>
                                                }
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.displayedCountries.map((cou, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{cou.countryname}</td>
                                                            <td>{cou.countrycode}</td>
                                                            <td>
                                                                <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.deletemodel(e, cou._id)}>
                                                                    <i className="fa fa-trash-o"></i></a>

                                                                <a className="btn btn-xs btn-primary " onClick={(e) => this.updaterecord(e, cou._id)}>
                                                                    <i className="fa fa-edit"></i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>Country Name</th>
                                                <th>Country Code</th>
                                                <th>Action</th>
                                            </tr>
                                        </tfoot>
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
                <div className="modal fade" id="add-panel" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title">Add Country Data</h4>
                            </div>
                            <div class="modal-body">
                                <div className="container-fluid">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <label>Country Name</label>
                                                <input type="text"
                                                    className="form-control"
                                                    value={this.state.countryname}
                                                    onChange={(e) => this.setState({ countryname: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label>Country Code</label>
                                                <input type="text"
                                                    className="form-control"
                                                    value={this.state.countrycode}
                                                    onChange={(e) => this.setState({ countrycode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" id="cancel-button" onClick={(e) => this.cancel(e)}>Cancel</button>
                                {this.state.button
                                    ? <button type="button" class="btn btn-primary" id="confirm-button" onClick={(e) => { this.addcountry(e) }}>Update Country</button>
                                    : <button type="button" class="btn btn-primary" id="confirm-button" onClick={(e) => { this.addcountry(e) }}>Add Country</button>}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal" tabindex="-1" role="dialog" id="deletemodel">
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


