import { Mongo } from 'meteor/mongo'
Schemas = {};

const Holiday = new Mongo.Collection('holiday')

Schemas.Holiday =  new SimpleSchema({
  holidayname: {
    type: String
  },
  holidaydate: {
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

Holiday.attachSchema(Schemas.Holiday);

export default Holiday;