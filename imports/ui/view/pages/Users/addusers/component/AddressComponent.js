import React, { Component } from 'react';
import Select from "react-select";
class AddressComponent extends Component {
    constructor(props) {
        super(props);}
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="col-sm-4">
                            <label className="mainheading">Address</label>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="hr-line-dashed1"></div>
                </div>
                <div className="form-group row">
                    <div className="col-md-12" >
                        <div className="col-md-6">
                            <label>Address Line 1</label>
                            <input
                                type="text"
                                className="form-control"
                                name="addressline1"
                                id="add_line1"
                                value={this.props.addressline1}
                                style={{ marginRight: "15px" }}
                                onChange={this.props.AddressChangeHandler}/>
                        </div>

                        <div className="col-md-6">
                            <label>Address Line 2</label>
                            <input type="text" className="form-control" name="addressline2"
                                value={this.props.addressline2}
                                onChange={this.props.AddressChangeHandler}/>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <label>Country</label>
                            <Select  defaultValue="select" value={this.props.CountryOption} options={this.props.countrie} onChange={this.props.myCountryHandlar} />
                        </div>
                        <div className="col-md-6 ">
                            <label>State</label>
                            <Select value={this.props.StateOption} options={this.props.states} onChange={this.props.mystateChangeHandler} />
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <label>City</label>
                            <Select value={this.props.CityOption} options={this.props.city} onChange={this.props.mycityChangeHandler} ></Select>
                        </div>
                        <div className="col-md-6">
                            <label>Zipcode</label>
                            <input type="text"
                                value={this.props.zipcode}
                                className="form-control"
                                placeholder="" id="zipcode" name="zipcode" onChange={this.props.EmailChangeHandler} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default AddressComponent;