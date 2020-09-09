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
import Profile from '../../imports/ui/view/pages/profile/profile.js';
import Dashboard1 from '../../imports/ui/view/pages/dashboards/dashboard1.js';
import AddHR from '../../imports/ui/view/pages/Users/addusers/Insertusers';
import ListUser from '../../imports/ui/view/pages/Users/listusers/listusers';
import Countries from '../../imports/ui/view/pages/countries/countries';
import State from '../../imports/ui/view/pages/states/addstate';
import City from '../../imports/ui/view/pages/city/city';

// Accounts
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

FlowRouter.route('/profile', {
    name:'Profile',
    action () {
        mount(MainLayout, {
            content(){
                return <Profile />
            }
        })
    }
})
FlowRouter.route('/enrollAccount/:token', {
    name: 'enrollAccount',
    action: function (params) {
        mount(MainLayout1, {
            content() {
                return <ResetPassword />
            }
        })
        Session.set("resetpassword",params.token);
    }
})

//pages

FlowRouter.route('/dashboard', {
    name: 'Dashboard1',
    action: function() {
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
FlowRouter.route('/addcountry', {
    name: 'addcountry',
    action() {
        mount(MainLayout, {
            content() {
                return <Countries />
            }
        })
    }
})

FlowRouter.route('/addstate', {
    name: 'addstate',
    action() {
        mount(MainLayout, {
            content() {
                return <State />
            }
        })
    }
})
FlowRouter.route('/addcity', {
    name: 'addstate',
    action() {
        mount(MainLayout, {
            content() {
                return <City />
            }
        })
    }
})



