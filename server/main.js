import { Meteor } from 'meteor/meteor';
import '../imports/api/index';
import '../imports/api/methods/usermethods';
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
        let resultuser = Accounts.createUser(options);
        console.log('reresultuser :: ', resultuser);
    }

    S3.config = {
        key: 'AKIAIQZEI4RO6OSIZGQQ',
        secret: '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',
        bucket: 'apex-hr-portal',
        region: 'ap-south-1',
    };
});
