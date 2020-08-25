Meteor.methods({
    'registerUser': (data) => {
        check(data, Object);
        if (Meteor.isServer) {
            try {
                let res = Accounts.createUser(data);
                // send verification email
                return res;
            } catch (err) {
                throw new Meteor.Error(200, err);
            }
        }
    }
})