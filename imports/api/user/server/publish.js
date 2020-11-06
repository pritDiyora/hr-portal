import { Meteor } from 'meteor/meteor';
import Country from '../../country/country';
import State from '../../states/states';
import Cities from '../../cites/cites';
import User from '../users';
import Attendance from '../../attendance/attendance';
import GeneralSetting from '../../generalsetting/generalsetting';
import AdminAttendance from '../../attendance/adminAttendance';
import LeaveType from '../../leave/leaveTypeSchema';
import Leave from '../../leave/leaveScheme';
import Notification from '../../notification/notification';
import Holiday from '../../holiday/holidaySchema';
import TaskAssign from '../../taskassign/taskSchema';
if (Meteor.isServer) {

  Meteor.publish('user', function () {
    return Meteor.users.find({});
  })

  Meteor.publish('checkInOutList', function () {
    return Attendance.find();
  })

  //all country data
  Meteor.publish('CountryData', function () {
    return Country.find();
  })

  //All state data
  Meteor.publish('Statedata', function () {
    return State.find();
  })

  //All City data
  Meteor.publish('Citydata', function () {
    return Cities.find();
  })

  //country wise state
  Meteor.publish('Statedata1', function (id) {
    return State.find({ countryId: id });
  })

  //state wise city
  Meteor.publish('citydata', function (id) {
    return Cities.find({ stateId: id });
  })


  Meteor.publish('updateprofile', function (id) {
    return User.find({ _id: id });
  })


  Meteor.publish('generaleSetting', function (id) {
    return GeneralSetting.find();
  })

  Meteor.publish('adminAttendanceData', function(){
    return AdminAttendance.find();
  })
  Meteor.publish('leaveType', function () {
    return LeaveType.find();
  })

  Meteor.publish('ListleaveApply', function () {
    return Leave.find();
  })

  Meteor.publish('userWiseLeave', function (id) {
    return Leave.find({ userId: id });
  })

  Meteor.publish('getTaskInfo', function () {
    return TaskAssign.find({});
  })

  Meteor.publish('notificationList', function () {
    return Notification.find({});
  })

  Meteor.publish('holiday', function() {
    return Holiday.find();
  })

}
