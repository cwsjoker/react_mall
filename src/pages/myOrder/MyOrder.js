import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { message } from 'antd';

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
        // 查询全部订单和待付款和待发货的数量
        this.getOrderList()
        const statusCount_req = await $home_api.queryOrderCountStatus();
        if (statusCount_req) {
            const { pendingDelivery, pendingPaymentCount } = statusCount_req.data.data;
            this.setState({
                pendingDelivery: pendingDelivery,
                pendingPaymentCount: pendingPaymentCount
            })
        }
    }
    // 获取各个状态的订单
    async getOrderList() {
        const order_req = await $home_api.queryAllOrderByUserId({
            "pageNo": 1,
            "pageSize": 50,
            "search": this.state.search_key,
            "status": this.state.order_status
        });
        if (order_req) {
            // console.log(order_req);
            const { list } = order_req.data.data;
            this.setState({
                order_list: list
            })
        }
    }
    // 搜索订单关键字
    changeSearchKey(e) {
        e.preventDefault();
        this.setState({
            search_key: e.target.value
        })
    }
    // 选择不同的订单
    changeOrderType(type) {
        if (this.state.order_status === type) return;
        this.setState({
            search_key: '',
            order_status: type
        }, () => {
            this.getOrderList();
        })
    }
    // 订单付款
    gotoPayment(id) {
        this.props.history.push('/payment?orderId=' + id);
    }
    gotoOrderDetail(id) {
        this.props.history.push('/orderDetail?orderId=' + id);
    }
    // 取消订单
    async cancelOrder(id) {
        const obj_req = await $home_api.cancelOrderById({orderNumber: id});
        if (obj_req) {
            this.getOrderList();
        }
    }
    // 删除订单
    async deleteOrder(id) {
        const obj_req = await $home_api.removeOrderById({orderNumber: id});
        if (obj_req) {
            this.getOrderList();
        }
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
                        <div className="orderTab">
                            <a href="javascript:;"  className={order_status === -1 ? 'on' : ''} onClick={this.changeOrderType.bind(this, -1)}>全部订单</a>
                            <a href="javascript:;" className={order_status === 0 ? 'on' : ''} onClick={this.changeOrderType.bind(this, 0)}>待付款
                                {
                                    pendingPaymentCount !== 0 ? <em className="angleDom">{pendingPaymentCount}</em> : null
                                }
                            </a>
                            <a  href="javascript:;" className={order_status === 1 ? 'on' : ''} onClick={this.changeOrderType.bind(this, 1)}>待发货
                                {
                                    pendingDelivery !== 0 ? <em className="angleDom">{pendingDelivery}</em> : null
                                }
                            </a>
                            <a href="javascript:;" className={order_status === 9 ? 'on' : ''} onClick={this.changeOrderType.bind(this, 9)}>已成交</a>
                            <a href="javascript:;" className={order_status === 10 ? 'on' : ''} onClick={this.changeOrderType.bind(this, 10)}>已取消</a>
                            <div className="search">
                                <input className="seaTxt" type="text" placeholder="订单号" value={search_key} onChange={this.changeSearchKey.bind(this)}/>
                                <input className="seaBut" type="button" onClick={this.getOrderList.bind(this)} />
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
                                {
                                    order_list.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <div className="orderId">
                                                    <span>{item.orderTime}</span>
                                                    <em>订单编号：{item.orderNumber}</em>
                                                </div>
                                                {
                                                    item.orderItemList.map((goodsItem, i) => {
                                                        return (
                                                            <div key={i} className="orderMain">
                                                                <div className="orderInfor">
                                                                    <div className="orderImg"><a href="javascript:;"><img src={"http://ltalk-website.oss-cn-hangzhou.aliyuncs.com/" + goodsItem.goodsImgUrl} /></a></div>
                                                                    <div className="orderTxt">
                                                                        <p>
                                                                            <a>{goodsItem.introduce}</a>
                                                                            <span>{goodsItem.price + ' ' + goodsItem.symbol + 'x' + goodsItem.count}</span>
                                                                        </p>
                                                                        <h6>备注：{goodsItem.note}</h6>
                                                                    </div>
                                                                </div>
                                                                <div className="orderConsi"><span>{item.receiverName}</span></div>
                                                                {/* 第一条item显示付款信息 */}
                                                                {
                                                                    i === 0 ? (
                                                                        <div>
                                                                            <div className="orderMoney">
                                                                                <h6>总额 {item.price + ' ' + goodsItem.symbol}</h6>
                                                                                <p>应付<br />{item.price + ' ' + goodsItem.symbol}</p>
                                                                                <h5>货币支付</h5>
                                                                            </div>
                                                                            {/* 订单状态 */}
                                                                            <div className="orderState">
                                                                                {
                                                                                    item.orderStatus === 0 ? <span>待付款</span> : null
                                                                                }
                                                                                {
                                                                                    item.orderStatus === 1 ? <span>待发货</span> : null
                                                                                }
                                                                                {
                                                                                    item.orderStatus === 9 ? <span>已成交</span> : null
                                                                                }
                                                                                {
                                                                                    item.orderStatus === 10 ? <span>已取消</span> : null
                                                                                }
                                                                                <a href="javascript:;" onClick={this.gotoOrderDetail.bind(this, item.orderNumber)}>订单详情</a>
                                                                            </div>
                                                                            {/* 根据订单状态显示操作按钮 */}
                                                                            <div className="orderHandle">
                                                                                {
                                                                                    item.orderStatus === 0 ? <a href="javascript:;" onClick={this.gotoPayment.bind(this, item.orderNumber)}>付款</a> : null
                                                                                }
                                                                                {
                                                                                    item.orderStatus === 1 ? <span className="cancelOrder" onClick={() => message.success('提醒成功')}>提醒发货</span> : null 
                                                                                }
                                                                                {
                                                                                    item.orderStatus === 0 ? <span className="cancelOrder" onClick={this.cancelOrder.bind(this, item.orderNumber)}>取消订单</span> : null
                                                                                }
                                                                                {
                                                                                    item.orderStatus === 0 || item.orderStatus === 10 ? <span className="deleteOrder" onClick={this.deleteOrder.bind(this, item.orderNumber)}>删除</span> : null
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </li>
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

export default withRouter(MyOrder);