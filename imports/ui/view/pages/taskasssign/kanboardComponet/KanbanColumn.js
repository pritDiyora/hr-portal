import React, { Component, PropTypes } from 'react';
import KanbanCard from './KanbanCard';
class KanbanColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ mouseIsHovering: false });
  }

  componentWillReceiveProps(nextProps) {
    this.state = ({ mouseIsHovering: false });
  }

  generateKanbanCards() {
    return this.props.tasks.slice(0).map((task) => {
      let borderclassname;
      if (task.status == "To-Do") {
        borderclassname = "#1c84c6";
      } else if (task.status == "InProgress") {
        borderclassname = "#f8ac59";
      } else if (task.status == "Completed") {
        borderclassname = "#1ab394";
      }
      return (
        <KanbanCard
          task={task}
          key={task._id}
          deleteTask={this.props.deleteTask}
          updateTask={this.props.updateTask}
          onDragEnd={this.props.onDragEnd}
          borderclassname={borderclassname}
        />
      );
    });
  }

  render() {
    const columnStyle = {
      'backgroundColor': (this.state.mouseIsHovering) ? '#d3d3d3' : '#fffff',
    };
    return (
      <div className="col-lg-4">
        <div className="kancolumn" style={columnStyle}
          onDragEnter={(e) => { this.setState({ mouseIsHovering: true }); this.props.onDragEnter(e, this.props.stage); }}
          onDragExit={(e) => { this.setState({ mouseIsHovering: false }); }}>
          <h3 className="description"> {this.props.name} ({this.props.tasks.length})</h3>
          <p className="small date"><i className="fa fa-hand-o-up"></i> Drag task between list</p>
          {this.generateKanbanCards()}
          <br />
        </div>
      </div>
    );
  }
}
export default KanbanColumn;
