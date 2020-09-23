import { Meteor } from 'meteor/meteor';
import '../imports/api/index';
import Country from '../imports/api/country/country';
import State from '../imports/api/states/states';
// import S3 from 'aws-sdk/clients/s3';
Meteor.startup(async () => {
    process.env.MAIL_URL = `smtp://superadmi12@gmail.com:prathana@smtp.gmail.com:587/`;

    if (Meteor.users.find().count() === 0) {
        var options = {
            username: "Admin",
            email: "superadmin@admin.com",
            password: '123456',
            profile: {
                userType: 'superadmin',
                firstName: 'Super',
                lastName: 'Admin',
                phone: '1234567890',
                designation: 'owner'
            }
        };
        Accounts.createUser(options);
    }
    
    S3.config = {
        key: 'AKIAIQZEI4RO6OSIZGQQ',
        secret: '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',
        bucket: 'apex-hr-portal',
        region: 'ap-south-1',
    };

    let countryIndexes = {
        countrycode: "text",
        countryname:"text"
    }
    let stateIndexes = {
        countryId: "text",
        stateName:"text"
    }
    await Country.rawCollection().dropIndexes();
    await State.rawCollection().dropIndexes();
    Country.rawCollection().createIndex(countryIndexes);
    State.rawCollection().createIndex(stateIndexes);

});
