import React,{Component,PropTypes} from 'react'
import ReactDOM,{render} from 'react-dom'

export default class Themeconfig extends Component{
  componentDidMount(){
    // Config box

    // Enable/disable fixed top navbar
    $('#fixednavbar').click(function (){
        if ($('#fixednavbar').is(':checked')){
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            $("body").removeClass('boxed-layout');
            $("body").addClass('fixed-nav');
            $('#boxedlayout').prop('checked', false);

        } else{
            $(".navbar-fixed-top").removeClass('navbar-fixed-top').addClass('navbar-static-top');
            $("body").removeClass('fixed-nav');
            $("body").removeClass('fixed-nav-basic');
            $('#fixednavbar2').prop('checked', false);

        }
    });

    // Enable/disable fixed top navbar
    $('#fixednavbar2').click(function (){
        if ($('#fixednavbar2').is(':checked')){
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            $("body").removeClass('boxed-layout');
            $("body").addClass('fixed-nav').addClass('fixed-nav-basic');
            $('#boxedlayout').prop('checked', false);

        } else {
            $(".navbar-fixed-top").removeClass('navbar-fixed-top').addClass('navbar-static-top');
            $("body").removeClass('fixed-nav').removeClass('fixed-nav-basic');
            $('#fixednavbar').prop('checked', false);
        }
    });

    // Enable/disable fixed sidebar
    $('#fixedsidebar').click(function (){
        if ($('#fixedsidebar').is(':checked')){
            $("body").addClass('fixed-sidebar');
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });


        } else{
            $('.sidebar-collapse').slimscroll({destroy: true});
            $('.sidebar-collapse').attr('style', '');
            $("body").removeClass('fixed-sidebar');
        }
    });

    // Enable/disable collapse menu
    $('#collapsemenu').click(function (){
        if ($('#collapsemenu').is(':checked')){
            $("body").addClass('mini-navbar');

        } else{
            $("body").removeClass('mini-navbar');
        }
    });

    // Enable/disable boxed layout
    $('#boxedlayout').click(function (){
        if ($('#boxedlayout').is(':checked')){
            $("body").addClass('boxed-layout');
            $('#fixednavbar').prop('checked', false);
            $('#fixednavbar2').prop('checked', false);
            $(".navbar-fixed-top").removeClass('navbar-fixed-top').addClass('navbar-static-top');
            $("body").removeClass('fixed-nav');
            $("body").removeClass('fixed-nav-basic');
            $(".footer").removeClass('fixed');
            $('#fixedfooter').prop('checked', false);
        } else{
            $("body").removeClass('boxed-layout');
        }
    });

    // Enable/disable fixed footer
    $('#fixedfooter').click(function (){
        if ($('#fixedfooter').is(':checked')){
            $('#boxedlayout').prop('checked', false);
            $("body").removeClass('boxed-layout');
            $(".footer").addClass('fixed');
        } else{
            $(".footer").removeClass('fixed');

        }
    });

    // SKIN Select
    $('.spin-icon').click(function (){
        $(".theme-config-box").toggleClass("show");
    });

    // Default skin
    $('.s-skin-0').click(function (){
      $("body").removeClass("skin-1 skin-2 skin-3 md-skin fixed-sidebar fixed-nav");
      $('.navbar').addClass('navbar-static-top').removeClass('navbar-fixed-top');
      $('.navbar-default').removeClass('ng-scope');

    });

    // Blue skin
    $('.s-skin-1').click(function (){
        $("body").addClass("skin-1");
        $("body").removeClass("skin-2 skin-3 md-skin fixed-sidebar fixed-nav");
        $('.navbar').addClass('navbar-static-top').removeClass('navbar-fixed-top');
        $('.navbar-default').removeClass('ng-scope');

    });

    // Inspinia ultra skin
    $('.s-skin-2').click(function (){
        $("body").addClass("skin-2");
        $("body").removeClass("skin-1 skin-3 md-skin fixed-sidebar fixed-nav");
        $('.navbar').addClass('navbar-static-top').removeClass('navbar-fixed-top');
        $('.navbar-default').removeClass('ng-scope');

    });

    // Yellow skin
    $('.s-skin-3').click(function (){
        $("body").removeClass("skin-1 skin-2 md-skin fixed-sidebar fixed-nav");
        $('.navbar').addClass('navbar-static-top').removeClass('navbar-fixed-top');
        $('.navbar-default').removeClass('ng-scope');
        $("body").addClass("skin-3");
    });


  }

  mdSkin(e){
    e.preventDefault();
    $('body').removeClass('skin-1 skin-2 skin-3').addClass('fixed-sidebar fixed-nav md-skin no-skin-config').prop("id","page-top");
    $('.navbar').addClass('navbar-fixed-top').removeClass('navbar-static-top');
    $('.navbar-default').addClass('ng-scope navbar-static-side');
    $('#wrapper').addClass('ng-scope');
  }
  
  skin2(e){
    e.preventDefault();
    $('.pace-done').removeClass('skin-1 skin-3 md-skin').addClass('skin-2');
  }

  skin3(e){
    e.preventDefault();
    $('.pace-done').removeClass('skin-2 skin-1 md-skin').addClass('skin-3');
  }

  render(){
    return(
      <div className="theme-config">
        <div className="theme-config-box">
            <div className="spin-icon">
                <i className="fa fa-cogs fa-spin"></i>
            </div>
            <div className="skin-settings">
                <div className="title">Configuration <br/>
                <small style={{'textTransform': 'none','fontWeight': '400'}}>
                    Config box designed for demo purpose. All options available via code.
                </small>
            </div>
                <div className="setings-item">
                        <span>
                            Collapse menu
                        </span>

                    <div className="switch">
                        <div className="onoffswitch">
                            <input type="checkbox" name="collapsemenu" className="onoffswitch-checkbox collapseMenu" id="collapsemenu"/>
                            <label className="onoffswitch-label" htmlFor="collapsemenu">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="setings-item">
                        <span>
                            Fixed sidebar
                        </span>

                    <div className="switch">
                        <div className="onoffswitch">
                            <input type="checkbox" name="fixedsidebar" className="onoffswitch-checkbox" id="fixedsidebar"/>
                            <label className="onoffswitch-label" htmlFor="fixedsidebar">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="setings-item">
                        <span>
                            Top navbar
                        </span>

                    <div className="switch">
                        <div className="onoffswitch">
                            <input type="checkbox" name="fixednavbar" className="onoffswitch-checkbox" id="fixednavbar"/>
                            <label className="onoffswitch-label" htmlFor="fixednavbar">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="setings-item">
                        <span>
                            Top navbar v.2
                            <br/>
                            <small>*Primary layout</small>
                        </span>

                    <div className="switch">
                        <div className="onoffswitch">
                            <input type="checkbox" name="fixednavbar2" className="onoffswitch-checkbox" id="fixednavbar2"/>
                            <label className="onoffswitch-label" htmlFor="fixednavbar2">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="setings-item">
                        <span>
                            Boxed layout
                        </span>

                    <div className="switch">
                        <div className="onoffswitch">
                            <input type="checkbox" name="boxedlayout" className="onoffswitch-checkbox" id="boxedlayout"/>
                            <label className="onoffswitch-label" htmlFor="boxedlayout">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="setings-item">
                        <span>
                            Fixed footer
                        </span>

                    <div className="switch">
                        <div className="onoffswitch">
                            <input type="checkbox" name="fixedfooter" className="onoffswitch-checkbox" id="fixedfooter"/>
                            <label className="onoffswitch-label" htmlFor="fixedfooter">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="title">Skins</div>
                <div className="setings-item default-skin">
                        <span className="skin-name ">
                             <a href="" className="s-skin-0" >
                                 Default
                             </a>
                        </span>
                </div>
                <div className="setings-item blue-skin">
                		<span className="skin-name ">
                			<a href="" className="s-skin-1">
                				Blue light
                			</a>
                		</span>
                </div>
                <div className="setings-item navy-skin">
                      <span className="skin-name ">
                          <a href="" className="s-skin-2" onClick={(e) => this.skin2(e)}>
                              Navy Blue
                          </a>
                      </span>
                </div>
                <div className="setings-item yellow-skin">
                        <span className="skin-name ">
                            <a href="" className="s-skin-3" >
                                Yellow/Purple
                            </a>
                        </span>
                </div>
                <div className="setings-item ultra-skin">
                        <span className="skin-name">
                            <a href="" className="md-skin" onClick={(e) => this.mdSkin(e)}>
                                Material Design
                            </a>
                        </span>
                </div>
            </div>
        </div>
    </div>
    )
  }
}
