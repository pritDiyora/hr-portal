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
        optional: true
    },
    motherName: {
        type: String,
        optional: true
    },
    gender: {
        type: String,
        optional: true
    },
    birthDate: {
        type: String,
        optional: true
    },
    officalEmailId: {
        type: String,
        optional: true
    },
    phone: {
        type: String,
        optional: true
    },
    alternatePhone: {
        type: String,
        optional: true
    },
    maritalStatus: {
        type: String,
        optional: true
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
        type: String,
        optional: true
    },
    profilePic: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        optional: true
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
        optional: true,
        type: String
    }
});
Schemas.UserExperiance = new SimpleSchema({
    companyName: {
        type: String,
        optional: true
    },
    address: {
        type: Schemas.UserAddress,
        optional: true
    },
    workExpeience: {
        type: String,
        optional: true
    },
    startAt: {
        type: Date,
        optional: true
    },
    endAt: {
        type: Date,
        optional: true
    },
    technology: {
        type: Array,
        optional: true
    },
    'technology.$': {
        type: String
    }
});

export default User = Meteor.users;
User.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});
User.allow({
    insert: () => true,
    update: () => true,
    remove: () => true
});
Schemas.User = new SimpleSchema({
    username: {
        type: String,
        optional:true
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
        defaultValue: false
    },
    password:
    {
        type: String,
        optional:true
    },
    profile: {
        type: Schemas.UserProfile,
        blackbox: true
    },
    education: {
        type: Array,
        optional:true
    },
    'education.$': {
        type: Schemas.UserEducation,
        optional: true,
        blackbox: true,
    },
    experiance: {
        type: Array,
        optional:true
    },
    'experiance.$': {
        type: Schemas.UserExperiance,
        optional: true,
        blackbox: true,
    },
    address: {
        type: Array,
        blackbox: true,
        optional: true,
    },
    'address.$': {
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
        type: Date,
        optional: true
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
        },
        optional:true
    },
    createdBy: {
        type: String,
        autoValue() {
            if (this.isInsert) {
                return this.userId;
            }
        },
        optional:true
    },
    modifiedAt: {
        type: Date,
        autoValue() {
            return new Date();
        },
        optional:true
    },
    modifiedBy: {
        type: String,
        autoValue() {
            return this.userId;
        },
        optional:true
    }
});

// Schemas.User.messages({
//  "badEmail": "Email is invalid"
// });


User.attachSchema(Schemas.User);

// accountDetails : {
// accountNO
// accountHolderName
// IFSCcode
// branchCode
// accountType
// }