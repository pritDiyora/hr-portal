import {Meteor} from 'meteor/meteor';
import Attendance from '../../attendance/attendance';

Meteor.publish('user', function(){
    return Meteor.users.find({_id: this.userId});
})

Meteor.publish('checkInOutList', function(){
    return Attendance.find();
})
