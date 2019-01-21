import React from 'react';
import './Login.css';
class Login extends React.Component{
    render(){
        return(
            <div className="container-fluid login-main" >

            <div className="login-inner" >
                <h1 className="login-head">Login</h1>
                <form className="login-form">
                    <div className="input-group login-form-input">
                        <input id="email" type="text" class="form-control" name="email" placeholder="Email" required/>
                        <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>   
                    </div><br></br>
                    <div className="input-group login-form-input">
                        <input id="password" type="password" class="form-control" name="password" placeholder="Password" required/>
                        <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                    </div>
                    <button type="button" className="btn btn-primary btn-block login-btn">Login</button>
                </form>

            </div>
        </div>
        );
    }
}
export default Login;