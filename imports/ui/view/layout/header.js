import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Attendance from '../../../api/attendance/attendance';
import moment from 'moment';

class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			secondsElapsed: "",
			createdAt: this.props.createdAt,
			isLoading: false,
			show: true
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.checkInOutList !== this.props.checkInOutList) {
			this.setTiming();
		}
	}
	
	setTiming() {
		let chkInStatus = Meteor.user() && Meteor.user().profile.clockStatus;
		if (chkInStatus) {
			this.countdown = setInterval(() => {
				let { checkInOutList } = this.props;
				let dateTime = checkInOutList && checkInOutList.dateTime && moment(checkInOutList.dateTime).format("HH:mm:ss");
				let currentTime = moment().format("HH:mm:ss")
				this.setState({
					secondsElapsed: moment.utc(moment(currentTime, "HH:mm:ss").diff(moment(dateTime, "HH:mm:ss"))).format("HH:mm:ss")
				})
			}, 1000);
		} else {
			this.setState({
				secondsElapsed: '00:00:00'
			},() => {
				clearInterval(this.countdown);
			});
		}
	}
	toggleNavigation(e) {
		e.preventDefault();
		$("body").toggleClass("mini-navbar");
	}

	showMailNoti(e) {
		e.preventDefault();
		$('#dropdownNoti').toggleClass('open');
	}

	MsgNoti(e) {
		e.preventDefault();
		$('#dropdownMsgNoti').toggleClass('open');
	}
	logout(e) {
		e.preventDefault();
		Meteor.logout(() => {
			FlowRouter.go('/');
		});
	}

	clockInOut = () => {
		this.setState({
			isLoading: true
		})
		setTimeout(() => {
			this.setState({
				isLoading: false
			})
		}, 1000)
		let value = {
			userId: Meteor.userId(),
			isCheckIn: !Meteor.user().profile.clockStatus,
			dateTime: new Date()
		}
		Meteor.call('checkInOut', value);
	}

	render() {
		return (
			<div className="row border-bottom">
				<nav className="navbar navbar-static-top" role="navigation" style={{ 'marginBottom': '0' }}>
					<div className="navbar-header">
						<a className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
						<form role="search" className="navbar-form-custom" action="search_results.html">
							<div className="form-group">
								<input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search" />
							</div>
						</form>
					</div>
					<ul className="nav navbar-top-links navbar-right">
						{Meteor.userId() && <li>
							<span type="button" className="btn btn-primary" id="btnModal" onClick={this.clockInOut} disabled={this.state.isLoading} style={{fontSize:"12px"}}>
								{ this.state.isLoading 
									? <i className="fa fa-spinner fa-spin"></i> 
									: <>Clock In/Out <p className="no-margins" style={{fontSize:"10px"}}>{this.state.secondsElapsed}</p></>
								}
							</span>
						</li>}
						<li id="dropdownNoti" className="dropdown">
							<a className="dropdown-toggle count-info" data-toggle="dropdown" href="#" onClick={(e) => this.showMailNoti(e)}>
								<i className="fa fa-envelope"></i>
								<span className="label label-warning">16</span>
							</a>
							<ul className="dropdown-menu dropdown-messages">
								<li>
									<div className="dropdown-messages-box">
										<a href="profile.html" className="pull-left">
											<img alt="image" className="img-circle" src="img/a7.jpg" />
										</a>
										<div className="media-body">
											<small className="pull-right">46h ago</small>
											<strong>Mike Loreipsum</strong> started following <strong>Monica Smith</strong>. <br />
											<small className="text-muted">3 days ago at 7:58 pm - 10.06.2014</small>
										</div>
									</div>
								</li>
								<li className="divider"></li>
								<li>
									<div className="dropdown-messages-box">
										<a href="profile.html" className="pull-left">
											<img alt="image" className="img-circle" src="img/a4.jpg" />
										</a>
										<div className="media-body ">
											<small className="pull-right text-navy">5h ago</small>
											<strong>Chris Johnatan Overtunk</strong> started following <strong>Monica Smith</strong>. <br />
											<small className="text-muted">Yesterday 1:21 pm - 11.06.2014</small>
										</div>
									</div>
								</li>
								<li className="divider"></li>
								<li>
									<div className="dropdown-messages-box">
										<a href="profile.html" className="pull-left">
											<img alt="image" className="img-circle" src="img/profile.jpg" />
										</a>
										<div className="media-body ">
											<small className="pull-right">23h ago</small>
											<strong>Monica Smith</strong> love <strong>Kim Smith</strong>. <br />
											<small className="text-muted">2 days ago at 2:30 am - 11.06.2014</small>
										</div>
									</div>
								</li>
								<li className="divider"></li>
								<li>
									<div className="text-center link-block">
										<a href="mailbox.html">
											<i className="fa fa-envelope"></i> <strong>Read All Messages</strong>
										</a>
									</div>
								</li>
							</ul>
						</li>
						<li id="dropdownMsgNoti" className="dropdown">
							<a className="dropdown-toggle count-info" data-toggle="dropdown" href="#" onClick={(e) => this.MsgNoti(e)}>
								<i className="fa fa-bell"></i>  <span className="label label-primary">8</span>
							</a>
							<ul className="dropdown-menu dropdown-alerts">
								<li>
									<a href="mailbox.html">
										<div>
											<i className="fa fa-envelope fa-fw"></i> You have 16 messages
          								<span className="pull-right text-muted small">4 minutes ago</span>
										</div>
									</a>
								</li>
								<li className="divider"></li>
								<li>
									<a href="profile.html">
										<div>
											<i className="fa fa-twitter fa-fw"></i> 3 New Followers
          								<span className="pull-right text-muted small">12 minutes ago</span>
										</div>
									</a>
								</li>
								<li className="divider"></li>
								<li>
									<a href="grid_options.html">
										<div>
											<i className="fa fa-upload fa-fw"></i> Server Rebooted
          								<span className="pull-right text-muted small">4 minutes ago</span>
										</div>
									</a>
								</li>
								<li className="divider"></li>
								<li>
									<div className="text-center link-block">
										<a href="notifications.html">
											<strong>See All Alerts</strong>
											<i className="fa fa-angle-right"></i>
										</a>
									</div>
								</li>
							</ul>
						</li>
						<li>
							<a href="/changePassword">
								<i className="fa fa-key"></i>
							ChangePassword
						</a>
						</li>
						<li>
							<a href="#" onClick={(e) => this.logout(e)}>
								<i className="fa fa-sign-out"></i> Log out
          				</a>
						</li>
					</ul>
				</nav>
			</div>

		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('checkInOutList');
	return {
		checkInOutList: Attendance.findOne({ "userId": Meteor.userId() }, { sort: { "dateTime": -1 } })
	}
})(Header);

