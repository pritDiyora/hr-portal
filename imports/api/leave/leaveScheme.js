import { Mongo } from 'meteor/mongo'
import { tr } from 'date-fns/locale';
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
    idHalf: {
        type: Boolean,
        defaultValue: false
    },
    isApprove: {
        type: Boolean,
        defaultValue: null,
        optional: true
    },
    declineReason: {
        type: String,
        optional: true
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
        type: String,
        optional: true
    },
})

Leave.attachSchema(Schemas.Leave);

export default Leave;