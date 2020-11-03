import { Mongo } from 'meteor/mongo';

schema = {}

const Taskassign = new Mongo.Collection('taskassign');

schema.Taskassign = new SimpleSchema({
    userId: {
        type: String
    },
    dateTime: {
        type: Date
    },
    status: {
        type: String,
    },
    description: {
        type: String
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
            if (this.isInsert) {
                return this.userId;
            }
        }
    },
    modifiedAt: {
        type: Date,
        autoValue() {
            return new Date();

        }
    },
    modifiedBy: {
        type: String,
        autoValue() {
            return this.userId;
        }
    }
});
Taskassign.attachSchema(schema.Taskassign);

export default Taskassign;
