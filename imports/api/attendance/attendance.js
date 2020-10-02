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
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
    }
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
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
    }
  },
  
})

Attendance.attachSchema(Schemas.Attendance);

export default Attendance;