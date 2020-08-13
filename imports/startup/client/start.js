import React from 'react';
import { render } from 'react-dom';
import { Meteor } from  'meteor/meteor';
import index from '../../ui/containers/index';
Meteor.startup(() => {
    render(index , document.getElementById('root'));
});
