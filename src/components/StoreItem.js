import React, { Component } from 'react';
import { withRouter } from 'react-router'

const StoreItem = class StoreItem extends Component {
    goto(id) {
        this.props.history.push('/goodsDetail?goodsId='+id)
    }
    render() {
        const { id, imageUrl, name, introduce, price, symbol } = this.props.data;
        return (
            <li className="hot-list-item" onClick={this.goto.bind(this, id)}>
                <div className="hot-list-item-con">
                    <a href="javascript:;">
                        <img  src={'http://ltalk-website.oss-cn-hangzhou.aliyuncs.com/' + imageUrl}/>
                        <h2>{name}</h2>
                        <p>{introduce}</p>
                        <h3>{price + ' ' + symbol}</h3>
                    </a>
                    <div className="hot-list-item-btn">
                        <a href="javascript:;">立即购买</a>
                    </div>
                </div>
            </li>
        )
    }
}

export default withRouter(StoreItem);
