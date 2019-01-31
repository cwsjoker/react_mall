import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'

import { setShopCartNum } from '../../store/actionCreators.js';

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
            const list = JSON.parse(list_str);
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
            // shopCart.shop_list = store_list;
            console.log(store_list);
            this.setState({
                shop_list: store_list
            })
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
        let list = this.state.shop_list;
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
        this.setState({
            shop_list: list
        }, () => {
            this.reset_price();
            this.reset_local_cart(obj.goodsId, obj.propertyGroupGoods);
        })
    }
    //删除选中的商品
    deleteGood(storeName){
        let list = this.state.shop_list;
        list.forEach((v, index) => {
            if (v.storeName === storeName) {
                // 删除local缓存
                v.list.forEach(k => {
                    if (k.is_choose === true) {
                        this.reset_local_cart(k.goodsId, k.propertyGroupGoods);
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
        this.setState({
            shop_list: list
        }, () => {
            this.reset_price();
        })
    }
    //清空所有商品
    emptyGood(storeName){
        let list = this.state.shop_list;
        let num = 0;
        list.forEach((v, index) => {
            if (v.storeName === storeName) {
                num = index;
                // 清除local缓存
                v.list.forEach(k => {
                    this.reset_local_cart(k.goodsId, k.propertyGroupGoods);
                })
            }
        })
        list.splice(num, 1);
        this.setState({
            shop_list: list
        }, () => {
            this.reset_price();
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
        list.forEach(v => {
            if (v.storeName === obj.storeName) {
                v.list.forEach(k => {
                    if (k.goodsId === obj.goodsId) {
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
            console.log('账号未登录');
            return;
        }

        // 检测结算订单是否至少选择了一种商品
        const list = this.state.shop_list.find(v => {
            return v.storeName === storeName;
        })
        if (!list.goods_account) {
            console.log('请至少选择一个商品');
            return;
        }

        const choose_list = list.list.filter(v => {
            return v.is_choose === true;
        })
        console.log(choose_list);
        localStorage.orderList = JSON.stringify(choose_list);
        this.props.history.push('/confirmOrder')
		// location.href="./settlement.html?type=2";
    }
    render() {
        // 未登录
        let noLogin_dom = null;
        if (!this.props.loginStore.login) {
            noLogin_dom = (
                <div className="shopCart-page-nologin">
                    <p>您还没有登录！登录后购物车的商品将保存到您的账号中</p>
                    <a href="https://bttmall.com/login">立即登录</a>
                </div>
            )
        }
        let shopCart_dom = null;
        if (this.state.shop_list.length !== 0) {
            shopCart_dom = (
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
                                    <div className="shop-order-main" key={item.producerId}>
                                        <div className="shop-order-title">
                                            <div>
                                                <label className={ item.is_choose ? 'on' : '' }><input type="checkbox" onClick={this.checkAll.bind(this, item)} /></label>
                                            </div>
                                            <div>
                                                <p><img src="../../assets/images/icon1.png" /><a>{item.storeName}</a><span>自营</span></p>
                                            </div>
                                        </div>
                                        {
                                            item.list.map((v, i) => {
                                                return (
                                                    <div className="shop-order-con" key={i}>
                                                        <div>
                                                            <label className={ v.is_choose ? 'on' : '' }>
                                                                <input className="checkItem" type="checkbox" onClick={this.checkItem.bind(this, v)} />
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <a className="storeCart" href="#">
                                                                <img src={'http://ltalk-website.oss-cn-hangzhou.aliyuncs.com/' + v.goodsImgUrl} />
                                                                <p>{v.goodsIntroduce}</p>
                                                            </a>
                                                        </div>
                                                        <div>
                                                            <div className="priceGood">
                                                                <span>{v.goodsPrice + ' ' +v.symbol}</span>
                                                                <em>热销</em>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="numberGood">
                                                                <div className="trdiv">
                                                                    <button className="button2" onClick={this.changeBuyNumber.bind(this, v, 'reduce')}>-</button>
                                                                    <input type="text" className="qty_item" readOnly="readonly" value={v.goodsNum}/>
                                                                    <button className="button1" onClick={this.changeBuyNumber.bind(this, v, 'add')}>+</button>
                                                                </div>
                                                                <em>有货</em>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="total">{v.goodsPrice*v.goodsNum + ' ' + v.symbol}</span>
                                                        </div>
                                                        <div>
                                                            <a href="javascript:;" className="deleteBtn" onClick={this.deleteBtn.bind(this, v)}>删除</a>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className="shop-order-footer">
                                            <div><label className={ item.is_choose ? 'on' : '' }><input type="checkbox" onClick={this.checkAll.bind(this, item)} />全选</label></div>
                                            <div style={{flex: 1}}>
                                                <div className="setetlement">
                                                    <span className="deleteGood" onClick={this.deleteGood.bind(this, item.storeName)}>删除选中的商品</span>
                                                    <span className="emptyGood" onClick={this.emptyGood.bind(this, item.storeName)}>清空商品</span>
                                                    <div className="settR fr">
                                                        <span className="goodsNum">已选择<b id="totalnum">{item.goods_account}</b>件商品</span>
                                                        <span className="totalPriceBtn"><b>总价：</b><em>{item.goods_price + ' ' + item.symbol}</em></span>
                                                        <a href="javascript:;" onClick={this.settlement.bind(this, item.storeName)}>去结算</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        } else {
            shopCart_dom = (
                <div className="cartNoData">
                    <p>购物车内暂时没有商品</p>
                    <h2>
                        <a href="/">继续购物<em>&gt;</em></a>
                    </h2>
                </div>
            )
        }
        return (
            <div className="shopCart-page">
                <div className="shopCart-page-warp">
                    {/* 未登录 */}
                    {noLogin_dom}
                    {/* 购物车有数据 */}
                    {/* 购物车没有数据 */}
                    {shopCart_dom}
                    
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { loginStore: state.login }
}

export default withRouter(connect(mapStateToProps)(ShopCart));