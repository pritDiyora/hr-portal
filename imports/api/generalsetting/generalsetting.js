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
  isActive: {
    type: Boolean,
    defaultValue: true
  },
  createdAt: {
    type: Date,
    autoValue() {
      return new Date();
    }
  },
  createdBy: {
    type: String,
    autoValue() {
      if(this.isInsert){
        return this.userId;
      }
    }
  },
  modifiedAt: {
    type: Date,
    autoValue() {
      return new Date()
    }
  },
  modifiedBy: {
    type: String,
    autoValue() {
      return this.userId;
    }
  }
});

GeneralSetting.attachSchema(Schemas.GeneralSetting);

export default GeneralSetting;