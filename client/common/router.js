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
import InsertUser from '../../imports/ui/view/pages/Users/addusers/insertUser';
import UpdateUser from '../../imports/ui/view/pages/Users/addusers/updateUser';
import ListUser from '../../imports/ui/view/pages/Users/listusers/listusers';
import EmployeeAttendance from '../../imports/ui/view/pages/attendance/employeeAttendance.js';
import Countries from '../../imports/ui/view/pages/countries/countries';
import State from '../../imports/ui/view/pages/states/addstate';
import City from '../../imports/ui/view/pages/city/city';
import GeneralSetting from '../../imports/ui/view/pages/generalsetting/generalSetting.js';
import NotFoundPage from '../../imports/ui/view/pages/notFoundPage/NotFoundPage';
import AccessPermissionPage from '../../imports/ui/view/pages/accessPermissionPage/AccessPermissionPage';
import LeaveType from '../../imports/ui/view/pages/leave/leaveType';
import ApplyLeave from '../../imports/ui/view/pages/leave/leave';
import WrapperDate from '../../imports/ui/view/layout/wrapperDate';
import LeaveApproveList from '../../imports/ui/view/pages/leave/leaveApproveListing';
const accessRoute = [
    { routeName: 'listuser', roles: ['superadmin', 'admin'] },
    { routeName: 'insertuser', roles: ['superadmin', 'admin'] },
    { routeName: 'country', roles: ['superadmin', 'admin'] },
    { routeName: 'state', roles: ['superadmin', 'admin'] },
    { routeName: 'city', roles: ['superadmin', 'admin'] },
    { routeName: 'leaveType', roles: ['superadmin', 'admin'] },
    { routeName: 'leaveApproveList', roles: ['superadmin', 'admin'] }
]

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
FlowRouter.route('/enrollAccount/:token', {
    name: 'enrollAccount',
    action: function (params) {
        mount(MainLayout1, {
            content() {
                return <ResetPassword />
            }
        })
        Session.set("resetpassword", params.token);
    }
})
//pages
FlowRouter.route('/profile', {
    name: 'Profile',
    action() {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            mount(MainLayout, {
                content() {
                    return <Profile />
                }
            })
        }
    }
})
FlowRouter.route('/dashboard', {
    name: 'Dashboard1',
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            mount(MainLayout, {
                content() {
                    return <Dashboard1 />
                }
            })
        }
    }
})
FlowRouter.route('/listuser', {
    name: 'listuser',
    action() {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <ListUser />
                }
            })
        }
    }
})
FlowRouter.route('/insertuser', {
    name: 'insertuser',
    action() {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <InsertUser />
                }
            })
        }
    }
})
FlowRouter.route('/updateuser/:_id', {
    name: 'updateuser',
    action: function (params) {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <UpdateUser />
                }
            })
        }
    }
})
FlowRouter.route('/country', {
    name: 'country',
    action() {

        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <Countries />
                }
            })
        }
    }
})
FlowRouter.route('/employeeAttendance', {
    name: 'EmployeeAttendance',
    action() {
        // if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <EmployeeAttendance />
                }
            })
        // }
    }
})
FlowRouter.route('/state', {
    name: 'state',
    action() {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <State />
                }
            })

        }
    }
})
FlowRouter.route('/city', {
    name: 'city',
    action() {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <City />
                }
            })
        }
    }
})
FlowRouter.route('/leaveType', {
    name: 'leaveType',
    action() {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <LeaveType />
                }
            })
        }

    }
});
FlowRouter.route('/leave', {
    name: 'leave',
    action() {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <ApplyLeave />
                }
            })
        }

    }
});
FlowRouter.route('/leaveApproveList', {
    name: 'leaveApproveList',
    action() {
        if (requiredLogin()) {
            mount(MainLayout, {
                content() {
                    return <LeaveApproveList />
                }
            })
        }

    }
});
// 400 Access Permission
FlowRouter.route('/accesspermission', {
    name: 'accesspermission',
    action() {
        mount(MainLayout1, {
            content() {
                return <AccessPermissionPage />
            }
        })
    }
});
this.AccessPermission = function (routeName) {
    if (!routeName) {
        return true;
    }
    if (!accessRoute || accessRoute === 0) {
        return true;
    }
    let accessRouteItem = _.find(accessRoute, function (item) {
        return item.routeName == routeName
    })
    if (!accessRouteItem) {
        return true;
    }
    let user = JSON.parse(localStorage.getItem('user')) || {};
    if (!user || !user.profile || !user.profile.userType) {
        return false;
    }
    var usertype = user && user.profile && user.profile.userType;

    var allowRoles = accessRouteItem.roles;
    var granted = _.intersection(allowRoles, [usertype])

    if (!granted || granted.length === 0) {
        return false;
    }
    return true;
}

function requiredLogin() {
    if (Meteor.userId()) {
        if (AccessPermission(FlowRouter.current().route.name)) {
            return true;
        } else {
            FlowRouter.go('/accesspermission')
        }
    } else {
        FlowRouter.go('/');
    }
}

//404 Not Found Page
FlowRouter.notFound = {
    name: 'NotFoundPage',
    action() {
        mount(MainLayout1, {
            content() {
                return <NotFoundPage />
            }
        })
    }
}

FlowRouter.route('/generalSetting', {
    name: 'GeneralSetting',
    action() {
        mount(MainLayout, {
            content() {
                return <GeneralSetting />
            }
        })
    }
})

FlowRouter.route('/WrapperDate', {
    name: 'Date',
    action() {
        mount(MainLayout, {
            content() {
                return <WrapperDate />
            }
        })
    }
})
