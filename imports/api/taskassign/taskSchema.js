import { Mongo } from 'meteor/mongo';

schema = {}

const TaskAssign = new Mongo.Collection('TaskAssign');

schema.TaskAssign = new SimpleSchema({
    userId: {
        type: String
    },
    taskDateTime: {
        type: Date
    },
    taskDate: {
        type: String
    },
    status: {
        type: String,
        defaultValue: "To-Do"
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
TaskAssign.attachSchema(schema.TaskAssign);

export default TaskAssign;
