import {Mongo} from 'meteor/mongo'
Schemas = {} ;
const AdminAttendance = new Mongo.Collection('AdminAttendance');

Schemas.AdminAttendance = new SimpleSchema({
  userIds: {
    type: Array
  },
  'userIds.$': {
    type: String
  },
  date: {
    type: String,
    unique: true
  },
  isActive: {
    type: Boolean,
    defaultValue: true
  },
  createdAt: {
    type: Date,
    autoValue() {
      if(this.isInsert){
        return new Date();
      }
    }
  },
  createdBy: {
    type: String,
    autoValue(){
      if(this.isInsert){
        return this.userId;
      }
    }
  },
  modifiedAt: {
    type: Date,
    autoValue() {
      if(this.isInsert){
        return new Date();
      }
    }
  },
  modifiedBy: {
    type: String,
    autoValue(){
      if(this.isInsert){
        return this.userId;
      }
    }
  }
})

AdminAttendance.attachSchema(Schemas.AdminAttendance);

export default AdminAttendance;
