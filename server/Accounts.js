import { Accounts } from "meteor/accounts-base";
import { SSR, Template } from 'meteor/meteorhacks:ssr';

Accounts.config({
    forbidClientAccountCreation: true,
    sendVerificationEmail: true
});
// Accounts.validateLoginAttempt((loginAttempt) => {
//     if (!loginAttempt.allowed) {
//         throw new Meteor.Error(901, loginAttempt.error.reason);
//     } else {
//         if (!loginAttempt.user) {
//             throw new Meteor.Error(903, informationMessages.notValidUser);
//         }
//         if (!loginAttempt.user.emails[0].verified) {
//             throw new Meteor.Error(902, informationMessages.emailVerifiedFirst);
//         }
//         // We have a correct login!
//         return true;
//     }
// });

//enroll
SSR.compileTemplate('enrollAccount', Assets.getText('verifyemail.html'));
Accounts.urls.enrollAccount =   token => Meteor.absoluteUrl(`enrollAccount/${token}`);

Accounts.emailTemplates.enrollAccount = {
    subject() {
        return 'enroll Account';
    },
    html(createdUser, url) {
        let html = SSR.render('enrollAccount', {
            url: url, user: createdUser,text: "To Verify your Email visit following link"
        });
        return html;
    }
}
//reset
SSR.compileTemplate('resetpassword', Assets.getText('verifyemail.html'));
Accounts.urls.resetpassword =   token => Meteor.absoluteUrl(`resetpassword/${token}`);

Accounts.emailTemplates.enrollAccount = {
    subject() {
        return 'resetpassword';
    },
    html(createdUser, url) {
        let html = SSR.render('resetpassword', {
            url: url, user: createdUser,text: "To Reset your your password"
        });
        return html;
    }
}
