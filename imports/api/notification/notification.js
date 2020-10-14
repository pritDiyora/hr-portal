import { Mongo } from 'meteor/mongo'
Schemas = {};

const Notification = new Mongo.Collection('notification');

Schemas.Notification = new SimpleSchema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    sendId: {
        type: String,
        autoValue() {
            if (this.isInsert) {
                return this.userId;
            }
        }
    },
    receiverId: {
        type: String
    },
    type: {
        type: String
    },
    isRead: {
        type: Boolean,
        defaultValue: false
    },
    createdAtDate: {
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
        type: String,
        optional: true
    },
})

Notification.attachSchema(Schemas.Notification);

export default Notification;