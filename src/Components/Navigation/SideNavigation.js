import React from 'react';
import './SideNavigation.css';
import {Link} from 'react-router-dom';

class SideNavigation extends React.Component{
    render(){
        return(
<div className="col-lg-2 side-main text-left">
         
{/* sidenav title  */}
          <div className="side-main-title">
            <div className="col-lg-4"> <img src="/images/user_white.png" className="img-responsive"/></div>
            <div className="col-lg-8">
                <span>
                    <p className="side-main-title-head">ADMIN</p>
                    <i style={{display:"flex"}}><div className="side-main-title-status"></div>&nbsp;&nbsp;Online</i>
                </span>
            </div>
         </div>
{/* sidenav menu  */}
         <div className="side-main-menu">

              <div style={{marginTop:'30px'}}>
                  <div className="panel-heading" style={{cursor:'pointer'}} data-toggle="collapse" data-parent="#accordion" href="#collapse1" >
                      <h4 className="panel-title side-main-menu-title">
                        <a>Product</a>
                      </h4>
                  </div>
                  <div id="collapse1" className="panel-collapse collapse">
                          <ul className="side-main-menu-sub">
                              <li>
                                  <Link to="/allProducts">View all</Link>
                              </li>
                              <li>
                                  <Link to="/addProduct">Add</Link>
                              </li>
                          </ul>
                  </div>
              </div>
              <div>
                  <div className="panel-heading" style={{cursor:'pointer'}}  data-toggle="collapse" data-parent="#accordion" href="#collapse2">
                      <h4 className="panel-title side-main-menu-title">
                        <a>Categories</a>
                      </h4>
                  </div>
                  <div id="collapse2" className="panel-collapse collapse">
                    <ul className="side-main-menu-sub">
                                <li>
                                     <Link to="/allCatogories">View All</Link>
                                </li>
                    </ul>
                  </div>
              </div>
              <div>
                  <div className="panel-heading" style={{cursor:'pointer'}} data-toggle="collapse" data-parent="#accordion" href="#collapse3">
                      <h4 className="panel-title side-main-menu-title">
                          <a>Orders</a>
                      </h4>
                  </div>
                  <div id="collapse3" className="panel-collapse collapse">
                        <ul className="side-main-menu-sub">
                            <li><Link to="/purchaseDetail">View All</Link></li>
                            <li><Link to="/purchaseByProduct">By Product</Link></li>
                        </ul>
                  </div>
              </div>
              <div>
                  <div className="panel-heading" style={{cursor:'pointer'}}>
                      <h4 className="panel-title side-main-menu-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#">Users</a>
                      </h4>
                  </div>
                  <div id="collapse4" className="panel-collapse">
                  </div>
              </div>
                           
         </div>
      </div>
        );
    }
}
export default SideNavigation;
