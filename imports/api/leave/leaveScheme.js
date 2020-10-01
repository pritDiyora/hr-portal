import { Mongo } from 'meteor/mongo'
Schemas = {};

const Leave = new Mongo.Collection('leave');

Schemas.Leave = new SimpleSchema({
    userId: {
        type: String
    },
    leaveType: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    reason: {
        type: String
    },
    isApprove: {
        type: String
    },
    declineReason: {
        type: String
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
    approveBy: {
        type: String
    },
})

Leave.attachSchema(Schemas.Leave);

export default Leave;