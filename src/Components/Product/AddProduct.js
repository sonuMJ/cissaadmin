import React from 'react';
import './AddProduct.css';
class AddProduct extends React.Component{
    state={
        categories:"",
        categoryRow: []
    }
    componentDidMount() {
        this.loadCategories();
        
    }
    addProduct(data)
    {
        console.log('====================================');
        console.log(data);
        
        console.log('====================================');
        var productForm = document.getElementById("addproduct");
        fetch("/api/product/send",{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(
                {
                    product_id: data.product_id,
                    name: data.name,
                    price: data.price,
                    quantity: data.quantity,
                    availability: data.availability,
                    translated: data.translated,
                    category_id: data.category_id,
                    img_url: data.img_url
                }
            )
        })
        .then(res => res.json())
        .then(result => {
            productForm.reset();
        })
        .catch(e => console.log(e))
        setTimeout(()=>{this.props.context.fetchProducts();},200);
    }
    uploadImage(e){
        e.preventDefault();
        var category = "";
        const {categories} = this.state;
        Object.keys(categories).map((item) => {
            if(categories[item].name === e.target.category.value){
                category = categories[item].category_id;
            }
        })
        var quantity = e.target.quantity.value+" "+e.target.unit.value;
        console.log('====================================');
        console.log(categories);
        
        console.log('====================================');
        let form = new FormData(this.refs.myForm);
        form.append('myImage', e.target.file);
        var data= {
            product_id: "",
            name: e.target.name.value,
            price: e.target.price.value,
            quantity:quantity,
            availability:"true",
            translated: e.target.translated.value,
            category_id:category,
            img_url:"---"
        }
        if(e.target.file.files.length != 0){
            fetch("/api/product/upload",{
                method:'POST',
                body:form
                 }).then(res =>res.json())
                 .then(result => {
                     console.log('====================================');
                     console.log(result);
                     console.log('====================================');
                     data.product_id = result.product_id;
                     data.img_url = result.path;
                 })
                .catch(e => console.log(e))
                setTimeout(()=>{
                    if(data.product_id != ""){
                        this.addProduct(data)
                    }
                },200);
        }
        this.addProduct(data);


    }
    onNameChange(e){
        e.preventDefault();
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
    render(){
        return(
       <React.Fragment>
           <div className="text-left">
            <div class="modal-header text-center">
                    <h2 class="modal-title">Add Product</h2>
                </div>
                <div class="modal-body">
                    <form onSubmit={this.uploadImage.bind(this)} encType="multipart/form-data" ref="myForm" id="addproduct">
                        <div className="form-group">
                        <label for="pwd">img:</label>
                        </div>
                        <div className="form-group">
                        <input type="file" ref="file" className="form-control-file border" name="file" accept="image/*"/>
                        </div>
                        <div className="form-group">
                            <label for="usr">Name:</label>
                            <input type="text" className="form-control" onChange={this.onNameChange.bind(this)} required name="name" id="usr" placeholder="Name"/>
                        </div>
                        <div className="form-group">
                            <label for="usr">Regional translation:</label>
                            <input type="text" className="form-control" required name="translated" id="usr" placeholder="Transaltion"/>
                        </div>
                        <div className="form-group">
                            <label for="usr">Category:</label>
                            <div>
                                <select className="purchaseDetails-select" name="category"  placeholder="Category">
                                    {this.state.categoryRow}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="pwd">Price:</label>
                            <input type="text" className="form-control" required name="price" id="pwd" placeholder="Price"/>
                        </div>
                        <label for="pwd">Quantity:</label>
                        <div className="form-inline">
                            <div className="form-group">
                                    <input type="number" step= "0.25" className="form-control" required name="quantity" id="pwd" placeholder="quantity"/>
                                    <select class="form-control" name="unit">
                                        <option>gm</option>
                                        <option>kg</option>
                                        <option>ml</option>
                                        <option>L</option>
                                    </select>
                            </div>
                        </div>   
                        <div className="modal-footer addProduct-btnPanel">
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="reset" className="btn btn-danger" style={{float:"right"}}>Clear</button>
                        </div>
                    </form>
                </div>
           </div>

       </React.Fragment>
        );
    }
}
export default AddProduct;
