import React,{Component,PropTypes} from 'react';
import { moment } from 'meteor/momentjs:moment';
export default class Footer extends Component {

  render(){
    return(
      <div className="footer">
        <div className="pull-right">
         
        </div>
        <div>
          <strong>Copyright</strong> Scaleteam Techonology PVT LTD © {moment().year()}
        </div>
      </div>
    )
  }
}
