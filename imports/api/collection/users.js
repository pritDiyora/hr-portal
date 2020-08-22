import SimpleSchema from 'simpl-schema';
Schemas = {};

Schemas.UserProfile = new SimpleSchema({
    userType: {
        type: String,
        allowedValues: ['admin', 'user', 'superadmin'],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    fatherName: {
        type: String,
    },
    motherName: {
        type: String,
        optional: true
    },
    gender: {
        type: String,
    },
    birthDate: {
        type: String,
    },
    officalEmailId: {
        type: String
    },
    phone: {
        type: String
    },
    alternatePhone: {
        type: String,
        optional: true
    },
    maritalStatus: {
        type: String,
    },
    designation: {
        type: String,
        optional: true
    },
    skill: {
        type: String, //comunication skill
        optional: true
    },
    identity: {
        type: String
    },
    profilePic: {
        type: String
    }
});

Schemas.UserAddress = new SimpleSchema({
    addressline1: {
        type: String,
    },
    addressline2: {
        type: String,
        optional: true
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    zipcode: {
        type: String,
    }
});
Schemas.UserEducation = new SimpleSchema({
    cousrseName: {
        type: String,
    },
    cousrseType: {
        type: String,// internal / external
    },
    instituteName: {
        type: String,
    },
    academicYear: {
        type: String
    },
    address: {
        type: Schemas.UserAddress,
        optional: true
    },
    certificate: {
        type: String
    }
});
Schemas.UserExperiance = new SimpleSchema({
    companyName: {
        type: String,
    },
    address: {
        type: Schemas.UserAddress,
        optional: true
    },
    workExpeience: {
        type: String,
    },
    startAt: {
        type: Date
    },
    endAt: {
        type: Date
    },
    technology: {
        type: String
    }
});

Schemas.User = new SimpleSchema({
    username: {
        type: String,
    },
    emails: {
        type: Array,
    },
    "emails.$": {
        type: Object,
        optional: true
    },
    "emails.$.address": {
        type: String,
    },
    "emails.$.verified": {
        type: Boolean,
        optional: true
    },
    password:
    {
        type: String,
    },
    profile: {
        type: Schemas.UserProfile,
        optional: false
    },
    education: {
        type: Schemas.UserEducation,
        optional: true
    },
    experiance: {
        type: Schemas.UserExperiance,
        optional: true
    },
    address: {
        type: Schemas.UserAddress,
        optional: true
    },
    currentAddress: {
        type: Schemas.UserAddress,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    joiningDate: {
        type: Date
    },
    outDate: {
        type: Date,
        optional: true,
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
        type: Date,
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
        type: Date,
        autoValue() {
            return this.userId;
        }
    }
});

// Schemas.User.messages({
//  "badEmail": "Email is invalid"
// });

Meteor.users.attachSchema(Schemas.User);


// accountDetails : {
// accountNO
// accountHolderName
// IFSCcode
// branchCode
// accountType
// }