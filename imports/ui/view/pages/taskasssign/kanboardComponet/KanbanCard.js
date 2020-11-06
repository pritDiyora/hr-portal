import React, { Component, PropTypes } from 'react';
import { th } from 'date-fns/locale';
class KanbanCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  render() {
    return (
      <div className="kanbanCard" style={{ borderLeft: `3px solid ${this.props.borderclassname}` }} draggable={true} onDragEnd={(e) => { this.props.onDragEnd(e, this.props.task); }}>
        <div className="description">{this.props.task.description}
          <br /></div>
        <div className="agile-detail">
          <i className="fa fa-clock-o"></i> {moment(this.props.task.taskDate).format("DD.MM.YYYY")}
          <a className="delete-icon" data-toggle="modal" onClick={(e) => this.props.updateTask(e, this.props.task._id)}><i className="fa fa-pencil update"></i></a>
          <a className="delete-icon" data-toggle="modal" onClick={(e) => this.props.deleteTask(e, this.props.task._id)}><i className="fa fa-trash update"></i></a>
        </div>
      </div>
    );
  }
}
export default KanbanCard;
