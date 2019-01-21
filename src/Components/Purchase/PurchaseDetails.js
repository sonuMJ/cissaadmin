import React from 'react';
import './PurchaseDetails.css';
import Loader from '../Loader/Loader';

class PurchaseDetails extends React.Component{
    state={
        isFetching: true,
        orders : [],
        orderList : new Set(),
        currentPage: 1,
        itemsPerPage: 3,
        startDate:this.prevSaturday(new Date().getTime()).getTime(),
        endDate: new Date().getTime()
    }
    componentDidMount(){
        this.fetchOrders();
        setTimeout(()=>{this.updateOrderList()},200);
        
    }

    updateOrderList(){
        console.log("updating orderList");
        Object.keys(this.state.orders).map((item) => {
            this.setState(({ orderList }) => ({
                orderList: new Set(orderList.add(this.state.orders[item].orderid))
            }));
        })
        this.setState({isFetching:false});
    }
    fetchOrders(){
        this.setState({
            isFetching: true,
            orders: [],
            orderList: new Set()
        });
        fetch("/api/order/getall", {
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
            console.log(result);
            
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
        setTimeout(()=>{this.updateOrderList()},2000);
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
        setTimeout(()=>{this.updateOrderList()},2000);
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
    printData(){
        window.print();
    }
    handleStatusChange(e,id){
        var status = e.target.value;
        fetch("/api/order/status/"+id,{
            method:'PUT',
            body:JSON.stringify({status:status}),
            headers:{
              "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
            alert(result.message);
        })
        .catch(e => console.log(e));
        (status === "Delivered" || status === "Picked up" || status === "Cancelled")? this.sendEmail(id,status):console.log("email not sent")
    }
    sendEmail(id,status){
        fetch("/api/email/sendStatusEmail/"+id,{
            method:'POST',
            body:JSON.stringify({status:status}),
            headers:{
              "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log('====================================');
            console.log(result);
            console.log('====================================');
        })
        .catch(e => console.log(e));
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
    }
    render(){
        console.log(this.state.orders);
        console.log(this.state.orderList);
        console.log('====================================');
        console.log(this.state.isFetching);
        console.log('====================================');
        
        return(      
        <div className="col-lg-10 purchaseDetail-main text-left">
            <h2>Order details</h2>
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
            <div class="panel-group" id="accordion">
                {this.state.isFetching ? <Loader/>: this.renderHome() }
                {!this.state.isFetching && this.state.orders.length == 0 ? <EmptyData/>: ""}
            </div> 
            
        </div>
    );
    }
    renderHome(){
        var content = [];
        const {orderList,currentPage,itemsPerPage} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Array.from(orderList).slice(firstIndex,lastIndex);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(orderList.size / itemsPerPage); i++) {
          pageNumbers.push(i);
        }
        console.log('====================================');
        console.log(firstIndex);
        console.log(lastIndex);
        console.log(currentPage);
        console.log(currentItemList);
        console.log(pageNumbers);
        console.log('====================================');
        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li><a
                key={number}
                id={number} onClick={this.onPageChange.bind(this)}>
                {number}
              </a>
              </li>
            );
          });
        ([...currentItemList]).map((item,index) => {
            var child = [];
            var total = 0;
            var order = this.state.orders.filter(function(i) { return i.orderid === item; });
            var date = new Date();
            date.setTime(order[0].date);
            // var formattedDate = date.toJSON().slice(0,10).split('-').reverse().join('/');
            var formattedDate = date.toDateString();
            order.forEach(function(i){
                total += i.quantity*i.price;
                child.push(
                    <OrderRow data={i} context={this}/>
                );
            })
            content.push(
                <React.Fragment>
                            <div class="panel print panel-default card">
                                <div class="panel-heading purchaseDetails-panelHead"  style={{cursor:'pointer'}} data-toggle="collapse" data-parent="#accordion" href={"#"+order[0].id}>
                                    <h4>OrderNo: #{item}<span style={{float:'right'}}>Scheduled for: {formattedDate}</span></h4>
                                    <h5>Ordered by: {order[0].userid}</h5>
                                    <h4 class="panel-title">
                                    </h4>
                                </div>
                                <div id={order[0].id} class="panel-collapse collapse">
                                    <table className="table table-hover table-bordered table-responsive" style={{marginTop:'30px'}}>
                                        <tbody>
                                            <tr className="active" style={{color:'#000'}}>
                                                <th>Sl No</th>
                                                <th>User Id</th>
                                                <th>Product Id</th>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Unit Price</th>
                                                <th>Total Price</th>
                                            </tr>
                                            {child}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    {/* {(order[0].status === "false")? <h5>Status: Upcoming pickup </h5>:<h5>Status:  Order Picked up</h5>} */}
                                    <div className="form-group" style={{marginTop:'20px'}}>
                                        <label>Status:&nbsp;&nbsp;</label>
                                        <select className="purchaseDetails-select" defaultValue={order[0].status} onChange={(e)=>{this.handleStatusChange(e,item)}}>
                                            <option>Upcoming pickup</option>
                                            <option>Picked up</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                            <option>Pending Delivery</option>
                                        </select>
                                        <span style={{float:'right',fontSize:'28px',fontWeight:'600'}}> &#8377;{total}</span>
                                    </div>
                                    {/* <h1 style={{textAlign:'right'}}><span style={{fontSize:'28px'}}> &#8377;</span>{total}</h1> */}
                                </div>
                            </div>
                    
                </React.Fragment>
            );
        })
        content.push(
        <div style={{textAlign:'center'}}> 
            <ul class="page-numbers pagination">
              {renderPageNumbers}
            </ul>
        </div>);
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
                <td>{props.data.id}</td>
                <td>{props.data.userid}</td>
                <td>{props.data.productid}</td>
                <td>{props.data.name}</td>
                <td>{props.data.quantity}</td>
                <td>{props.data.price}</td>
                <td>{props.data.quantity * props.data.price}</td>
            </tr>
    );
}
export default PurchaseDetails;