import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Country from '../../../../api/country/country';
import State from '../../../../api/states/states';
import Cities from '../../../../api/cites/cites';
import Avatar from 'react-avatar';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { country: "", states: "", city: "", zipcode: "", profileimage: "" }
    }
    componentWillReceiveProps(nextProps) {
        let userCountry = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].country || [],
            userState = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].state || [],
            userCity = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].city || [],
            userZipCode = nextProps.currentUser && nextProps.currentUser.address && nextProps.currentUser.address[0].zipcode || [];
        let cou = nextProps.countries.find(cou => cou._id == userCountry) || {};
        let stat = nextProps.statedata.find(st => st._id == userState) || {};
        let cities = nextProps.citiesdata.find(city => city._id == userCity) || {};
        this.setState({ country: cou.countryname, states: stat.stateName, city: cities.cityName, zipcode: userZipCode });
    }
    componentDidMount() {

    }
    profilePicUploade(e) {
        var self = this;
        let filess = e.target.files;
        S3.upload({
            files: filess,
            path: "profileImage"
        }, function (err, r) {
            if (!err) {
                Meteor.call('profileImageUploade', r.url, Meteor.userId(), function (err1, res1) {
                    if (!err1) {
                        console.log("Uploaded Successfully...");
                        self.setState({
                            profileimage: r.url,
                            loading: false
                        }, () => {
                            console.log("df :: ", self.state);
                        });
                    }
                });
            }
        });

    }
    render() {
        let { currentUser } = this.props;
        let { country, states, city, zipcode, profileimage } = this.state;
        return (
            <div className="wrapper wrapper-content">
                <div className="row animated fadeInRight">
                    <div className="col-md-4">
                        <div className="ibox ">
                            <div className="ibox-title">
                                <h5>Profile Detail</h5>
                            </div>
                            <div>
                                <div className="ibox-content no-padding border-left-right">
                                    <center>
                                        <label for="profileimage" className="img-circle img">
                                            <input type="file" name="profileimage" id="profileimage" style={{ display: "none" }} onChange={(e) => this.profilePicUploade(e)} />
                                            <Avatar src={profileimage == "" ? " "
                                                : profileimage} className="img-circle" style={{ marginTop: "5px" }} value={profileimage} name={profileimage == "" ?
                                                    currentUser && currentUser.profile && currentUser.profile.firstName + " " + currentUser.profile.lastName
                                                    : ""} className="img-circle" style={{ marginTop: "5px" }}
                                                size="150" color="#ffcccc" fgColor="#990000" maxInitials={2} />
                                            <span class="green-overlay"></span>
                                        </label>

                                    </center>

                                </div>
                                <div className="ibox-content profile-content">
                                    <center>
                                        <h4>{currentUser && currentUser.profile && currentUser.profile.firstName + " " + currentUser.profile.lastName}</h4>
                                        {country == undefined ? " " :
                                            <p><i className="fa fa-map-marker"></i>&nbsp;
                                            {currentUser && currentUser.address && currentUser.address[0].addressline1}
                                                {currentUser && currentUser.address && currentUser.address[0].addressline2 == undefined ? " " : currentUser && currentUser.address && currentUser.address[0].addressline2}
                                                {country == undefined ? " " : "," + country}{states == undefined ? " " : "," + states}
                                                {city == undefined ? "" : "," + city} {zipcode == undefined ? "" : "-" + zipcode}</p>
                                        }
                                        <h5>
                                            About me
                                         </h5>
                                        <p>
                                            {currentUser && currentUser.profile && currentUser.profile.description == undefined
                                                ? currentUser && currentUser.profile && currentUser.profile.designation
                                                : currentUser && currentUser.profile && currentUser.profile.description}
                                        </p>
                                    </center>
                                    <div className="col-md-12" style={{ padding: "0px" }}>
                                        <div className="col-md-3">
                                            <h5>Total Leave</h5>
                                            <p>0</p>
                                        </div>
                                        <div className="col-md-3" style={{ padding: "0px" }}>
                                            <h5>Total GainLeave</h5>
                                            <p>0</p>
                                        </div>
                                        <div className="col-md-3">
                                            <h5>Total Paid</h5>
                                            <p>0</p>
                                        </div>
                                        <div className="col-md-3" style={{ padding: "0px" }}>
                                            <h5>Remaining Leave</h5>
                                            <p>0</p>
                                        </div>

                                    </div>
                                    <div className="user-button">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button type="button" className="btn btn-primary btn-sm btn-block"><i className="fa fa-envelope"></i> Send Message</button>
                                            </div>
                                            <div className="col-md-6">
                                                <button type="button" className="btn btn-default btn-sm btn-block"><i className="fa fa-coffee"></i> Buy a coffee</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="ibox ">
                            <div className="ibox-title">
                                <h5>Profile Detail</h5>
                            </div>
                            <div>
                                <div className="ibox-content">
                                    <span>
                                    </span>
                                </div>
                                <div className="ibox-content profile-content">
                                    DS
                                </div>
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
    Meteor.subscribe('user');
    Meteor.subscribe('Statedata');
    Meteor.subscribe('Citydata');
    // debugger
    return {
        countries: Country.find({}).fetch(),
        currentUser: Meteor.user(),
        statedata: State.find({}).fetch(),
        citiesdata: Cities.find({}).fetch(),
    }
})(Profile);