import { Mongo } from 'meteor/mongo';

schema = {}

const Salary = new Mongo.Collection('salary');

schema.Salary = new SimpleSchema({
    userId: {
        type: String
    },
    
    totalSalary : {
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
Salary.attachSchema(schema.Salary);

export default Salary;
