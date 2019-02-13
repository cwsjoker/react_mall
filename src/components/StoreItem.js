import React from 'react';

export default function StoreItem(props) {
    const { id, imageUrl, name, introduce, price, symbol } = props.data;
    return (
        <li className="hot-list-item">
            <a href={'/goodsDetail?goodsId=' + id}>
                <div className="hot-list-item-con">
                    <div>
                        <img  src={window.BACK_URL + imageUrl}/>
                        <h2>{name}</h2>
                        <p>{introduce}</p>
                        <h3>{price + ' ' + symbol}</h3>
                    </div>
                    <div className="hot-list-item-btn">
                        <div href="javascript:;">立即购买</div>
                    </div>
                </div>
            </a>
        </li>
    )
};
