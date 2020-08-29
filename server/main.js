import { Meteor } from 'meteor/meteor';
import '../imports/api/index';

Meteor.startup(() => {
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
});
