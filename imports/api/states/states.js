import { Mongo } from 'meteor/mongo';

schema = {}

const State = new Mongo.Collection('state');

schema.State = new SimpleSchema({
    countryId: {
        type: String
    },
    stateName : {
        type: String
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
State.attachSchema(schema.State);

export default State;
