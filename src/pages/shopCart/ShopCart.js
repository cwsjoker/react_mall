import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { message, Modal } from 'antd';
import { setShopCartNum } from '../../store/actionCreators.js';
import ShopCartItem from '../../components/ShopCartItem.js';
import $home_api from '../../fetch/api/home';

const { confirm } = Modal;

class ShopCart extends Component {
    constructor() {
        super();
        this.state = {
            shop_list: []
        }
    }
    componentDidMount() {
        const list_str = localStorage.getItem('shopCartList');
        if ( list_str ) {
            this.updateGoodsPrice();
        }

    }
    // 更新购物车的商品价格
    updateGoodsPrice() {
        const list_str = localStorage.getItem('shopCartList');
        if (list_str) {
            const list = JSON.parse(list_str);
            const promises = list.map(v => {
                return this.getForByGoodsPrice(v.goodsId, v.propertyGroupGoods);
            })
            Promise.all(promises).then(price_list => {
                const list = JSON.parse(localStorage.getItem('shopCartList'));
                price_list.forEach(v => {
                    list.forEach(k => {
                        if (v.goodsId === k.goodsId && v.propertyGroup && k.propertyGroupGoods) {
                            k['goodsPrice'] = v.price
                        }
                    })
                })
                const store_list = [];
                list.forEach(v => {
                    v['is_choose'] = false;
                    const find_index = store_list.findIndex(k => {
                        return v.storeName === k.storeName;
                    })
                    if (find_index === -1) {
                        store_list.push({
                            is_choose: false,
                            storeName: v.storeName,
                            producerId: v.producerId,
                            goods_account: 0,
                            goods_price: 0,
                            symbol: v.symbol,
                            list: [v]
                        })
                    } else {
                        store_list[find_index]['list'].push(v);
                    }
                })
                this.setState({
                    shop_list: store_list
                })
                localStorage.setItem('shopCartList', JSON.stringify(list));
            }).catch(error => {
                console.log(error);
                const list = JSON.parse(localStorage.getItem('shopCartList'));
                const store_list = [];
                list.forEach(v => {
                    v['is_choose'] = false;
                    const find_index = store_list.findIndex(k => {
                        return v.storeName === k.storeName;
                    })
                    if (find_index === -1) {
                        store_list.push({
                            is_choose: false,
                            storeName: v.storeName,
                            producerId: v.producerId,
                            goods_account: 0,
                            goods_price: 0,
                            symbol: v.symbol,
                            list: [v]
                        })
                    } else {
                        store_list[find_index]['list'].push(v);
                    }
                })
                this.setState({
                    shop_list: store_list
                })
            })
        }
    }
    // 根据型号查询商品的价格信息
    async getForByGoodsPrice(goodsId, propertyGroup) {
        let query = {}
        if (propertyGroup) {
            query = {
                'goodsId': goodsId,
                'propertyGroup': propertyGroup
            }
        } else {
            query = {
                'goodsId': goodsId,
            }
        }
        const priceInfo_res = await $home_api.getByGoodsQueryPrice(query)
        if (priceInfo_res) {
            // priceInfo_res.data.data.price = priceInfo_res.data.data.price;
            return priceInfo_res.data.data;
        }
    }
    // 全选
    checkAll(obj) {
        obj.is_choose = !obj.is_choose;
        let list = this.state.shop_list;
        list.forEach(v => {
            if (v.storeName === obj.storeName) {
                v.list.forEach(k => {
                    k.is_choose = obj.is_choose ? true : false;
                })
            }
        })
        this.setState({
            shop_list: list
        }, () => {
            this.reset_price();
        })
    }
    // 单个选
    checkItem(obj) {
        let list = this.state.shop_list;
        list.forEach(v => {
            if (v.storeName === obj.storeName) {
                let is = true;
                v.list.forEach(k => {
                    if (k.goodsId === obj.goodsId && k.propertyGroupGoods.split(',').sort().join(',') === obj.propertyGroupGoods.split(',').sort().join(',')) {
                        k.is_choose = !k.is_choose;
                    }
                    if (!k.is_choose) {
                        is = false;
                    }
                })
                v.is_choose = is ? true : false;
            }
        })
        this.setState({
            shop_list: list
        }, () => {
            this.reset_price();
        })
    }
    //删除商品
    deleteBtn(obj){
        const _this = this;
        confirm({
            title: '确定删除该商品吗？',
            onOk() {
                let list = _this.state.shop_list;
                list.forEach((v, index) => {
                    if (v.storeName === obj.storeName) {
                        let num = 0;
                        v.list.forEach((k, n) => {
                            if (k.goodsId === obj.goodsId) {
                                num = n;
                            }
                        })
                        v.list.splice(num, 1);
                    }
                    // 选中所有的商品删除
                    if (v.list.length === 0) {
                        list.splice(index, 1);
                    }
                })
                _this.setState({
                    shop_list: list
                }, () => {
                    _this.reset_price();
                    _this.reset_local_cart(obj.goodsId, obj.propertyGroupGoods);
                })      
            }
        })
    }
    //删除选中的商品
    deleteGood(storeName){
        // 检测是否至少选择了一种商品
        const list = this.state.shop_list.find(v => {
            return v.storeName === storeName;
        })
        if (!list.goods_account) {
            message.error('请至少选择一个商品删除');
            return;
        }
        const _this = this;
        confirm({
            title: '确定删除选中的商品吗？',
            onOk() {
                let list = _this.state.shop_list;
                list.forEach((v, index) => {
                    if (v.storeName === storeName) {
                        // 删除local缓存
                        v.list.forEach(k => {
                            if (k.is_choose === true) {
                                _this.reset_local_cart(k.goodsId, k.propertyGroupGoods);
                            }
                        })
                        v.list = v.list.filter(k => {
                            return k.is_choose === false;
                        })
                        // 选中所有的商品删除
                        if (v.list.length === 0) {
                            list.splice(index, 1);
                        }
                    }
                })
                _this.setState({
                    shop_list: list
                }, () => {
                    _this.reset_price();
                })     
            }
        })
    }
    //清空所有商品
    emptyGood(storeName){
        const _this = this;
        confirm({
            title: '确定清空该订单的所有商品吗？',
            onOk() {
                let list = _this.state.shop_list;
                let num = 0;
                list.forEach((v, index) => {
                    if (v.storeName === storeName) {
                        num = index;
                        // 清除local缓存
                        v.list.forEach(k => {
                            _this.reset_local_cart(k.goodsId, k.propertyGroupGoods);
                        })
                    }
                })
                list.splice(num, 1);
                _this.setState({
                    shop_list: list
                }, () => {
                    _this.reset_price();
                })    
            }
        })
    }
    // 商品删除处理本地存储
    reset_local_cart(goods_id, propertyGroupGoods) {
        let local_list = JSON.parse(localStorage.shopCartList);
        let list = local_list.filter((v, index) => {
            return v.goodsId !== goods_id || v.propertyGroupGoods !== propertyGroupGoods;
        })
        localStorage.shopCartList = JSON.stringify(list);
        // 更改购物车数量
        let { dispatch } = this.props;
        if (list) {
            dispatch(setShopCartNum(list.length));
        }
    }
    // 更改购买数量
    changeBuyNumber(obj, type) {
        let list = this.state.shop_list;
        console.log(this.state.shop_list);
        list.forEach(v => {
            if (v.storeName === obj.storeName) {
                v.list.forEach(k => {
                    if (k.goodsId === obj.goodsId && k.propertyGroupGoods === obj.propertyGroupGoods) {
                        if (type === 'reduce') {
                            if (parseInt(k.goodsNum) !== 1) {
                                k.goodsNum = parseInt(k.goodsNum) - 1;
                            }
                        } else {
                            k.goodsNum = parseInt(k.goodsNum) + 1;
                        }
                    }
                })
            }
        })
        this.setState({
            shop_list: list
        }, () => {
            this.reset_price();
        })
    }
    // 重新结算订单价格
    reset_price() {
        // 计算价格
        let list = this.state.shop_list;
        list.forEach(v => {
            // 计算单个订单商品总件数
            v.goods_account = v.list.reduce((total, k) => {
                if (k.is_choose) {
                    return total + parseInt(k.goodsNum);
                } else {
                    return total + 0;
                }
            }, 0);

            // 计算单个订单商品总价格
            v.goods_price = v.list.reduce((total, k) => {
                if (k.is_choose) {
                    return total + (parseInt(k.goodsNum) * parseInt(k.goodsPrice));
                } else {
                    return total + 0;
                }
            }, 0);
        })
        this.setState({
            shop_list: list
        })
    }
    // 结算
    settlement(storeName) {
        if (!this.props.loginStore.login) {
            message.error('账号未登录');
            return;
        }

        // 检测结算订单是否至少选择了一种商品
        const list = this.state.shop_list.find(v => {
            return v.storeName === storeName;
        })
        if (!list.goods_account) {
            message.error('请至少选择一个商品');
            return;
        }

        // 订单选择付款商品
        const choose_list = list.list.filter(v => {
            return v.is_choose === true;
        })

        // 付款商品从购物车清除
        choose_list.forEach(v => {
            this.reset_local_cart(v.goodsId, v.propertyGroupGoods);
        })

        localStorage.orderList = JSON.stringify(choose_list);
        this.props.history.push('/confirmOrder');
    }
    render() {
        return (
            <div className="shopCart-page">
                <div className="shopCart-page-warp">
                    {/* 未登录 */}
                    {/* {
                        !this.props.loginStore.login ? (
                            <div className="shopCart-page-nologin">
                                <p>您还没有登录！登录后购物车的商品将保存到您的账号中</p>
                                <a href={window.BT_URL + 'login?redirectUrl=shop'}>立即登录</a>
                            </div>
                        ) : null
                    } */}
                    {/* 购物车 */}
                    {
                        this.state.shop_list.length !== 0 ? (
                            <div className="shopCart-main">
                                <div className="title">
                                    <i></i>
                                    <h2>全部商品</h2>
                                </div>
                                <div className="tableCart">
                                    <ul>
                                        <li style={{width: '65px'}}>&nbsp;</li>
                                        <li style={{width: '625px', textAlign: 'left'}}>商品</li>
                                        <li style={{width: '100px'}}>单价</li>
                                        <li style={{width: '150px'}}>数量</li>
                                        <li style={{width: '120px'}}>小计</li>
                                        <li style={{width: '100px'}}>操作</li>
                                        <li style={{width: '40px'}}>&nbsp;</li>
                                    </ul>
                                    {
                                        this.state.shop_list.map(item => {
                                            return (
                                                <ShopCartItem
                                                    key={item.producerId}
                                                    {...item}
                                                    checkAll={() => this.checkAll(item)}
                                                    checkItem={(v) => this.checkItem.bind(this, v)}
                                                    changeBuyNumber={(v, type) => this.changeBuyNumber.bind(this, v, type)}
                                                    deleteBtn={(v) => this.deleteBtn.bind(this, v)}
                                                    deleteGood={() => this.deleteGood(item.storeName)}
                                                    emptyGood={() => this.emptyGood(item.storeName)}
                                                    settlement={() => this.settlement(item.storeName)}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className="cartNoData">
                                <p>购物车内暂时没有商品</p>
                                <h2>
                                    <Link to="/">
                                        继续购物<em>&gt;</em>
                                    </Link>
                                </h2>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { loginStore: state.login }
}

export default withRouter(connect(mapStateToProps)(ShopCart));