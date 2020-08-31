import { Meteor } from 'meteor/meteor';

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
    }
});