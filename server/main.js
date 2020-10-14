import { Meteor } from 'meteor/meteor';
import '../imports/api/index';
import GeneralSetting from '../imports/api/generalsetting/generalsetting';
Meteor.startup(async () => {
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
    if (GeneralSetting.find().count() === 0) {
        let general = {
            todayHrs: 8,
            weekHrs: 44,
            monthHrs: 176,
            overHrs: 4,
            monthlyLeave: 1,
            CarryForwardLeave: 3,
            yearlyLeave: 12,
            fromTime: 10,
            toTime: 7,
        };
         GeneralSetting.insert(general);
    }
});
