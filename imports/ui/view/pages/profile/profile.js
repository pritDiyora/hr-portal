import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data'
// import { Session } from 'meteor/session';

class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { currentUser } = this.props;
        return (
            <div className="wrapper wrapper-content">
                <div className="row animated fadeInRight">
                    <div className="col-md-12">
                        <div className="ibox ">
                            <div className="ibox-title">
                                <h5>Profile Detail</h5>
                            </div>
                            <div>
                                <div className="ibox-content no-padding border-left-right">
                                    <img alt="image" className="img-responsive" src="img/profile_big.jpg" />
                                </div>
                                <div className="ibox-content profile-content">
                                    <h4>{currentUser && currentUser.profile && currentUser.profile.firstName}</h4>
                                    <p><i className="fa fa-map-marker"></i> Riviera State 32/106</p>
                                    <h5>
                                        About me
                                    </h5>

                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitat.
                                    </p>
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
                </div>
            </div>
        )
    }
}

export default withTracker(() => {
    
    Meteor.subscribe('user');
    // debugger
    return {
        currentUser: Meteor.user()
    }
})(Profile);