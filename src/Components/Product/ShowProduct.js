import React from 'react';
import {Link} from 'react-router-dom'
import './ShowProduct.css';
import AddProduct from './AddProduct';


class ShowProduct extends React.Component{
    state = {
        products: [],
        isFetching: false,
        currentPage: 1,
        itemsPerPage: 7
    }
    componentDidMount(){
        this.fetchProducts();
    }
    fetchProducts(){
        this.setState({
            isFetching: true,
            products:{}
        });
        fetch("/api/product/getall")
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetching:false,
                products: result
            });
        }).catch((err) => console.log(err));
    }
    onSearchChange(event){
        var search = event.target.value;
        console.log('====================================');
        console.log(search);
        console.log('====================================');
        if(search == ""){
            this.setState({
                isFetching: false
            });
            setTimeout(()=>{
                this.fetchProducts();
            },1000);

        }
        else{
            this.setState({
                isFetching: true,
                products:[]
            });
            fetch('/api/product/search', {
                method: 'POST',
                body:JSON.stringify({'search_query': search}),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(result => {
                this.setState({
                    isFetching: false,
                    products: result
                });
            })
            .catch(e => console.log(e));
        }
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    render(){

            const {products,currentPage,itemsPerPage} = this.state;
            const lastIndex = currentPage*itemsPerPage;
            const firstIndex = lastIndex - itemsPerPage;
            var currentItemList = Object.entries(products).slice(firstIndex,lastIndex);
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
              pageNumbers.push(i);
            }
            console.log('====================================');
            console.log(firstIndex);
            console.log(lastIndex);
            console.log(currentPage);
            console.log(currentItemList);
            console.log('====================================');
            const renderPageNumbers = pageNumbers.map(number => {
                return (
                  <li><a
                    key={number}
                    id={number}
                    onClick={this.onPageChange.bind(this)}
                  >
                    {number}
                  </a>
                  </li>
                );
              });
        return(
            <React.Fragment>
                <div className="col-lg-10" style={{height: "100vh"}}>
                <div className="container text-center showProduct-topPanel">    
                    <form class="row">
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4">
                            <button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary btn-block ">Add Product</button>
                        </div>
                        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-8">
                            <input type="text" className="form-control" onChange={(e)=>{this.onSearchChange(e)}} placeholder="Search..." autoFocus={true}/>
                        </div>
                    </form>              
                </div>
                <table className="table table-hover table-bordered table-responsive print" style={{marginTop:'30px'}}>
                    <tbody>

                    <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                        <th>Product Id</th>
                        <th>Thumb</th>
                        <th>Name</th>
                        <th>Translated</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>In stock</th>
                        <th>Availability</th>
                        <th>Action</th>
                    </tr>
                    {
                        Object.keys(currentItemList).map((item) => {
                            return(
                                <ProductRow data={currentItemList[item][1]} context={this} key={currentItemList[item][1].product_id}/>
                            )
                        })
                    }
                    </tbody>
                </table>
                <ul class="page-numbers pagination">
                     {renderPageNumbers}
                </ul>
                </div>
                <div class="modal fade" id="myModal" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <AddProduct context={this}/>
                            </div>
                        </div>
                </div>
            </React.Fragment>
        );
    }
}
const ProductRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td>{props.data.product_id}</td>
            <td>
                <img src={props.data.img_url} width="50px" height="50px"/>
            </td>
            <td>{props.data.name}</td>
            <td>{props.data.translated}</td>
            <td>{props.data.category_name}</td>
            <td>{props.data.price}</td>
            <td>{props.data.quantity}</td>
            <td>
                <label class="switch" >
                    {/* <input type="checkbox" '+ a_status +' onchange=changeAvailability(event,this,'+ i.id +') /> */}
                    <input type="checkbox" defaultChecked={Boolean(props.data.availability==="true"?1:0)} onChange={(e)=>{
                        changeAvailability(e,props.data.product_id)
                        }} />
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <div className="row text-left">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div style={{float:'right'}}>
                                <Link to={"/editProduct/"+props.data.product_id}><img src="/images/edit.png" className="showProduct-imgBtn"></img></Link>
                                <p>Edit</p>
                            </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <img src="/images/delete.png" className="showProduct-imgBtn" onClick={()=>{
                            deleteProduct(props.data.product_id);
                            setTimeout(()=>{props.context.fetchProducts();},500);
                            }}></img>
                            <p>Delete</p>
                        </div>
                </div>


            </td>

        </tr>
    );
    function deleteProduct(id){
        alert(id);
        var confirmDel = window.confirm("Are you sure ?");
        if(confirmDel){
            fetch("/api/product/"+id,{
              method:'DELETE'
            })
            .then(res => res.json())
            .then(result => {
            })
            .catch(e => console.log(e))
        }else{
    
        }
    }
    function changeAvailability(e,id){
        console.log("Availibility changed to "+ e.target.checked);
        
        fetch("/api/product/availability/"+id,{
            method:'PUT',
            body:JSON.stringify({status:e.target.checked}),
            headers:{
              "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
            alert(result.message);
        })
        .catch(e => console.log(e));
    }
}

export default ShowProduct;
