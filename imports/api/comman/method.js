import { Meteor } from 'meteor/meteor';
import Country from '../country/country';
import State from '../states/states';
import Cities from '../cites/cites';
import User from '../user/users';
if (Meteor.isServer) {
    Meteor.methods({
        //Country state and city 
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
        //country
        'deletecountry': (id) => {
            return Country.remove({ _id: id });
        },
        'updatecountry': (cname, ccode, id) => {
            return Country.update({ _id: id }, { $set: { countryname: cname, countrycode: ccode } })
        },
        'deletestate': (id) => {
            return State.remove({ _id: id });
        },
        'updatestatedata': (cid, sname, id) => {
            return State.update({ _id: id }, { $set: { countryId: cid, stateName: sname } })
        },
        'deletecity': (id) => {
            return Cities.remove({ _id: id });
        },
        'updatecitydata': (cid, sid, cityname, id) => {
            return Cities.update({ _id: id }, { $set: { countryId: cid, stateId: sid, cityName: cityname } })
        },
        'searchcountry': (pipeline) => {
            return Promise.await(Country.rawCollection().aggregate(pipeline).toArray());
        },
        'countrydata': (res) => {
            return Country.find(res, { sort: { createdAt: 1 } }).fetch();
        },
        'countCountrydata': () => {
            return Country.find({}).count();
        },
        'searchState': (pipeline) => {
            return Promise.await(State.rawCollection().aggregate(pipeline).toArray());
        },
        'countStatedata': () => {
            return State.find({}).count();
        },
        'searchCity': (pipeline) => {
            return Promise.await(Cities.rawCollection().aggregate(pipeline).toArray());
        },
        'countCitydata': () => {
            return Cities.find({}).count();
        },
        'searchUser': (pipeline) => {
            return Promise.await(User.rawCollection().aggregate(pipeline).toArray());
        },
        'countUserdata': () => {
            return User.find({}).count();
        },
        'deleteuser': (id) => {
            return User.remove({ _id: id });
        }
    })
}