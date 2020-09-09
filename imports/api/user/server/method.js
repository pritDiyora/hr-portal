import { Meteor } from 'meteor/meteor';
import Country from '../../country/country';
import User from '../users';
import State from '../../states/states';
import Cities from '../../cites/cites';

process.env.MAIL_URL = `smtp://superadmi12@gmail.com:prathana@smtp.gmail.com:587/`;
if (Meteor.isServer) {
    Meteor.methods({
        'registerUser': (data) => {
            check(data, Object);
            if (Meteor.isServer) {
                try {
                    let res = Accounts.createUser(data);
                    // send verification email
                    return res;
                } catch (err) {
                    throw new Meteor.Error(200, err);
                }
            }
        },
        'checkPassword': (userId, password) => {
            check(userId, String);
            check(password, String);
            if (Meteor.userId()) {
                var user = User.findOne({ _id: userId });
                return Accounts._checkPassword(user, password);
            } else {
                return false;
            }
        },
        'insertuser': (user) => {
            let userId = Accounts.createUser(user);
            Accounts.sendEnrollmentEmail(userId);
            return userId;

        },
        'addeducation': (userid, educations) => {
            return User.update({ _id: userid }, { $set: { education: educations }, });
        },
        'addexperiance': (userid, experi) => {
            return User.update({ _id: userid }, { $set: { experiance: experi }, });
        }

        //Country state and city 
        ,
        'addcountry': (cname, ccode) => {
            return Country.insert({ countryname: cname, countrycode: ccode });
        },
        'addstate': (cid, sname) => {
            return State.insert({ countryId: cid, stateName: sname });
        },
        'addcity': (cid, sid, cityname) => {
            return Cities.insert({ countryId: cid, stateId: sid, cityName: cityname });
        }
        
    });
}
