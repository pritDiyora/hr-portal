import { Meteor } from 'meteor/meteor';
import '../imports/api/index';
// import S3 from 'aws-sdk/clients/s3';
Meteor.startup(() => {
    Meteor.users.allow({
        insert: function (userId, doc) {
            // only admin can insert 
            var u = Meteor.users.findOne({ _id: userId });
            return (u && u.isAdmin);
        },
        update: function (userId, doc, fields, modifier) {
            console.log("user " + userId + "wants to modify doc" + doc._id);
            if (userId && doc._id === userId) {
                console.log("user allowed to modify own account!");
                // user can modify own 
                return true;
            }
            // admin can modify any
            var u = Meteor.users.findOne({ _id: userId });
            return (u && u.isAdmin);
        },
        remove: function (userId, doc) {
            // only admin can remove
            var u = Meteor.users.findOne({ _id: userId });
            return (u && u.isAdmin);
        }
    });
    process.env.MAIL_URL = `smtp://superadmi12@gmail.com:prathana@smtp.gmail.com:587/`;

    if (Meteor.users.find().count() === 0) {
        var options = {
            username: "Admin",
            email: "superadmin@admin.com",
            password: '123456',
            profile: {
                userType: 'superadmin',
                firstName: 'Super',
                lastName: 'Admin',
                phone: '1234567890',
                designation: 'owner'
            }
        };
        Accounts.createUser(options);
    }
    
    S3.config = {
        key: 'AKIAIQZEI4RO6OSIZGQQ',
        secret: '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',
        bucket: 'apex-hr-portal',
        region: 'ap-south-1',
    };

   
});
