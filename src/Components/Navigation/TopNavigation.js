import React from 'react';
import './TopNavigation.css';

class TopNavigation extends React.Component{
    render(){
        return(
            <div className="top-nav container-fluid">
                <b className="top-nav-head"><img src="/images/logo.png" style={{padding:'5px'}} width="70" class="img-responsive" alt="Logo"/></b>
                <a className="top-nav-signout" href="#"><img src="/images/signout_white.png" width="45" class="img-responsive" alt="signout"/></a>
            </div>
        );
    }
}
export default TopNavigation;