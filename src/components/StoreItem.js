import React from 'react';
import { Link }  from 'react-router-dom';

export default function StoreItem(props) {
    const { id, imageUrl, name, price, symbol, change_price_usdt, inventoryIntroduce } = props.data;
    return (
        <li className="hot-list-item">
            {/* <Link to={'/goodsDetail?goodsId=' + id}> */}
                <div className="hot-list-item-con">
                    <div>
                        <img  src={window.BACK_URL + imageUrl} alt="" />
                        <h2>{name}</h2>
                        <p>{inventoryIntroduce}</p>
                        <h3>
                            {price + ' ' + symbol}
                            {
                                Number(change_price_usdt) !== 0 ? <span>≈{change_price_usdt}USDT</span> : null
                            }
                        </h3>
                    </div>
                    <div className="hot-list-item-btn">
                        <div>即将开放</div>
                    </div>
                </div>
            {/* </Link> */}
        </li>
    )
};
