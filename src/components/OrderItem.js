import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import { message, Modal } from 'antd';
import $home_api from '../fetch/api/home';

const { confirm } = Modal;

export default class OrderItem extends Component {
    // 取消订单
    cancelOrder(id) {
        const _this = this;
        confirm({
            title: '确定取消订单吗?',
            onOk() {
                return new Promise((resolve, reject) => {
                    $home_api.cancelOrderById({orderNumber: id}).then((obj_req) => {
                        if (obj_req) {
                            message.success('订单取消成功');
                            _this.props.getOrderList();
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            }
        })
    }
    // 删除订单
    deleteOrder(id) {
        const _this = this;
        confirm({
            title: '确定删除订单吗?',
            onOk() {
                return new Promise((resolve, reject) => {
                    $home_api.removeOrderById({orderNumber: id}).then((obj_req) => {
                        if (obj_req) {
                            message.success('订单删除成功');
                            _this.props.getOrderList();
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            }
        })
    }
    render() {
        const { orderTime, orderNumber, orderItemList, orderStatus, price, receiverName } = this.props;
        return (
            <li>
                <div className="orderId">
                    <span>{orderTime}</span>
                    <em>订单编号：{orderNumber}</em>
                </div>
                {
                    orderItemList.map((goodsItem, i) => {
                        return (
                            <div key={i} className="orderMain">
                                <div className="orderInfor">
                                    <div className="orderImg"><a href="javascript:;"><img src={window.BACK_URL + goodsItem.goodsImgUrl} /></a></div>
                                    <div className="orderTxt">
                                        <p>
                                            <Link to={'/goodsDetail?goodsId=' + goodsItem.goodsId}>{goodsItem.introduce}</Link>
                                            <span>{goodsItem.price + ' ' + goodsItem.symbol + 'x' + goodsItem.count}</span>
                                        </p>
                                        <h6>备注：{goodsItem.note}</h6>
                                    </div>
                                </div>
                                <div className="orderConsi"><span>{receiverName}</span></div>
                                {/* 第一条item显示付款信息 */}
                                {
                                    i === 0 ? (
                                        <div>
                                            <div className="orderMoney">
                                                <h6>总额 {price + ' ' + goodsItem.symbol}</h6>
                                                <p>应付<br />{price + ' ' + goodsItem.symbol}</p>
                                                <h5>货币支付</h5>
                                            </div>
                                            {/* 订单状态 */}
                                            <div className="orderState">
                                                {
                                                    orderStatus === 0 ? <span>待付款</span> : null
                                                }
                                                {
                                                    orderStatus === 1 ? <span>待发货</span> : null
                                                }
                                                {
                                                    orderStatus === 9 ? <span>已成交</span> : null
                                                }
                                                {
                                                    orderStatus === 10 ? <span>已取消</span> : null
                                                }
                                                <Link to={'/orderDetail?orderId=' + orderNumber}>订单详情</Link>
                                            </div>
                                            {/* 根据订单状态显示操作按钮 */}
                                            <div className="orderHandle">
                                                {
                                                    orderStatus === 0 ? <Link to={'/payment?orderId=' + orderNumber}>付款</Link> : null
                                                }
                                                {
                                                    orderStatus === 1 ? <span className="cancelOrder" onClick={() => message.success('提醒成功')}>提醒发货</span> : null 
                                                }
                                                {
                                                    orderStatus === 0 ? <span className="cancelOrder" onClick={() => this.cancelOrder(orderNumber)}>取消订单</span> : null
                                                }
                                                {
                                                    orderStatus === 0 || orderStatus === 10 ? <span className="deleteOrder" onClick={() => this.deleteOrder(orderNumber)}>删除</span> : null
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
    }
}