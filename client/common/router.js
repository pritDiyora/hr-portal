import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import MainLayout from '../../imports/ui/view/layout/mainLayout.js';
import Login from '../../imports/ui/view/pages/login/login';
import MainLayout1 from '../../imports/ui/view/layout/mainLayout1.js';
import Dashboard1 from '/imports/ui/view/pages/dashboards/dashboard1.js';
import Registration from '../../imports/ui/view/pages/register/register';
import ForgotPassword from '../../imports/ui/view/pages/forgotPassword/forgotPassword.js';
import ResetPassword from '../../imports/ui/view/pages/resetPassword/resetPassword.js';
import ChangePassword from '../../imports/ui/view/pages/changepassword/changePassword.js';

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

FlowRouter.route('/', {
    name: 'Login',
    action() {
        mount(MainLayout1, {
            content() {
                return <Login />
            }
        })
    }
})


FlowRouter.route('/register', {
    name: 'Register',
    action() {
        mount(MainLayout1, {
            content() {
                return <Registration />
            }
        })
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