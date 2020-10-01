import { Meteor } from 'meteor/meteor';
import Country from '../country/country';
import State from '../states/states';
import Cities from '../cites/cites';
var Sugar = require('sugar');
import LeaveType from '../leave/leaveTypeSchema';
if (Meteor.isServer) {

    Meteor.methods({
        //Add Country state and city 
        'addcountry': (cname, ccode) => {
            return Country.insert(
                { countryname: cname, countrycode: ccode }
            );
        },
        'addstate': (cid, sname) => {
            return State.insert({ countryId: cid, stateName: sname });
        },
        'addcity': (cid, sid, cityname) => {
            return Cities.insert({ countryId: cid, stateId: sid, cityName: cityname });
        },
        //Delete Country state and city 
        'deletecountry': (id) => {
            return Country.remove({ _id: id });
        },
        'deletestate': (id) => {
            return State.remove({ _id: id });
        },
        'deletecity': (id) => {
            return Cities.remove({ _id: id });
        },
        //Edit Country state and city 
        'updatecountry': (cname, ccode, id) => {
            return Country.update({ _id: id }, { $set: { countryname: cname, countrycode: ccode } })
        },
        'updatestatedata': (cid, sname, id) => {
            return State.update({ _id: id }, { $set: { countryId: cid, stateName: sname } })
        },

        'updatecitydata': (cid, sid, cityname, id) => {
            return Cities.update({ _id: id }, { $set: { countryId: cid, stateId: sid, cityName: cityname } })
        },
        //Search Country state and city 
        'searchcountry': (pipeline) => {
            return Promise.await(Country.rawCollection().aggregate(pipeline).toArray());
        },
        'searchState': (pipeline) => {
            return Promise.await(State.rawCollection().aggregate(pipeline).toArray());
        },
        'searchCity': (pipeline) => {
            return Promise.await(Cities.rawCollection().aggregate(pipeline).toArray());
        },
        //Count Country state and city 
        'countCountrydata': () => {
            return Country.find({}).count();
        },
        'countStatedata': () => {
            return State.find({}).count();
        },
        'countCitydata': () => {
            return Cities.find({}).count();
        },
        //Leave type
        'addleaveType': (leaveTypeName, noOfDay) => {
            return LeaveType.insert({ leaveTypeName: leaveTypeName, noOfDay: noOfDay })
        },
        'updateLeaveType': (leaveTypeName, noofday,lid) => {
            return LeaveType.update({ _id: lid }, { $set: { leaveTypeName: leaveTypeName, noOfDay: noofday } })
        },
        'deleteLeaveType': (lid) => {
            return LeaveType.remove({ _id: lid });
        },
        'searchLeaveType': (pipeline) => {
            return Promise.await(LeaveType.rawCollection().aggregate(pipeline).toArray());
        },
        'countLeaveTypeData': () => {
            return LeaveType.find({}).count();
        }
    })
}