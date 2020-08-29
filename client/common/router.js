import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import Header from '/imports/ui/view/layout/header.js';
import LeftSidemenu from '/imports/ui/view/layout/leftSidemenu.js';
import RightSidebar from '/imports/ui/view/layout/rightSidebar.js';
import Footer from '/imports/ui/view/layout/footer.js';
import MainLayout from '/imports/ui/view/layout/mainLayout.js';
import Login from '../../imports/ui/view/pages/login/login';
import MainLayout1 from '../../imports/ui/view/layout/mainLayout1.js';
import Dashboard1 from '/imports/ui/view/pages/dashboards/dashboard1.js';
import Register from '../../imports/ui/view/pages/register/register';
import AddHR from '../../imports/ui/view/pages/Users/addusers/Insertusers';
import ListUser from '../../imports/ui/view/pages/Users/listusers/listusers';
import SetPassword from '../../imports/ui/view/pages/setpassword/setpassword';

FlowRouter.route('/dashboard', {
    name: 'Dashboard1',
    action() {
        mount(MainLayout, {
            content() {
                return <Dashboard1 />
            }
        })
    }
})

FlowRouter.route('/insertuser', {
    name: 'AddHR',
    action() {
        mount(MainLayout, {
            content() {
                return <AddHR />
            }
        })
    }
})

FlowRouter.route('/', {
    name: 'Login',
    action() {
        if (!Meteor.userId()) {
            mount(MainLayout1, {
                content() {
                    return <Login />
                }
            })
        } else {
            FlowRouter.go('/dashboard')
        }
    }
})


FlowRouter.route('/register', {
    name: 'Register',
    action() {
        mount(MainLayout1, {
            content() {
                return <Register  />
            }
        })
    }
})

FlowRouter.route('/listuser', {
    name: 'listuser',
    action() {
        mount(MainLayout, {
            content() {
                return <ListUser />
            }
        })
    }
})


FlowRouter.route('/enrollAccount/:token', {
    name: 'enrollAccount',
    action() {
        mount(MainLayout1, {
            content() {
                return <SetPassword />
            }
        })
    }
})