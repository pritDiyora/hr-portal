import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import { withTracker } from 'meteor/react-meteor-data';
import Cities from '../../../../api/cites/cites';
import Pagination from "react-js-pagination";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bootbox from 'bootbox'

class City extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countryid: "",
            stateid: "",
            cityname: "",
            cityid: "",
            button: false,
            displayedCity: [],
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

    addcity(e) {
        e.preventDefault();
        let { countryid, stateid, cityname } = this.state, self = this;
        if (this.state.button == true) {
            Meteor.call('updatecitydata', countryid, stateid, cityname, this.state.cityid, function (err, result) {
                if (!err) {
                    toast.success("Record Updated..." + result);
                    $("#add-panel").modal("hide");
                    self.getCityData();
                } else {
                    toast.error("Error ::" + err);

                }
            })
            this.setState({ countryid: "", stateid: "", cityname: "", button: false, cityid: "" })
        } else {
            Meteor.call('addcity', countryid, stateid, cityname, function (err, result) {
                if (!err) {
                    toast.success("Record Inserted..." + result);
                    $("#add-panel").modal("hide");
                    self.getCityData();
                } else {
                    toast.error("Error ::" + err);

                }
            })
        }
    }
    componentDidMount() {
        this.getCityData();
    }
    showhandle(event) {
        this.setState({
            currentPage: 1,
            pageLength: parseInt(event.target.value)
        }, () => {
            this.getCityData();
        })
    }
    handlePageChange(pageNumber) {
        const currentPage = pageNumber;
        const totalpage = pageNumber;
        this.setState({
            currentPage, totalpage
        }, () => {
            this.getCityData();
        });
    }
    search(e) {
        this.setState({
            currentPage: 1,
            searchStr: e.target.value
        }, () => {
            this.getCityData();
        })
    }
    getCityData() {
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
                "$lookup": {
                    from: "state",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "statename"
                }
            },
            { "$unwind": "$statename" },
            {
                "$match": {
                    "$or": [
                        { "countryname.countryname": { $regex: this.state.searchStr, $options: 'i' } },
                        { "statename.stateName": { $regex: this.state.searchStr, $options: 'i' } },
                        { cityName: { $regex: this.state.searchStr, $options: 'i' } }
                    ]
                }
            },
            { "$sort": { [this.state.sortKey]: this.state.sortValue } },
            { "$skip": (this.state.currentPage - 1) * this.state.pageLength },
            { "$limit": this.state.pageLength },
        ];
        Meteor.call("searchCity", pipeline, function (err, res) {
            if (!err) {
                Meteor.call("countCitydata", res, function (err1, res1) {
                    if (!err) {
                        self.setState({ totalpage: res1 });
                    }
                })
                self.setState({ displayedCity: res });
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
                this.getCityData();
            })
        } else {
            this.setState({
                sortValue: 1,
                sortKey: keyName,
                currentPage: 1
            }, () => {
                this.getCityData();
            })
        }
    }
    openmodeldelete(e, id) {
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

    updaterecord(e, id) {
        let state = this.state.displayedCity.find(state => state._id == id);
        this.setState({ countryid: state.countryId, stateid: state.stateId, cityname: state.cityName, button: true, cityid: state._id })
        $("#add-panel").modal("show");
    }
    cancel(e) {
        this.setState({ countryid: "", statename: "", button: false, cityid: "" })
        $("#add-panel").modal("hide");
    }
    //model open
    modelclick(event) {
        $("#add-panel").modal("show");
    }
    render() {
        let { sortKey, sortValue } = this.state;
        return (
            <div>
                <div className="wrapper wrapper-content animated fadeInRight" >
                    <div className="ibox">
                        <div className="ibox-title">
                            <h5>City Lists</h5>
                            <IboxTools />
                        </div>
                        <div className="ibox-content">
                            <div className="row text-center">
                                <a data-toggle="modal" className="btn btn-primary addmodel" onClick={(e) => this.modelclick(e)}>Add City</a>
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
                                                <th onClick={(e) => this.ascDesc(e, "statename.stateName")}>State Name  <i className={`fa fa-sort mr-10 ${sortKey === 'statename.stateName' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th onClick={(e) => this.ascDesc(e, "cityName")}>City Name<i className={`fa fa-sort mr-10 ${sortKey === 'cityName' ? sortValue == 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc' : ''} `}></i> </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.displayedCity.map((city, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{city.countryname.countryname}</td>
                                                            <td>{city.statename.stateName}</td>
                                                            <td>{city.cityName}</td>
                                                            <td>
                                                                <a id="delete" className="btn btn-xs btn-danger" onClick={(e) => this.openmodeldelete(e, city._id)}><i className="fa fa-trash-o"></i></a> <a className="btn btn-xs  btn-primary " onClick={(e) => this.updaterecord(e, city._id)}><i className="fa fa-edit"></i></a>
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
                                <h4 className="modal-title">Add City Data</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <div className="col-md-12">

                                        <label>Country Name</label>
                                        <select className="form-control"
                                            value={this.state.countryid}
                                            onChange={(e) => this.setState({ countryid: e.target.value })}>
                                            <option defaultValue>Select Country</option>
                                            {this.props.countries.map((country) => (
                                                <option value={country._id} key={country._id} >{country.countryname}</option>))}
                                        </select><br />
                                    </div>
                                    <div className="col-md-12">
                                        <label>State Name</label>
                                        <select className="form-control" value={this.state.stateid}
                                            onChange={(e) => this.setState({ stateid: e.target.value })}>
                                            <option defaultValue>Select Country</option>
                                            {this.props.states.map((state) => (
                                                <option value={state._id} key={state._id}>{state.stateName}</option>))}
                                        </select><br />
                                    </div>
                                    <div className="col-md-12">
                                        <label>City Name</label>
                                        <input type="text"
                                            className="form-control"
                                            onChange={(e) => this.setState({ cityname: e.target.value })}
                                            value={this.state.cityname}
                                        />

                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" id="cancel-button" data-dismiss="modal" onClick={(e) => this.cancel(e)}>Cancel</button>
                                {
                                    this.state.button ?
                                        <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addcity(e) }}>Update City</button>
                                        : <button type="button" className="btn btn-primary" id="confirm-button" onClick={(e) => { this.addcity(e) }}>Add City</button>
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
    Meteor.subscribe('Statedata');
    Meteor.subscribe('Citydata');
    return {
        countries: Country.find({}).fetch(),
        states: State.find({}).fetch(),
        cities: Cities.find({}).fetch()
    }
})(City);

