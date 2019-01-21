import React from 'react';
import {Link} from 'react-router-dom';

class ShowCategory extends React.Component{
    state = {
        categories: [],
        isFetching: true,
        currentPage: 1,
        itemsPerPage: 8
    }
    componentDidMount(){
        this.fetchCategories();
    }
    fetchCategories(){
        fetch("/api/category/getcategory")
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetching:false,
                categories: result
            });
            console.log('====================================');
            console.log(result);
            console.log('====================================');
        }).catch((err) => console.log(err));
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
    }
    addCategory(e)
    {
        e.preventDefault();
        var categoryForm = document.getElementById("addcategory");
        fetch("/api/category/send",{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(
                {
                    name: e.target.name.value
                }
            )
        })
        .then(res => res.json())
        .then(result => {
            categoryForm.reset();
        })
        .catch(e => console.log(e))
        setTimeout(()=>{this.fetchCategories()},200);
    }
    render(){
        const {categories,currentPage,itemsPerPage} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Object.entries(categories).slice(firstIndex,lastIndex);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(categories.length / itemsPerPage); i++) {
          pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li><a
                key={number}
                id={number}
                onClick={this.onPageChange.bind(this)}>
                {number}
              </a>
              </li>
            );
          });
        return(
            <React.Fragment>
                <div className="col-lg-10" style={{height: "100vh"}}>
                    <div className="container text-center showProduct-topPanel">    
                        <form onSubmit={this.addCategory.bind(this)} class="row" id="addcategory">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                               <input type="text" className="form-control" required name="name" id="usr" placeholder="Name"/>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-left">
                               <button type="submit" class="btn btn-primary">Add Category</button>
                            </div>
                        </form>              
                    </div>
                    <table className="table table-hover table-bordered table-responsive print" style={{marginTop:'30px'}}>
                            <tbody>
                            <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                <th>Name</th>
                                <th>Category Id</th>
                                <th>Action</th>
                            </tr>
                            {
                                Object.keys(currentItemList).map((item) => {
                                    return(
                                        <CategoryRow data={currentItemList[item][1]} context={this} key={currentItemList[item][1].product_id}/>
                                    )
                                })
                            }
                            </tbody>
                    </table>
                    <ul class="page-numbers pagination">
                            {renderPageNumbers}
                    </ul>
                </div>
            </React.Fragment>

        );
    }

    
}
const CategoryRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td style={{fontSize:'22px'}}>{props.data.name}</td>
            <td style={{fontSize:'16px'}}>{props.data.category_id}</td>
            <td>
                <div className="row " style={{marginTop:'-15px'}}>
                    <img src="/images/delete.png" className="showProduct-imgBtn" onClick={()=>{
                        deleteCategory(props.data.category_id);
                        setTimeout(()=>{props.context.fetchCategories();},100);
                    }}></img>
                    <p>Delete</p>
                </div>


            </td>

        </tr>
    );
    function deleteCategory(id){
        var confirmDel = window.confirm("Are you sure ?");
        if(confirmDel){
            fetch("/api/category/"+id,{
              method:'DELETE'
            })
            .then(res => res.json())
            .then(result => {
            })
            .catch(e => console.log(e))
        }else{
    
        }
    }
}
export default ShowCategory;

