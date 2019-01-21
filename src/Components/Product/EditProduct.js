import React from 'react'

class EditProduct extends React.Component{
    state={
        product : [],
        categories:"",
        categoryRow: [],
        isFetching : false
    }
    componentDidMount() {
        this.loadCategories();
        setTimeout(()=>{ this.loadProductByID(this.props.match.params.id);},200);
       
    }
    render(){
        return(
            <React.Fragment>
             { this.state.isFetching ? this.contentRenderer():null }
            </React.Fragment>
        );
    }
    contentRenderer(){
        var quantity = this.state.product[0].quantity.split(' ');
        return(
            <div className="col-lg-10 addProduct-main">
                  <div className="container text-left" >
                  <h3 >Edit Product</h3>
                  <form onSubmit={(e)=>{this.updateProduct(e,this.props.match.params.id)}} id="addproduct">
                    <div className="form-group">
                       <label for="pwd">Thumbnail:</label>
                    </div>
                    <div className="form-group">
                       <img src={this.state.product[0].img_url} width="100px" />
                       <input type="file" className="form-control-file border" name="file" accept="image/*"/>
                    </div>
                    <div className="form-group">
                        <label for="usr">Name:</label>
                        <input type="text" className="form-control" required name="name" id="usr" placeholder="Name" defaultValue={this.state.product[0].name} />
                    </div>
                    <div className="form-group">
                        <label for="usr">Regional translation:</label>
                        <input type="text" className="form-control" required name="translated" id="usr" placeholder="Transaltion"defaultValue={this.state.product[0].translated} />
                    </div>
                    <div className="form-group">
                        <label for="usr">Category:</label>
                        <div>
                            <select className="purchaseDetails-select" name="category"  placeholder="Category" defaultValue={this.state.product[0].category_name}>
                                {this.state.categoryRow}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="pwd">Price:</label>
                        <input type="text" className="form-control" required name="price" id="pwd" placeholder="Price"defaultValue={this.state.product[0].price} />
                    </div>
                    <label for="pwd">Quantity:</label>
                    <div className="form-inline">
                        <div className="form-group">
                                <input type="number" step= "0.25" className="form-control" required name="quantity" id="pwd" placeholder="quantity" defaultValue={quantity[0]} />
                                <select class="form-control" name="unit" defaultValue= {quantity[1]}>
                                    <option>gm</option>
                                    <option>kg</option>
                                    <option>ml</option>
                                    <option>L</option>
                                </select>
                        </div>
                    </div>   
                    <div className="addProduct-btnPanel">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type="reset" className="btn btn-danger" style={{float:"right"}}>Clear</button>
                    </div>
                  </form>
            </div>
         </div>
        )
    }
    loadProductByID(p_id){
        fetch("/api/product/get/"+p_id)
        .then(res => res.json())
        .then(result => {
            console.log('====================================');
            console.log(result[0]);
            console.log('====================================');
            this.setState({
                product: result,
                isFetching: true
            });
        });
    }
    loadCategories(){
        fetch("/api/category/getcategory")
        .then(res => res.json())
        .then(result => {
            console.log('====================================');
            console.log(result);
            console.log('====================================');
            var temp = [];
            Object.keys(result).map((item) => {
                temp.push(
                    <option key={result[item].category_id}>{result[item].name}</option>
                );
            })
            this.setState({
                categoryRow: temp,
                categories: result
            });
        });
    }
    updateProduct(e,p_id){
        e.preventDefault();
        var quantity = e.target.quantity.value+" "+e.target.unit.value;
        var category = "";
        const {categories} = this.state;
        Object.keys(categories).map((item) => {
            if(categories[item].name === e.target.category.value){
                category = categories[item].category_id;
            }
        })
        console.log('====================================');
        console.log(category);
        console.log('====================================');
        fetch("/api/product/"+p_id,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({name: e.target.name.value, price: e.target.price.value, quantity:quantity,translated:e.target.translated.value,category_id:category,img_url:this.state.product[0].img_url})
        })
        .then(res => res.json())
        .then(result => {
            alert(result.message);
        })
        .catch(e => console.log(e))

    }
}

export default EditProduct;