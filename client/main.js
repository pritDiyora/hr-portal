import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import '../imports/ui/polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../imports/ui/App';
import * as serviceWorker from '../imports/ui/serviceWorker';

import { icons } from '../imports/ui/assets/icons/logo'

import { Provider } from 'react-redux'
import store from '../imports/ui/store'

React.icons = icons
var destination = document.querySelector("#root");

Meteor.startup(() => {
  ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, destination);

});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
