import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import MainLayout from '../../imports/ui/view/layout/mainLayout.js';
import MainLayout1 from '../../imports/ui/view/layout/mainLayout1.js';
import Registration from '../../imports/ui/view/pages/register/register';
import Login from '../../imports/ui/view/pages/login/login';
import ForgotPassword from '../../imports/ui/view/pages/forgotPassword/forgotPassword.js';
import ResetPassword from '../../imports/ui/view/pages/resetPassword/resetPassword.js';
import ChangePassword from '../../imports/ui/view/pages/changepassword/changePassword.js';
import Dashboard1 from '../../imports/ui/view/pages/dashboards/dashboard1.js';
import AddHR from '../../imports/ui/view/pages/Users/addusers/Insertusers';
import ListUser from '../../imports/ui/view/pages/Users/listusers/listusers';

// Accounts
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
FlowRouter.route('/forgotPassword', {
    name: 'ForgotPassword',
    action() {
        mount(MainLayout1, {
            content() {
                return <ForgotPassword />
            }
        })
    }
})
FlowRouter.route('/reset-password/:token', {
    name: 'ResetPassword',
    action() {
        mount(MainLayout1, {
            content() {
                return <ResetPassword />
            }
        })
    }
})
FlowRouter.route('/changePassword', {
    name: 'ChangePassword',
    action() {
        mount(MainLayout, {
            content() {
                return <ChangePassword />
            }
        })
    }
})
FlowRouter.route('/enrollAccount/:token', {
    name: 'enrollAccount',
    action() {
        mount(MainLayout1, {
            content() {
                return <ResetPassword />
            }
        })
    }
})

//pages

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




