
import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import '../../ui/polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from '../../ui/layout/App.js';
import * as serviceWorker from '../../ui/serviceWorker';

import { icons } from '../../ui/assets/icons/logo';

// import { Provider } from 'react-redux' // so why use?
// import store from '../../ui/store';

React.icons = icons
Meteor.startup(() => {
    render(<App />, document.getElementById('root'));
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();