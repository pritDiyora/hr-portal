import { Mongo } from 'meteor/mongo'
Schemas = {};

const GeneralSetting = new Mongo.Collection('GeneralSetting')

Schemas.GeneralSetting = new SimpleSchema({
  todayHrs: {
    type: Number,
  },
  weekHrs: {
    type: Number,
  },
  monthHrs: {
    type: Number,
  },
  overHrs: {
    type: Number,
  },
  monthlyLeave: {
    type: Number
  },
  CarryForwardLeave: {
    type: Number
  },
  yearlyLeave: {
    type: Number
  },
  fromTime: {
    type: String
  },
  toTime: {
    type: String
  },
  noOfLeave: {
    type: String
  },
  workDayOfMonth: {
    type: Number
  },
  isActive: {
    type: Boolean,
    defaultValue: true
  },
  createdAt: {
    type: Date,
    autoValue() {
      return new Date();
    },
    optional: true
  },
  createdBy: {
    type: String,
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
    },
    optional: true
  },
  modifiedAt: {
    type: Date,
    autoValue() {
      return new Date()
    },
    optional: true
  },
  modifiedBy: {
    type: String,
    autoValue() {
      return this.userId;
    },
    optional: true
  }
});

GeneralSetting.attachSchema(Schemas.GeneralSetting);

export default GeneralSetting;