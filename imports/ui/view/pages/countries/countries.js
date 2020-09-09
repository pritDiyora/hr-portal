import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IboxTools from '../../layout/iboxTools';
export default class Countries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryname: "",
            countrycode: ""
        }
    }

    addcountry(e) {
        e.preventDefault();
        let { countryname, countrycode } = this.state;
        Meteor.call('addcountry',countryname,countrycode,function(err,result){
            if(!err){
                console.log("Record Inserted..." + result);
            }else{
                console.log("Error ::"+ err);
                
            }
        })
    }   

    render() {
        return (
            <div className="wrapper wrapper-content animated fadeInRight" >
                <div class="ibox ">
                    <div class="ibox-title">
                        <h5>Country form</h5>
                        <IboxTools />
                    </div>
                    <div class="ibox-content">
                        <div className="container-fluid">
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="col-md-6">
                                        <label>Country Name</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder=""
                                            onChange={(e) => this.setState({countryname: e.target.value})}

                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Country Code</label>
                                        <input type="text"
                                            className="form-control"
                                            onChange={(e) => this.setState({countrycode: e.target.value})}
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: "center" }}>
                                <input type="button" name="firstnext" class="btn  btn-primary float-right" value="Add Country" onClick={(e) => { this.addcountry(e) }} />
                            </div>

                        </div>
                    </div>
                </div>

            </div>


        )
    }

}


