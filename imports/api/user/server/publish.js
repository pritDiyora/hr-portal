import Country from '../../country/country';
import State from '../../states/states';
import Cities from '../../cites/cites';
if (Meteor.isServer) {

  Meteor.publish('CountryData', function () {
    return Country.find();
  })

  Meteor.publish('Statedata', function () {
    return State.find();
  })


  Meteor.publish('Statedata1', function (id) {
    return State.find({ countryId: id });
  })

  Meteor.publish('citydata', function (id) {
    return Cities.find({ stateId: id });
  })
}