import React,{Component,PropTypes} from 'react'
import ReactDOM,{render} from 'react-dom'
import Header from '/imports/ui/view/layout/header.js'
import LeftSidemenu from '/imports/ui/view/layout/leftSidemenu.js'
import Footer from '/imports/ui/view/layout/footer.js'
import RightSidebar from '/imports/ui/view/layout/rightSidebar.js'
import Themeconfig from '/imports/ui/view/layout/themeconfig.js'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()
export default class MainLayout extends Component{
  componentWillMount(){
    $("body").removeClass('gray-bg');
  }
  render(){
    return(
      	<div id="wrapper">
          <LeftSidemenu />

            <div id="page-wrapper" className="gray-bg">
               <Header />
                    
                  {this.props.content() }

              <Footer />
            </div>
          {/* <RightSidebar /> */}
        <Themeconfig />
      </div>
     )
  }
}
