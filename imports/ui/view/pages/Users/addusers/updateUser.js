import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddHR from './Commanfield';
class UpdateUser extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <form id="updateUser">
                    <AddHR flag={1} />
                </form>
            </div>
        );
    }
}
export default UpdateUser;