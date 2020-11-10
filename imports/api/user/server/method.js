import { Meteor } from 'meteor/meteor';
import Attendance from './../../attendance/attendance';
import User from '../users';
process.env.MAIL_URL = `smtp://superadmi12@gmail.com:prathana@smtp.gmail.com:587/`;
if (Meteor.isServer) {
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
                var user = User.findOne({ _id: userId });
                return Accounts._checkPassword(user, password);
            } else {
                return false;
            }
        },
        'insertUserProfile': (user) => {
            let userId = Accounts.createUser(user);
            Accounts.sendEnrollmentEmail(userId);
            return userId;

        },
        'adddressadd': (userid, address) => {
            return User.update({ _id: userid }, { $set: { address: address } });
        },
        'addeducation': (userid, educations) => {
            return User.update({ _id: userid }, { $set: { education: educations } });
        },
        'addexperiance': (userid, experi) => {
            return User.update({ _id: userid }, { $set: { experiance: experi } });
        },
        'userOldData': (id) => {
            return User.find({ _id: id });
        },
        'updateUserProfile': (userid, userProfile) => {
            return User.update({ _id: userid }, { $set: { 'emails.0.address': userProfile.email, profile: userProfile.profile } });
        },
        'checkInOut': (checkInOutData) => {
            if (Meteor.isServer) {
                if (Meteor.user()) {
                    let updateStatus = Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.clockStatus': checkInOutData.isCheckIn } });
                    return Attendance.insert(checkInOutData);
                } else {
                    throw new Meteor.Error('BAD', "You Don't have Permission to do this")
                }
            }
        },
        'searchUser': (pipeline) => {
            return Promise.await(User.rawCollection().aggregate(pipeline).toArray());
        },
        'deleteuser': (id) => {
            return User.remove({ _id: id });
        },
        'profilePicUploade': (userid, profileImageUrl,) => {
            return User.update({ _id: userid }, { $set: { 'profile.profilePic': profileImageUrl } });
        },


    })
}

