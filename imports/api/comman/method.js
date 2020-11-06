import { Meteor } from 'meteor/meteor';
import Country from '../country/country';
import State from '../states/states';
import Cities from '../cites/cites';
import LeaveType from '../leave/leaveTypeSchema';
import User from '../user/users';
import Attendance from '../attendance/attendance';
import GeneralSetting from '../generalsetting/generalsetting';
import AdminAttendance from '../attendance/adminAttendance';
import Leave from '../leave/leaveScheme';
import Notification from '../notification/notification';
import Holiday from '../holiday/holidaySchema';
import Salary from '../salary/salarySchema';
import TaskAssign from '../taskassign/taskSchema';
if (Meteor.isServer) {
    Meteor.methods({
        //Add Country state and city 
        'addcountry': (cname, ccode) => {
            return Country.insert(
                { countryname: cname, countrycode: ccode }
            );
        },
        'addstate': (cid, sname) => {
            return State.insert({ countryId: cid, stateName: sname });
        },
        'addcity': (cid, sid, cityname) => {
            return Cities.insert({ countryId: cid, stateId: sid, cityName: cityname });
        },
        //Delete Country state and city 
        'deletecountry': (id) => {
            return Country.remove({ _id: id });
        },
        'deletestate': (id) => {
            return State.remove({ _id: id });
        },
        'deletecity': (id) => {
            return Cities.remove({ _id: id });
        },
        //Edit Country state and city 
        'updatecountry': (cname, ccode, id) => {
            return Country.update({ _id: id }, { $set: { countryname: cname, countrycode: ccode } })
        },
        'updatestatedata': (cid, sname, id) => {
            return State.update({ _id: id }, { $set: { countryId: cid, stateName: sname } })
        },

        'updatecitydata': (cid, sid, cityname, id) => {
            return Cities.update({ _id: id }, { $set: { countryId: cid, stateId: sid, cityName: cityname } })
        },
        //Search Country state and city 
        'searchcountry': (pipeline) => {
            return Promise.await(Country.rawCollection().aggregate(pipeline).toArray());
        },
        'searchState': (pipeline) => {
            return Promise.await(State.rawCollection().aggregate(pipeline).toArray());
        },
        'searchCity': (pipeline) => {
            return Promise.await(Cities.rawCollection().aggregate(pipeline).toArray());
        },
        //Count Country state and city 
        'countCountrydata': () => {
            return Country.find({}).count();
        },
        'countStatedata': () => {
            return State.find({}).count();
        },
        'countCitydata': () => {
            return Cities.find({}).count();
        },
        //Leave type
        'addleaveType': (leaveTypeName, noOfDay, ispaid) => {
            return LeaveType.insert({ leaveTypeName: leaveTypeName, noOfDay: noOfDay, isPaid: ispaid })
        },
        'updateLeaveType': (leaveTypeName, noofday, lid, ispaid) => {
            return LeaveType.update({ _id: lid }, { $set: { leaveTypeName: leaveTypeName, noOfDay: noofday, isPaid: ispaid } })
        },
        'updateIsPaid': (lid, ispaid) => {
            if (ispaid == true) {
                return LeaveType.update({ _id: lid }, { $set: { isPaid: false } })
            } else {
                return LeaveType.update({ _id: lid }, { $set: { isPaid: true } })
            }
        },
        'deleteLeaveType': (lid) => {
            return LeaveType.remove({ _id: lid });
        },
        'searchLeaveType': (pipeline) => {
            return Promise.await(LeaveType.rawCollection().aggregate(pipeline).toArray());
        },
        'countLeaveTypeData': () => {
            return LeaveType.find({}).count();
        },
        'searchAttendanceDate': (pipeline) => {
            return Promise.await(Attendance.rawCollection().aggregate(pipeline).toArray());

        },
        'countUserdata': () => {
            return User.find({}).count();
        },
        'countAttendancedata': (pipeline) => {

            return Promise.await(Attendance.rawCollection().aggregate(pipeline).toArray());
        },
        //general setting
        'updateHours': (todayHrs, weekHrs, monthHrs, overHrs, id) => {
            return GeneralSetting.update({ _id: id }, { $set: { todayHrs: todayHrs, weekHrs: weekHrs, monthHrs: monthHrs, overHrs: overHrs } })
        },

        //AdminAttendance
        'adminAttendance': (userIds, date) => {
            // date = moment().format("YYYY-MM-DD")
            return AdminAttendance.insert({ userIds: userIds, date: date })
        },
        'updateAdminAttendance': (userIds, id) => {
            return AdminAttendance.update({ _id: id }, { $set: { userIds: userIds } })

        },

        'updateGeneraleSetting': (generaleSetting, id) => {
            return GeneralSetting.update({ _id: id }, {
                $set: generaleSetting
            })
        },

        //leave
        'leaveApply': (leaveobj) => {
            return Leave.insert(leaveobj);
        },
        'searchLeave': (pipeline) => {
            return Promise.await(Leave.rawCollection().aggregate(pipeline).toArray());
        },
        'countLeaveData': () => {
            return Leave.find({}).count();
        },
        'getleavedate': () => {
            return Leave.find({}).fetch();
        },
        'updateLeaveApprove': (lid, approvebyname) => {
            return Leave.update({ _id: lid }, { $set: { isApprove: true, approveBy: approvebyname } })
        },
        'updateLeaveDecline': (lid, declinebyname) => {
            return Leave.update({ _id: lid }, { $set: { isApprove: false, approveBy: declinebyname } })
        },
        'LeaveApprove.Notification': (leaveApplyNotification) => {
            return Notification.insert(leaveApplyNotification)
        },
        'notificationCount': (id) => {
            return Notification.find({ receiverId: id, isRead: false }).count();
        },
        'statusReadable': (nid) => {
            return Notification.update({ _id: nid }, { $set: { isRead: true } });
        },

        //holiday 
        'addholiday': (holidayname, holidaydate) => {
            return Holiday.insert({ holidayname: holidayname, holidaydate: holidaydate });
        },
        'deleteholiday': (id) => {
            return Holiday.remove({ _id: id });
        },
        'updateholiday': (holidayname, holidaydate, id) => {
            return Holiday.update({ _id: id }, { $set: { holidayname: holidayname, holidaydate: holidaydate } })
        },
        'searchholiday': (pipeline) => {
            return Promise.await(Holiday.rawCollection().aggregate(pipeline).toArray());
        },
        'countHolidaydata': () => {
            return Holiday.find({}).count();
        },

        //salary
        'addsalary': (uid, totalsalary) => {
            return Salary.insert({ userId: uid, totalSalary: totalsalary });
        },
        'updatesalarydata': (uid, totalsalary, id) => {
            return Salary.update({ _id: id }, { $set: { userId: uid, totalSalary: totalsalary } })
        },
        'deletesalary': (id) => {
            return Salary.remove({ _id: id });
        },
        'searchSalary': (pipeline) => {
            return Promise.await(Salary.rawCollection().aggregate(pipeline).toArray());
        },
        'countSalarydata': () => {
            return Salary.find({}).count();
        },
        //Task
        'addTaskOfUser': (task) => {
            return TaskAssign.insert(task);
        },
        'updateTaskdata': (task, id) => {
            return TaskAssign.update({ _id: id }, { $set: task })
        },
        'deletetask': (id) => {
            return TaskAssign.remove({ _id: id });
        },
        'searchTask': (pipeline) => {
            return Promise.await(TaskAssign.rawCollection().aggregate(pipeline).toArray());
        },
        'countTaskdata': () => {
            return TaskAssign.find({}).count();
        },
        'updateStatusOfTasks': (id, draggedOverCol) => {
            return TaskAssign.update({ _id: id }, { $set: { status: draggedOverCol } });
        }
    })
}