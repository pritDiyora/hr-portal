import { Accounts } from "meteor/accounts-base";
import { SSR, Template } from 'meteor/meteorhacks:ssr';

Accounts.config({
    forbidClientAccountCreation: true,
    sendVerificationEmail: true
});
Accounts.emailTemplates.siteName = 'ScaleTeam';
Accounts.emailTemplates.from = 'ScaleTeam Techonolgy PVT LTD<hr@scale-team.com>';

//enroll
SSR.compileTemplate('enrollAccount', Assets.getText('verifyemail.html'));
Accounts.urls.enrollAccount = token => Meteor.absoluteUrl(`enrollAccount/${token}`);

Accounts.emailTemplates.enrollAccount = {
    subject() {
        return 'enroll Account';
    },

    html(createdUser, url) {
        let html = SSR.render('enrollAccount', {
            url: url, user: createdUser, text: "To Verify your Email visit following link"
        });
        return html;
    }
}
//reset
SSR.compileTemplate('resetpassword', Assets.getText('verifyemail.html'));

Accounts.urls.resetPassword = token => {
    console.log('New token generate :: ', token);
    console.log('url :: ', Meteor.absoluteUrl(`reset-password/${token}`));
    return Meteor.absoluteUrl(`reset-password/${token}`);
}
Accounts.onResetPasswordLink = (token) => {
    Session.set('reset-password', token)
}
Accounts.emailTemplates.resetPassword = {
    subject() {
        return 'To reset your password, simply click the link below';
    },
    html(user, url) {
        let html = SSR.render('resetpassword', {
            url: url, user, text: "To Reset Your Password"
        });
        return html;
    }
}
