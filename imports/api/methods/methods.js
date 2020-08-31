import { Meteor } from 'meteor/meteor';
Meteor.methods({
    createregister(username,email,password,phone) {
        var options = {
            username: username,
            emails: email,
            password: password,
            profile: {
                userType: 'superadmin',
                firstName: 'Super',
                lastName: 'Admin',
                phone: phone,
                designation: 'HR'
            }
        };
        
       return Accounts.createUser(options);
    }
 });