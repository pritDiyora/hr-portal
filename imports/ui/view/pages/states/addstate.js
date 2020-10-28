import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import Country from '../../../../api/country/country';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";
import bootbox from 'bootbox'

class State extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryid: "",
            statename: "",
            stateid: "",
            button: false,
            displayedState: [],
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
        this.getStateData();
    }
    showhandle(event) {
        this.setState({
            currentPage: 1,
            pageLength: parseInt(event.target.value)
        }, () => {
            this.getStateData();
        })
    }
    handlePageChange(pageNumber) {
        const currentPage = pageNumber;
        const totalpage = pageNumber;
        this.setState({
            currentPage, totalpage
        }, () => {
            this.getStateData();
        });
    }
    search(e) {
        this.setState({
            currentPage: 1,
            searchStr: e.target.value
        }, () => {
            this.getStateData();
        })
    }
    getStateData() {
        const self = this;
        let pipeline = [
            {
                "$lookup": {
                    from: "country",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "countryname"
                }
            },
            { "$unwind": "$countryname" },
            {
                "$match": {
                    "$or": [
                        { "countryname.countryname": { $regex: this.state.searchStr, $options: 'i' } },
                        { stateName: { $regex: this.state.searchStr, $options: 'i' } }
                    ]
                }
            },
            { "$sort": { [this.state.sortKey]: this.state.sortValue } },
            { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
            { "$limit": this.state.pageLength },
        ];
        Meteor.call("searchState", pipeline, function (err, res) {
            if (!err) {
                Meteor.call("countStatedata", res, function (err1, res1) {
                    if (!err) {
                        self.setState({ totalpage: res1 });
                    }
                })
                console.log('res ::::', res);
                self.setState({ displayedState: res });
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
                this.getStateData();
            })
        } else {
            this.setState({
                sortValue: 1,
                sortKey: keyName,
                currentPage: 1
            }, () => {
                this.getStateData();
            })
        }
    }
    addstate(e) {
        e.preventDefault();
        let { countryid, statename } = this.state, self = this;
        if (this.state.button == true) {
            Meteor.call('updatestatedata', countryid, statename, this.state.stateid, function (err, result) {
                if (!err) {
                    toast.success("Record Updated..." + result);
                    $("#add-panel").modal("hide");
                    self.getStateData();
                } else {
                    toast.error("Error ::" + err);

                }
            })
            this.setState({ countryid: "", statename: "", button: false, stateid: "" })
        } else {
            Meteor.call('addstate', countryid, statename, function (err, result) {
                if (!err) {
                    toast.success("Record Inserted..." + result);
                    $("#add-panel").modal("hide");
                    self.getStateData();
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
        self.setState({ stateId: id })
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
                    Meteor.call('deletestate', self.state.stateId, function (err, res) {
                        if (!err) {
                            toast.success("Record Deleted.." + res)
                            self.getStateData();
                        } else {
                            toast.error(err)
                        }
                    });
                }
            },
        });
    }

    updaterecord(e, id) {
        let state = this.state.displayedState.find(state => state._id == id);
        this.setState({ countryid: state.countryId, statename: state.stateName, button: true, stateid: id })
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
                            <h5>State Lists</h5>
                            <IboxTools />
                        </div>
                        <div className="ibox-content">
                            <div className="row text-center">
                                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}>Add States</a>
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
                                                <th onClick={(e) => this.ascDesc(e, "countryname")}>Country Name  <i className={`fa fa-sort mr-10 ${sortKey === 'countryname' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th onClick={(e) => this.ascDesc(e, "stateName")}>Country Code  <i className={`fa fa-sort mr-10 ${sortKey === 'stateName' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.displayedState.map((state, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{state.countryname.countryname}</td>
                                                            <td>{state.stateName}</td>
                                                            <td>
                                                                <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.openmodeldelete(e, state._id)}>
                                                                    <i className="fa fa-trash-o"></i></a>

                                                                <a className="btn btn-xs btn-primary " onClick={(e) => this.updaterecord(e, state._id)}>
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
                                <h4 className="modal-title">Add State Data</h4>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <label>Country Name</label>
                                            <select className="form-control"
                                                onChange={(e) => this.setState({ countryid: e.target.value })}
                                                value={this.state.countryid}
                                            >
                                                <option defaultValue>Select Country</option>
                                                {this.props.countries.map((country) => (
                                                    <option value={country._id} key={country._id}>{country.countryname}</option>
                                                ))}
                                            </select><br />
                                        </div>
                                        <div className="col-md-12">
                                            <label>State Name</label>
                                            <input type="text"
                                                className="form-control"
                                                onChange={(e) => this.setState({ statename: e.target.value })}
                                                value={this.state.statename}
                                            />

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" id="cancel-button" data-dismiss="modal" onClick={(e) => this.cancel(e)}>Cancel</button>
                                {
                                    this.state.button ?
                                        <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addstate(e) }}>Update State</button>
                                        : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addstate(e) }}>Add State</button>
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
    Meteor.subscribe('CountryData');
    return {
        countries: Country.find({}).fetch()
    }
})(State);

