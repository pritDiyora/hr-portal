import { Mongo } from 'meteor/mongo'
Schemas = {};

const Attendance = new Mongo.Collection('Attendance')

Schemas.Attendance =  new SimpleSchema({
  userId: {
    type: String
  },
  isCheckIn: {
    type: Boolean
  },
  date: {
    type: Date
  },
  dateTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    defaultValue: true
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  createdBy: {
    type: String,
  },
  modifiedAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  modifiedBy: {
    type: String,
  },
  
})

Attendance.attachSchema(Schemas.Attendance);

export default Attendance;