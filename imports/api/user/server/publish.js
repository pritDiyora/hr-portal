import { Meteor } from 'meteor/meteor';
import Country from '../../country/country';
import State from '../../states/states';
import Cities from '../../cites/cites';
import User from '../users';
import Attendance from '../../attendance/attendance';
import GeneralSetting from '../../generalsetting/generalsetting';
if (Meteor.isServer) {

  Meteor.publish('user', function () {
    return Meteor.users.find({ _id: this.userId });
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


  Meteor.publish('hoursData', function (id) {
    return GeneralSetting.find();
  })


}
