import { Mongo } from 'meteor/mongo';

schema = {}

const Cities = new Mongo.Collection('city');

schema.Cities = new SimpleSchema({
    countryId: {
        type: String
    },
    stateId: {
        type: String
    },
    cityName: {
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
Cities.attachSchema(schema.Cities);

export default Cities;
