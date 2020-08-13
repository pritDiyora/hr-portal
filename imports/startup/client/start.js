import React from 'react';
import { render } from 'react-dom';
import { Meteor } from  'meteor/meteor';
// import { TheLayout } from '../../ui/containers';
import TheLayout from '../../ui/containers/TheLayout'

Meteor.startup(() => {
    render(<TheLayout />, document.getElementById('root'));
});