import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Modal, Form, Input, Button, Cascader, message } from 'antd';
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
            addr_list: [],
            show_addr_modal: false,
            modal_title: '新增收货地址',
            options: [], // 省级三级联动
            choose_option: [], //选择地址
        }
    }
    async componentDidMount() {
        this.getAddress();
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
        this.getCurrentAddr();
    }
    // 获取当前用户的收货地址
    async getCurrentAddr() {
        const res_addr = await $user_api.queryCustomerAllAddress();
        if (res_addr) {
            const { data } = res_addr.data;
            data.forEach(v => {
                v.is_choose = v.isCurrent ? true : false;
            })
            this.setState({
                addr_list: data
            })
        }
    }
    // 获取省级三级联动的数据列表
    async getAddress() {
        const req1 = await $home_api.queryBaseAddress({parentId: 0, type: 1});
        const req2 = await $home_api.queryBaseAddress({parentId: 0, type: 2});
        const req3 = await $home_api.queryBaseAddress({parentId: 0, type: 3});
        if (req1 && req2 && req3) {
            let list = [];
            req1.data.data.forEach(v => {
                let obj = {}
                obj.value = v.id;
                obj.label = v.name;
                obj.children = [];
                req2.data.data.forEach(k => {
                    if (k.parentId === v.id) {
                        let obj1 = {}
                        obj1.value= k.id;
                        obj1.label= k.name;
                        obj1.children= [];
                        req3.data.data.forEach(j => {
                            if (j.parentId === k.id) {
                                obj1.children.push({
                                    value: j.id,
                                    label: j.name
                                })
                            }
                        })
                        obj.children.push(obj1)
                    }
                })
                list.push(obj);
            })
            this.setState({
                options: list
            });
        }
    }
    onChange = (value, options) => {
        this.setState({
            choose_option: options
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                const { addressName, personName, personPhone} = values;
                const { choose_option } = this.state;
                const addr_text = choose_option.reduce((total,item) => {
                    return total + item.label;
                }, '')
                const id = choose_option[choose_option.length - 1]['value'];
                const creat_addr_req = await $user_api.createNewCustomerAddress({
                    "addressBaseId": id, //住址ID(区级) 
                    "addressDisplay": addr_text, //省市
                    "addressName": addressName, //详细住址
                    "personName": personName, //收货人名
                    "personPhone": personPhone //收货人手机号
                })
                if (creat_addr_req) {
                    this.setState({
                        show_addr_modal: false
                    })
                    message.success('新增收货人地址成功');
                    this.getCurrentAddr();
                }
            }
        });
    }
    // 设置默认地址
    async setDefaultAddr(id, e) {
        e.preventDefault();
        e.stopPropagation();
        const req = await $user_api.modifyCustomerAddressDefault({addressId: id});
        if (req) {
            message.success('设置默认地址成功');
            this.getCurrentAddr();
        }
    }
    // 删除地址
    async deleteAddr(id, e) {
        e.preventDefault();
        e.stopPropagation();
        const req = await $user_api.removeCustomerAddress({addressId: id});
        if (req) {
            message.success('删除成功');
            this.getCurrentAddr();
        }
    }
    // 选择发货地址
    change_addr(item, e) {
        e.preventDefault();
        const { id } = item;
        const list = this.state.addr_list;
        list.forEach(v => {
            v.is_choose = v.id === id ? true : false; 
        })
        this.setState({
            addr_list: list
        })
    }
    // 修改备注
    changeNote(index, e) {
        e.preventDefault();
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
            // console.log(order_req);
            if (order_req) {
                // 下单成功
                // 1901291026208074
                message.success('下单成功');
                const order_number = order_req.data.data;
                this.props.history.push('/Payment?orderId=' + order_number);

            }
        }
    }
    render() {
        const { goods_count, goods_total_price, symbol, available, addr_list, modal_title, show_addr_modal, options } = this.state;
        const { getFieldDecorator } = this.props.form;
        // console.log(getFieldDecorator);
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
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
                                <span className="add-addr" onClick={() => this.setState({show_addr_modal: true})}>新增收货地址</span>
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
                                                {
                                                    !item.isCurrent ? (
                                                        <div className="addr-item-btn">
                                                            <span onClick={this.setDefaultAddr.bind(this, item.id)}>设为默认地址</span>
                                                            <span onClick={this.deleteAddr.bind(this, item.id)}>删除</span>
                                                        </div>
                                                    ) : null
                                                }
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
                                <p>注意：当前余额{available + ' ' + symbol}，请前去<a href={window.BT_URL + 'market?symbol=' + 'MIT' + '_BT'}>交易</a></p>
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
                                                <div className="deliveImg fl"><a href="javascript:;"><img src={window.BACK_URL + item.goodsImgUrl} /></a></div>
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
                {/* 收货地址表单弹窗 */}
                <Modal
                    title={modal_title}
                    visible={show_addr_modal}
                    onCancel={() => this.setState({show_addr_modal: false})}
                    footer={null}
                    >
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item
                            {...formItemLayout}
                                label="所在地区"
                            >
                            {getFieldDecorator('addrId', {
                                rules: [{
                                    required: true, message: '请选择地区',
                                }],
                            })(
                                <Cascader options={options}  placeholder="请选择所在地区" onChange={this.onChange} />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="收货人"
                        >
                            {getFieldDecorator('personName', {
                                rules: [{
                                    required: true, message: '请填写收货人',
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="详细地址"
                        >
                            {getFieldDecorator('addressName', {
                                rules: [{
                                    required: true, message: '请填写详细地址',
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="手机号码"
                        >
                            {getFieldDecorator('personPhone', {
                                rules: [{
                                    required: true, message: '请填写手机号码',
                                }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">保存信息</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(withRouter(ConfirmOrder));