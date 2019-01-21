import React from 'react';
import './PurchaseByProduct.css';
import Loader from '../Loader/Loader';

class PurchaseByProduct extends React.Component{
    state={
        isFetching: true,
        orders : [],
        startDate:this.prevSaturday(new Date().getTime()).getTime(),
        endDate: new Date().getTime()
    }
    componentDidMount(){
        this.fetchOrders();
        console.log('====================================');
        var d = new Date();
        console.log(d.getTime());
        console.log('====================================');
    }
    // shouldComponentUpdate(){
    //     return true;
    // }

    fetchOrders(){
        this.setState({
            isFetching: true,
            orders: []
        });
        fetch("/api/order/getByProduct", {
            method: 'POST',
            body:JSON.stringify({start: this.state.startDate, end: this.state.endDate}),
            headers: {
                'Content-Type': 'application/json',
            }
          })
        .then(res => res.json())
        .then(result => {
            this.setState({
                orders: result
            });
            console.log('====================================');
            console.log(result);
            console.log('====================================');
            this.setState({isFetching:false});
            
        }).catch((err) => console.log(err));
    }
    onStartDateChange(e){
        var date = new Date(e.target.valueAsDate);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        console.log(date.getTime());
        this.setState({
            isFetching:true,
            startDate:date.getTime()
        });
        setTimeout(()=>{this.fetchOrders()},1000);
    }
    onEndDateChange(e){
        var date = new Date(e.target.valueAsDate);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        console.log(date.getTime());
        this.setState({
            isFetching:true,
            endDate:date.getTime()
        });
        setTimeout(()=>{this.fetchOrders()},1000);
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
    }
    prevSaturday(curr_date){
        var d = new Date();
        d.setTime(curr_date);
        if(d.getDay === 6){
        }
        else{
            d.setDate(d.getDate()-(d.getDay()+1));
        }
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        console.log('====================================');
        console.log(d);
        console.log('====================================');
        // this.setState({startDate:d.getTime()});
        return d;
    }
    downloadCSV(csv, filename) {
        var csvFile;
        var downloadLink;
        csvFile = new Blob([csv], {type: "text/csv"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
    formatDateReadeable(date){
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
    }
    exportTableToCSV() {
        var filename = this.formatDateReadeable(this.state.startDate) +" to "+ this.formatDateReadeable(this.state.endDate)+".csv"
        var csv = [];
        var rows = document.querySelectorAll("table tr");
        
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row.join(";"));        
        }
    
        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    }
    printData(){
        window.print();
    }
    render(){
        console.log(this.state.orders);
        console.log('====================================');
        console.log(this.state.isFetching);
        console.log('====================================');
        
        return(      
        <div className="col-lg-10 purchaseDetail-main text-left">
            <h2>Order details by Product</h2>
            <form className="form-inline">
                <div className="form-group purchaseDetail-formGroup">
                <div><label>Start Date</label></div> 
                    <input type="date" name="date" onChange={this.onStartDateChange.bind(this)} defaultValue={this.formatDate(this.prevSaturday(this.state.endDate))}></input>
                </div>
                
                <div className="form-group purchaseDetail-formGroup">
                <div><label>End Date</label></div>
                    <input type="date" name="date" onChange={this.onEndDateChange.bind(this)} defaultValue={this.formatDate(this.state.endDate)}></input>
                </div>
            </form>
            {!this.state.isFetching && this.state.orders.length == 0 ? <EmptyData/>: ""}
            {this.state.isFetching ? <Loader/>: this.renderHome() }
        </div>
    );
    }
    renderHome(){
        var content = [],child = [];
        if(this.state.orders.length !=0){
            content.push(
                <React.Fragment>
                    <div className="card">
                    <div>
                        <span style={{fontSize:'25px'}}>Product acquisition list for {this.formatDateReadeable(this.state.startDate)} to {this.formatDateReadeable(this.state.endDate)}</span>
                        <span className="text-center" style={{float:'right'}}>
                        <img src="/images/csv.png" className="purchaseByProduct-Btn" onClick={this.exportTableToCSV.bind(this)}/>
                        <p>Download</p>
                        </span>
                    </div>

                        <table className="table table-hover table-bordered table-responsive" style={{marginTop:'30px'}}>
                            <tbody>
                                <tr className="active" style={{color:'#000'}}>
                                    <th>Product Id</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                </tr>
                               {child}
                            </tbody>
                        </table> 
                    </div>    
                </React.Fragment>
            );
        }


        (this.state.orders).map((item,index) => {
                child.push(<OrderRow data={item}/>);
                
        })
        return content;
        
    }
}
const EmptyData = (props) =>{
    return(
        <div>
            <h2>No orders found</h2>
        </div>
    );
}
const OrderRow = (props) =>{
    return(
          <tr>
                <td>{props.data.productid}</td>
                <td>{props.data.name}</td>
                <td>{props.data.quan}</td>
                <td>{props.data.price}</td>
            </tr>
    );
}
export default PurchaseByProduct;