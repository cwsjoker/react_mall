import React, { Component } from 'react';
import { withRouter } from 'react-router';

import $user_api from '../../fetch/api/user';
import $home_api from '../../fetch/api/home';

const ConfirmOrder = class ConfirmOrder extends Component {
    constructor() {
        super()
        this.state = {
            order_list: [],
            goods_count: 0,
            goods_total_price: 0,
            symbol: '',
            available: 0,
            addr_list: []
        }
    }
    async componentDidMount() {
        const list = JSON.parse(localStorage.getItem('orderList')) || [];
        if (list.length !== 0) {
            list.forEach(item => {
                item.note = '';
            })
            const len = list.reduce((total, item) => {
                return total + item.goodsNum;
            }, 0)
            const total_price = list.reduce((total, item) => {
                return total + (item.goodsNum * item.goodsPrice);
            }, 0)
            this.setState({
                order_list: list,
                goods_count: len,
                goods_total_price: total_price,
                symbol: list[0]['symbol']
            }, async () => {
                // 获取账户余额
                const res_blance = await $user_api.getUserFinance({coinSymbol: this.state.symbol});
                if (res_blance) {
                    this.setState({
                        available: res_blance.data.data.available
                    })
                }
            })
        }

        // 获取收货地址
        const res_addr = await $user_api.queryCustomerAllAddress();
        if (res_addr) {
            // console.log(res_addr);
            const { data } = res_addr.data;
            data.forEach(v => {
                v.is_choose = v.isCurrent ? true : false;
            })
            console.log(data);
            this.setState({
                addr_list: data
            })
        }
        
    }
    // 选择发货地址
    change_addr(item, e) {
        // console.log(item);
        e.preventDefault();
        const { id } = item;
        const list = this.state.addr_list;
        list.forEach(v => {
            v.is_choose = v.id === id ? true : false; 
        })
        // console.log(list);
        this.setState({
            addr_list: list
        })
    }
    // 修改备注
    changeNote(index, e) {
        // e.persist();
        e.preventDefault();
        // console.log(index);
        // console.log(e.target.value);
        const list = this.state.order_list;
        list[index]['note'] = e.target.value;
        this.setState({
            order_list: list
        })
    }
    // 提交订单
    async submitOrder() {
        let post_data = {
            addressId: '',
            goods: []
        }

        post_data.goods = this.state.order_list.map(v => {
            const obj = {};
            obj['count'] = v.goodsNum;
            obj['goodId'] = v.goodsId;
            obj['invyid'] = v.inventoryid;
            obj['note'] = v.note;
            return obj;
        })

        if (post_data.goods.length === 0) {
            return;
        }

        const addr_item = this.state.addr_list.find(v => {
            return v.is_choose;
        })
        post_data.addressId = addr_item['id'];

        const order_req =  await $home_api.createNewOrder(post_data);
        if (order_req) {
            console.log(order_req);
            if (order_req) {
                // 下单成功
                // 1901291026208074
                const order_number = order_req.data.data;
                this.props.history.push('/Payment?orderId=' + order_number);

            }
        }
    }
    render() {
        const { goods_count, goods_total_price, symbol, available, addr_list } = this.state
        return (
            <div className="confirmOrder-page">
                <div className="confirmOrder-page-warp">
                    {/*  */}
                    <div className="title">
                        <i></i>
                        <h2>填写并核对订单信息</h2>
                    </div>
                    <div className="confirmOrder-main">
                        <div className="shipping-addr">
                            <div className="shipping-addr-title">
                                <span>收货人信息</span>
                                <span className="add-addr">新增收货地址</span>
                            </div>
                            <div className="addr-list">
                                {
                                    addr_list.map((item, index) => {
                                        return (
                                            <div key={index} className={ item.is_choose ? 'addr-item on' : 'addr-item'} onClick={this.change_addr.bind(this, item)}>
                                                <div className="addr-item-info">
                                                    <span>{item.personName}</span><span>{item.addressDisplay + item.addressName}</span><span>{item.personPhone}</span>
                                                    {item.isCurrent ? <span className="addr-default">默认地址</span> : null}
                                                </div>
                                                <div className="addr-item-btn"></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="pay-type">
                            <div>支付方式</div>
                            <div className="payLeft">
                                <span>货币支付</span>
                                <p>注意：当前余额{available + ' ' + symbol}，请前去<a href={'https://bttmall.com/market?symbol=' + 'MIT' + '_BT'}>交易</a></p>
                            </div>
                        </div>
                        <div className="order-detail">
                            <div>送货清单</div>
                            <div className="deliveytMain">
                                <h2><em>配送方式</em><span>顺丰快递</span></h2>
                                {
                                    this.state.order_list.map((item, index) => {
                                        return (
                                            <div key={index} className="deliverInfor cleafix">
                                                <div className="deliveImg fl"><a href="javascript:;"><img src={'http://ltalk-website.oss-cn-hangzhou.aliyuncs.com/' + item.goodsImgUrl} /></a></div>
                                                <div className="deliveText fr">
                                                    <p>
                                                        <a href="javascript:;">{item.goodsIntroduce}</a>
                                                        <span>有货</span>
                                                        <span>x{item.goodsNum}</span>
                                                        <span title="price">{item.goodsPrice}{item.symbol}</span>
                                                    </p>
                                                    <textarea rows="1" placeholder="请填写备注信息" value={item.note} onChange={this.changeNote.bind(this, index)}></textarea>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="order-total-price">
                            {goods_count}件商品，总商品金额：{goods_total_price + ' ' + symbol}
                        </div>
                    </div>
                    {/* 应付总额 */}
                    <div className="total-amount">
                        <div>应付总额：{goods_total_price + ' ' + symbol}</div>
                        {
                            addr_list.map((item, index) => {
                                return (
                                    item.is_choose ? <div key={index}><span>寄送至：{item.addressDisplay + item.addressName}</span><span>收货人：{item.personName + ' ' + item.personPhone}</span></div> : null
                                )
                            })
                        }
                    </div>
                    {/* 提交订单 */}
                    <div className="submit-order-btn"><a href="javascript:;" onClick={this.submitOrder.bind(this)}>提交订单</a></div>
                </div>
            </div>
        )
    }
}

export default withRouter(ConfirmOrder);