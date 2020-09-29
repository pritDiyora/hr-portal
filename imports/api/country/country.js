import { Mongo } from 'meteor/mongo';

schema = {}

const Country = new Mongo.Collection('country');

schema.Country = new SimpleSchema({
    countryname: {
        type: String
    },
    countrycode: {
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
Country.attachSchema(schema.Country);

export default Country;
