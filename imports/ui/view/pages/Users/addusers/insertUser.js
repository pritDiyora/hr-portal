import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddHR from './Commanfield';
class InsertUser extends Component {
    render() {
      return (
        <div>
          <form id="insertUser">
            <AddHR flag={0} />
          </form>
        </div>
      );
    }
}
export default InsertUser;