import {Meteor} from 'meteor/meteor';

Meteor.publish('user', function(){
    return Meteor.users.find({_id: this.userId});
})