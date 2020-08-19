import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import Header from '/imports/ui/view/layout/header.js';
import LeftSidemenu from '/imports/ui/view/layout/leftSidemenu.js';
import RightSidebar from '/imports/ui/view/layout/rightSidebar.js';
import Footer from '/imports/ui/view/layout/footer.js';
import MainLayout from '/imports/ui/view/layout/mainLayout.js';


import Dashboard1 from '/imports/ui/view/pages/dashboards/dashboard1.js';


FlowRouter.route('/', {
    name: 'Dashboard1',
    action () {
        mount(MainLayout, {
            content() {
              return <Dashboard1 />
            }
        })
    }
})
