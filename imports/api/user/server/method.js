import { Meteor } from 'meteor/meteor';
import  Attendance from './../../attendance/attendance';

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
            var user = Meteor.users.findOne({ _id: userId });
            return Accounts._checkPassword(user, password);
        } else {
            return false;
        }
    },

    'checkInOut': (checkInOutData) => {
        if (Meteor.isServer) {
            if(Meteor.user()) {
                let updateStatus = Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.clockStatus': checkInOutData.isCheckIn } });
                console.log('updateStatus : ', updateStatus);
                return Attendance.insert(checkInOutData);
            } else {
                throw new Meteor.Error('BAD', "You Don't have Permission to do this")
            }
        }
    },

});