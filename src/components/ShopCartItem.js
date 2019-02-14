import React, { Component } from 'react';

import logo_img from '../assets/images/icon1.png';

export default class ShopCartItem extends Component {
    render()  {
        const { data } = this.props;
        const {is_choose, storeName, list, goods_account, goods_price, symbol } = data;
        return (
            <div className="shop-order-main">
                <div className="shop-order-title">
                    <div>
                        <label className={ is_choose ? 'on' : '' }><input type="checkbox" onClick={this.props.checkAll} /></label>
                    </div>
                    <div>
                        <p><img src={logo_img} /><a>{storeName}</a><span>自营</span></p>
                    </div>
                </div>
                {
                    list.map((v, i) => {
                        return (
                            <div className="shop-order-con" key={i}>
                                <div>
                                    <label className={ v.is_choose ? 'on' : '' }>
                                        <input className="checkItem" type="checkbox" onClick={this.checkItem.bind(this, v)} />
                                    </label>
                                </div>
                                <div>
                                    <a className="storeCart" href="#">
                                        <img src={window.BACK_URL + v.goodsImgUrl} />
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
                    <div><label className={ is_choose ? 'on' : '' }><input type="checkbox" onClick={this.checkAll.bind(this, data)} />全选</label></div>
                    <div style={{flex: 1}}>
                        <div className="setetlement">
                            <span className="deleteGood" onClick={this.deleteGood.bind(this, storeName)}>删除选中的商品</span>
                            <span className="emptyGood" onClick={this.emptyGood.bind(this, storeName)}>清空商品</span>
                            <div className="settR fr">
                                <span className="goodsNum">已选择<b id="totalnum">{goods_account}</b>件商品</span>
                                <span className="totalPriceBtn"><b>总价：</b><em>{goods_price + ' ' + symbol}</em></span>
                                <a href="javascript:;" onClick={this.settlement.bind(this, storeName)}>去结算</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}