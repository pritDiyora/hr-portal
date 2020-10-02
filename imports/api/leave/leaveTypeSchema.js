import { Mongo } from 'meteor/mongo'
import { Number } from 'sugar';
Schemas = {};

const LeaveType = new Mongo.Collection('leavetype');

Schemas.LeaveType =  new SimpleSchema({
  leaveTypeName: {
    type: String
  },
  noOfDay: {
    type: String
  },
  isPaid: {
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

LeaveType.attachSchema(Schemas.LeaveType);

export default LeaveType;