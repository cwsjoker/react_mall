import React, { Component } from 'react';
import OrderItem from '../../components/OrderItem.js';
import $home_api from '../../fetch/api/home';

class MyOrder extends Component {
    constructor() {
        super();
        this.state = {
            order_list: [], // 订单列表
            order_status: -1,  // 当前页面选择订单状态栏目
            search_key: '', // 搜索关键字
            pendingDelivery: 0, // 待发货单数
            pendingPaymentCount: 0, // 待付款单数
        }
    }
    async componentDidMount() {
        this.getOrderList()
    }
    // 查询全部订单和待付款和待发货的数量, 查询订单列表
    getOrderList = async () => {
        const { search_key, order_status } = this.state;
        const query_obj = {
            "pageNo": 1,
            "pageSize": 50,
            "search": search_key,
            "status": order_status
        }
        const [statusCount_req, order_req] = await Promise.all([$home_api.queryOrderCountStatus(), $home_api.queryAllOrderByUserId(query_obj)]);
        if (statusCount_req) {
            const { pendingDelivery, pendingPaymentCount } = statusCount_req.data.data;
            this.setState({
                pendingDelivery: pendingDelivery,
                pendingPaymentCount: pendingPaymentCount
            })
        }
        if (order_req) {
            const { list } = order_req.data.data;
            this.setState({
                order_list: list
            })
        }
    }
    // 搜索订单关键字
    changeSearchKey = (e) => {
        e.preventDefault();
        this.setState({
            search_key: e.target.value
        })
    }
    // 选择不同的订单
    changeOrderType = (type) => {
        if (this.state.order_status === type) return;
        this.setState({
            search_key: '',
            order_status: type
        }, () => {
            this.getOrderList();
        })
    }
    render() {
        const { order_list, order_status, pendingPaymentCount, pendingDelivery, search_key } = this.state;
        return (
            <div className="myOrder-page">
                <div className="myOrder-page-main">
                    <div className="title">
                        <i></i>
                        <h2>我的订单</h2>
                    </div>
                    <div className="myOrder-page-con">
                        {/* -1 全部订单， 0 待付款， 1 待发货， 9 已成交， 10已取消 */}
                        <div className="orderTab">
                            <a href="javascript:;"  className={order_status === -1 ? 'on' : ''} onClick={() => this.changeOrderType(-1)}>全部订单</a>
                            <a href="javascript:;" className={order_status === 0 ? 'on' : ''} onClick={() => this.changeOrderType(0)}>待付款
                                {
                                    pendingPaymentCount !== 0 ? <em className="angleDom">{pendingPaymentCount}</em> : null
                                }
                            </a>
                            <a  href="javascript:;" className={order_status === 1 ? 'on' : ''} onClick={() => this.changeOrderType(1)}>待发货
                                {
                                    pendingDelivery !== 0 ? <em className="angleDom">{pendingDelivery}</em> : null
                                }
                            </a>
                            <a href="javascript:;" className={order_status === 9 ? 'on' : ''} onClick={() => this.changeOrderType(9)}>已成交</a>
                            <a href="javascript:;" className={order_status === 10 ? 'on' : ''} onClick={() => this.changeOrderType(10)}>已取消</a>
                            <div className="search">
                                <input className="seaTxt" type="text" placeholder="订单号" value={search_key} onChange={this.changeSearchKey}/>
                                <input className="seaBut" type="button" onClick={this.getOrderList} />
                            </div>
                        </div>
                        <div className="orderList">
                            <div className="listTop">
                                <span className="ico1">订单</span>
                                <span className="ico2">订单详情</span>
                                <span className="ico3">收货人</span>
                                <span className="ico4">金额</span>
                                <span className="ico5">状态</span>
                                <span className="ico6">操作</span>
                            </div>
                            <div className="orderListOne">
                                {/* 订单列表 */}
                                {
                                    order_list.map((item, index) => {
                                        return (
                                            <OrderItem key={index} {...item} getOrderList={this.getOrderList} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyOrder;