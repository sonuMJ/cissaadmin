import React from 'react';
import './Loader.css';

class Loader extends React.Component{
    render(){
        return(
        <div className="loader-main">
            <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>

        )
    }
}
export default Loader;