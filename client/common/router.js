import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import Header from '/imports/ui/view/layout/header.js';
import LeftSidemenu from '/imports/ui/view/layout/leftSidemenu.js';
import RightSidebar from '/imports/ui/view/layout/rightSidebar.js';
import Footer from '/imports/ui/view/layout/footer.js';
import MainLayout from '../../imports/ui/view/layout/mainLayout.js';
import Login from '../../imports/ui/view/pages/login/login';
import MainLayout1 from '../../imports/ui/view/layout/mainLayout1.js';
import Dashboard1 from '/imports/ui/view/pages/dashboards/dashboard1.js';
import Registration from '../../imports/ui/view/pages/register/register';
import ChangePassword from '../../imports/ui/view/pages/changepassword/changePassword.js';

FlowRouter.route('/dashboard', {
    name: 'Dashboard1',
    action () {
        mount(MainLayout, {
            content() {
              return <Dashboard1 />
            }
        })
    }
})

FlowRouter.route('/', {
    name: 'Login',
    action () {
        mount(MainLayout1, {
            content() {
              return <Login />
            }
        })
    }
})


FlowRouter.route('/register', {
    name: 'Register',
    action () {
        mount(MainLayout1, {
            content() {
              return <Registration />
            }
        })
    }
})

FlowRouter.route('/changePassword', {
    name: 'ChangePassword',
    action () {
        mount(MainLayout, {
            content(){
                return <ChangePassword />
            }
        })
    }
})