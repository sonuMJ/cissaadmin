import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Switch , Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import AddProduct from './Components/Product/AddProduct';
import TopNavigation from './Components/Navigation/TopNavigation';
import SideNavigation from './Components/Navigation/SideNavigation';
import PurchaseDetails from './Components/Purchase/PurchaseDetails';
import ShowProduct from './Components/Product/ShowProduct';
import EditProduct from './Components/Product/EditProduct';
import PurchaseByProduct from './Components/Purchase/PurchaseByProduct';
import ShowCategory from './Components/Category/ShowCategory';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row App">
          <TopNavigation/>
          <SideNavigation/>
          <Switch>
            <Route path="/login" exact component= {Login} />
            <Route path="/editProduct/:id" component= {EditProduct} />
            <Route path="/allProducts" component= {ShowProduct} />
            <Route path="/allCatogories" component= {ShowCategory} />
            <Route path="/purchaseDetail" component= {PurchaseDetails} />
            <Route path="/purchaseByProduct" component= {PurchaseByProduct} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
