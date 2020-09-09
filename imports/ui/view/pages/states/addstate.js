import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
import Country from '../../../../api/country/country';
import { withTracker } from 'meteor/react-meteor-data';
class State extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryid: "",
            statename: ""
        }
    }

    addcountry(e) {
        e.preventDefault();
        let { countryid, statename } = this.state;
        Meteor.call('addstate', countryid, statename, function (err, result) {
            if (!err) {
                console.log("Record Inserted..." + result);
            } else {
                console.log("Error ::" + err);

            }
        })
    }

    render() {
        return (

            <div className="wrapper wrapper-content animated fadeInRight" >
                <div class="ibox ">
                    <div class="ibox-title">
                        <h5>State form</h5>
                        <IboxTools />
                    </div>
                    <div class="ibox-content">
                        <div className="container-fluid">
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="col-md-6">
                                        <label>Country Name</label>
                                        <select className="form-control"
                                            onChange={(e) => this.setState({ countryid: e.target.value })}>
                                            <option selected>Select Country</option>
                                            {this.props.countries.length ? this.props.countries.map((country) => (
                                                <option value={country._id}>{country.countryname}</option>
                                            )) : <div className="no-events">OOOPSY: NO EVENTS REGISTERED</div>}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label>State Name</label>
                                        <input type="text"
                                            className="form-control"
                                            onChange={(e) => this.setState({ statename: e.target.value })}
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: "center" }}>
                                <input type="button" name="firstnext" className="btn  btn-primary float-right" value="Add Country" onClick={(e) => { this.addcountry(e) }} />
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

