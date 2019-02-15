import React, { Component } from 'react';
import logo_img from '../assets/images/icon1.png';

export default class ShopCartItem extends Component {
    render()  {
        const {
            is_choose,
            storeName,
            list,
            goods_account,
            goods_price,
            symbol,
            checkAll, //全选
            checkItem, // 单选
            changeBuyNumber, // 修改数量
            deleteBtn, // 删除某个
            deleteGood, // 删除选中
            emptyGood,  // 清空所有
            settlement // 结算
        } = this.props;
        return (
            <div className="shop-order-main">
                <div className="shop-order-title">
                    <div>
                        <label className={ is_choose ? 'on' : '' }><input type="checkbox" onClick={checkAll} /></label>
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
                                        <input className="checkItem" type="checkbox" onClick={checkItem(v)} />
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
                                            <button className="button2" onClick={changeBuyNumber(v, 'reduce')}>-</button>
                                            <input type="text" className="qty_item" readOnly="readonly" value={v.goodsNum}/>
                                            <button className="button1" onClick={changeBuyNumber(v, 'add')}>+</button>
                                        </div>
                                        <em>有货</em>
                                    </div>
                                </div>
                                <div>
                                    <span className="total">{v.goodsPrice*v.goodsNum + ' ' + v.symbol}</span>
                                </div>
                                <div>
                                    <a href="javascript:;" className="deleteBtn" onClick={deleteBtn(v)}>删除</a>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="shop-order-footer">
                    <div><label className={ is_choose ? 'on' : '' }><input type="checkbox" onClick={checkAll} />全选</label></div>
                    <div style={{flex: 1}}>
                        <div className="setetlement">
                            <span className="deleteGood" onClick={deleteGood}>删除选中的商品</span>
                            <span className="emptyGood" onClick={emptyGood}>清空商品</span>
                            <div className="settR fr">
                                <span className="goodsNum">已选择<b id="totalnum">{goods_account}</b>件商品</span>
                                <span className="totalPriceBtn"><b>总价：</b><em>{goods_price + ' ' + symbol}</em></span>
                                <a href="javascript:;" onClick={settlement}>去结算</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}