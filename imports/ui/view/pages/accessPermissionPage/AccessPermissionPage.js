import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
export default class AccessPermissionPage extends React.Component {
    // handleBackBtnClick(event){
    //     event.preventDefault();
    //     FlowRouter.History.back();
    // }
    render() {
        return (
            <div className="middle-box text-center animated fadeInDown">
                <h1>400</h1>
                <h3 className="font-bold">You don't have Permission to Access this Page</h3>
                <div className="error-desc">
                    Sorry, but You Can't access any page without Permission
                     {/* <form className="form-inline m-t" role="form">
                        <button type="submit" className="btn btn-primary" onClick={(e) => this.handleBackBtnClick(e)}>Back</button>
                    </form> */}
                </div>
            </div>
        )
    }

}