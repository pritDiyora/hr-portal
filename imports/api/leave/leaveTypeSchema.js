import { Mongo } from 'meteor/mongo'
Schemas = {};

const LeaveType = new Mongo.Collection('leavetype');

Schemas.LeaveType =  new SimpleSchema({
  leaveTypeName: {
    type: String
  },
  noOfDay: {
    type: Number
  },
  isPaid: {
    type: Boolean,
    defaultValue: false
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

LeaveType.attachSchema(Schemas.LeaveType);

export default LeaveType;