import './method';
import './publish';
import User from '../users'
import GeneralSetting from '../../generalsetting/generalsetting';
import Notification from '../../notification/notification';
import Attendance from '../../attendance/attendance';
import { Promise } from "meteor/promise";

if (Meteor.isServer) {
  var CronJob = require('cron').CronJob;
  var job = new CronJob('52 18 * * 1-6', function () {
    
    sendNotificationToUserForClockOut();
    console.log('You will see this message every minutes', new Date());
  }, null, true, 'America/Los_Angeles');
  job.start();

  async function sendNotificationToUserForClockOut() {
    let users = await User.find({ 'profile.clockStatus': true }, { fields: { 'profile.firstName': 1, 'profile.lastName': 1} }).fetch()
    let AdminId = User.findOne({ 'profile.userType': 'superadmin' })._id;
   
    if (users && users.length > 0) {
      return await users.map((user) => {
        let fullname = user.profile.firstName + " " + user.profile.lastName
        let userData = {
          title: fullname,
          description: 'Reminder for  clockout',
          sendId: AdminId,
          receiverId: [user._id],
          type: 'ReminderForColckout',
          createdAtDate: new Date(),
          createdBy: AdminId,
          modifiedBy: AdminId
        }
        let sendNoti = Notification.insert(userData);
        console.log('notification :: ', sendNoti);
      })
    }
  }
  var CronJob = require('cron').CronJob;
  var job = new CronJob('54 18 * * 1-6', function () {
    autometicallyClockout();
    console.log('You will see this message every minutes', new Date());
  }, null, true, 'America/Los_Angeles');
  job.start();

  async function autometicallyClockout(){
    let users = await User.find({ 'profile.clockStatus': true }, { fields: { 'profile.clockStatus': 1 } }).fetch()
    if(users && users.length > 0) {
      return await users.map((user) => {
        let clockStatus = user.profile.clockStatus
        if (clockStatus == true) {
          let updateStatus = User.update({ _id: user._id }, { $set: { 'profile.clockStatus': !user.profile.clockStatus } });
          console.log('updateStatus :: ', updateStatus);
          let attendanceData = {
            userId: user._id,
            isCheckIn: !user.profile.clockStatus,
            dateTime: new Date(),
            date: moment().format("YYYY-MM-DD"),
            createdBy: user._id,
            modifiedBy: user._id
          }
          return Attendance.insert(attendanceData);
        }
      })
    }
  }
  // let officeTime = GeneralSetting.findOne({ 'isActive': true }, { fields: { 'to': 1 } })
  // console.log('officeTime :: ', officeTime);
}
