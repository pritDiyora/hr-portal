import { Meteor } from 'meteor/meteor';
import '../imports/api/index';

Meteor.startup(() => {
    process.env.MAIL_URL = "smtp://meteor.email.2014%40gmail.com:P455w0rd2014@smtp.gmail.com:465/";
    // console.log("mailId", process.env);
 
    Accounts.urls.verifyEmail = function (token) {
        return Meteor.absoluteUrl('verify-email/' + token);
    };
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
        let resultuser = Accounts.createUser(options);
        console.log('reresultuser :: ', resultuser);
        Accounts.createUser(options);
    }
});
