import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

    process.env.MAIL_URL = `smtp://superadmi12@gmail.com:prathana@smtp.gmail.com:587/`;
    Meteor.methods({

        insertuser(user) {
            let userId = Accounts.createUser(user);
            return Accounts.sendEnrollmentEmail(userId);
       
        }
    });
});