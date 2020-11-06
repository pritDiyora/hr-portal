import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import KanbanColumn from './KanbanColumn';
class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isLoading: true,
      tasks: [],
      draggedOverCol: "",
    });
    this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.columnsOfTask = [
      { name: 'To-Do', stage: 'To-Do' },
      { name: 'In Progress', stage: 'InProgress' },
      { name: 'Completed', stage: 'Completed' },
    ];
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ tasks: nextProps.tasks, isLoading: false });
  }

  handleOnDragEnter(e, stageValue) {
    this.setState({
      draggedOverCol: stageValue
    });
  }

  handleOnDragEnd(e, task) {
    Meteor.call('updateStatusOfTasks', task._id, this.state.draggedOverCol);
    this.setState({ tasks: this.state.tasks });
  }

  render() {
    if (this.state.isLoading) {
      return (<h3>Loading...</h3>);
    }

    return (
      <div className="row">
        
          {this.columnsOfTask.map((column) => {
            let task = this.state.tasks.filter((task) => {
              return task.status == column.stage;
            });
            return (
              <KanbanColumn
                name={column.name}
                stage={column.stage}
                tasks={task}
                updateTask={this.props.updateTask}
                deleteTask={this.props.deleteTask}
                onDragEnter={this.handleOnDragEnter}
                onDragEnd={this.handleOnDragEnd}
                key={column.stage}
              />
            );
          })}
      </div>
    );
  }
}
export default KanbanBoard;
