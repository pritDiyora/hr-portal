import React, { Component, PropTypes } from 'react';
import IboxTools from '../../layout/iboxTools';
import Avatar from 'react-avatar';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Pagination from "react-js-pagination";
import { toast } from 'react-toastify';
import User from '../../../../api/user/users';
import { addWeeks } from 'date-fns';
class Dashboard1 extends Component {
	constructor(props) {
		super(props)
		this.state = {
			displayedAdminAttendance: [],
			displayedTask: [],
			pageLength: 10,
			currentPage: 1,
			totalpage: 0
		}
	}
	componentDidMount() {
		this.getAdminAttendance()
		this.getTaskData()
	}

	showhandle(event) {
		this.setState({
			currentPage: 1,
			pageLength: parseInt(event.target.value)
		}, () => {
			this.getTaskData();
		})
	}
	handlePageChange(pageNumber) {
		const currentPage = pageNumber;
		const totalpage = pageNumber;
		this.setState({
			currentPage, totalpage
		}, () => {
			this.getTaskData();
		});
	}

	getTaskData() {
		const self = this;
		let pipeline = [
			{
				'$lookup': {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: "username"
				}
			},
			{ "$unwind": "$username" },
			{
				"$match": { "taskDate": moment().format("YYYY/MM/DD") }
			},
			{ "$skip": (this.state.currentPage - 1) * this.state.pageLength },
			{ "$limit": this.state.pageLength },
		];
		Meteor.call("searchTask", pipeline, function (err, res) {
			if (!err) {
				Meteor.call("countTaskdata", res, function (err1, res1) {
					if (!err) {
						self.setState({ totalpage: res1 });
					}
				})
				self.setState({ displayedTask: res });
			} else {
				toast.error(err.message);
			}
		});

	}
	getAdminAttendance() {
		const self = this;
		let pipeline = [
			{
				'$lookup': {
					from: 'users',
					localField: 'userIds',
					foreignField: '_id',
					as: "username"
				}
			},
			{ "$unwind": "$username" },
			{
				"$match": { "date": moment().format("YYYY/MM/DD") }
			},
		];
		Meteor.call('searchAdminAttendance', pipeline, function (err, res) {
			if (!err) {
				self.setState({ displayedAdminAttendance: res })
			} else {
				toast.error(err.message);
			}
		})
	}

	render() {
		let { displayedTask, displayedAdminAttendance } = this.state;
		// console.log('displayedTask :: ', displayedTask);
		return (
			<div className="wrapper wrapper-content ">
				<div className="row">
					<div className="col-lg-12">
						<div className="col-md-6">
							<div className="ibox">
								<div className="ibox-title">
									<h5>Today Present</h5>
									<IboxTools />
								</div>
								<div className="ibox-content scrollbar">
									{displayedAdminAttendance.map((admin, i) => {
										let firstname = admin.username.profile.firstName + ' ' + admin.username.profile.lastName
										let profilepic = admin.username.profile.profilePic;
										let profilephoto = `${Meteor.absoluteUrl()}cfs/files/images/${profilepic}`;
										return (
											<div className="ibox dashboard" key={i}>
												<div className="ibox-content-notification" style={{ height: "75px" }}  >
													<div className="col-md-12">
														<a className="pull-left">
															{profilepic == "undefined"
																? <Avatar src={firstname} className="img-circle" size="45" color="#ffcccc" fgColor="#990000" name={firstname} maxInitials={2} />
																: <img src={profilephoto} className="img-circle" height="50" width="50" />
															}&nbsp;&nbsp;
														<label>{firstname}</label>
														</a>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="ibox">
								<div className="ibox-title">
									<h5>Today Absent</h5>
									<IboxTools />
								</div>
								<div className="ibox-content scrollbar">
									{this.props.users.map((user, i) => {
										let userid = displayedAdminAttendance.map((admin) => admin.userIds)
										let users = user._id
										let absent = userid.filter((id) => !users.includes(id));
										console.log('absent :: ', absent);
										
										let firstname = user.profile.firstName + ' ' + user.profile.lastName
										let profilepic = user.profile.profilePic;
										let profilephoto = `${Meteor.absoluteUrl()}cfs/files/images/${profilepic}`;
										return (
											<div className="ibox dashboard" key={i}>
												<div className="ibox-content-notification" style={{ height: "75px" }}  >
													<div className="col-md-12">
														<a className="pull-left">
															{profilepic == "undefined"
																? <Avatar src={firstname} className="img-circle" size="45" color="#ffcccc" fgColor="#990000" name={firstname} maxInitials={2} />
																: <img src={profilephoto} className="img-circle" height="50" width="50" />
															}&nbsp;&nbsp;
														<label>{firstname}</label>
														</a>
														<div className="rightside">
															<span><b>Leave Date</b></span>
															<h5>{moment().format("DD MMM YYYY")}</h5>
														</div>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-12">
						<div className="ibox">
							<div className="ibox-title">
								<h5>Today Task Statistics</h5>
								<IboxTools />
							</div>
							<div className="ibox-content">
								<div className="row text-center">
									<div className="col-sm-12" style={{ marginBottom: "15px" }}>
										<div className="col-sm-6" style={{ paddingLeft: "0px" }}>
											<div className="dataTables_length" id="example_length">
												<label className="dataTables_length text">Show <select name="example_length" value={this.state.pageLength}
													className="form-control" onChange={this.showhandle.bind(this)}>
													<option value="5">5</option>
													<option value="10">10</option>
													<option value="25">25</option>
													<option value="50">50</option>
													<option value="100">100</option>
												</select> entries</label>
											</div>
										</div>

									</div>
									<div className="container-fluid">
										<table className="table table-striped table-bordered table-hover dataTables-example dataTable " id="dataTables-example">
											<thead>
												<tr>
													<th>Employee Name</th>
													<th>Description</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{displayedTask.map((task, i) => {
													let fullName = task.username.profile.firstName + " " + task.username.profile.lastName
													return (
														<tr key={i}>
															<td>{fullName}</td>
															<td>{task.description}</td>
															<td>{task.status}</td>
														</tr>
													)
												})}
											</tbody>
										</table>
										<div style={{ textAlign: "right" }}>
											<Pagination
												activePage={this.state.currentPage}
												itemsCountPerPage={this.state.pageLength}
												totalItemsCount={this.state.totalpage}
												pageRangeDisplayed={5}
												onChange={this.handlePageChange.bind(this)} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('user');
	return {
		users: User.find({ 'profile.userType': { $in: ["admin", "employee"] } }).fetch(),
	}
})(Dashboard1)