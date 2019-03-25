import * as React from 'react';
import { Route, Switch }  from 'react-router-dom';


// import history from '../utils/history';
import requireAuthentication from '../components/RequireAuthentication.js'

import Home from '../pages/Home.js'; // 首页
import ShopCart  from '../pages/shopCart/ShopCart.js'; // 购物车页面
import MyOrder from '../pages/myOrder/MyOrder.js'; // 我的订单页面
import StoreIndex from '../pages/storeIndex/StoreIndex.js'; // 商店页面
import StoreHome from '../pages/storeHome/StoreHome.js'; // 商店首页
import GoodsDetail from '../pages/goodsDetail/GoodsDetail.js'; // 商品详情页面
import ConfirmOrder from '../pages/myOrder/ConfirmOrder.js'; // 确认订单页面
import Payment from '../pages/myOrder/Payment.js'; // 支付页面
import OrderDetail from '../pages/myOrder/OrderDetail.js'; // 订单详情

export default () => {
    return (
        // <Router>
        <Switch>
            {/* <div className="home-main-wrap"> */}
                <Route exact path="/" component={Home} />
                <Route path="/shopcart" component={ShopCart} />
                <Route path="/myOrder" component={requireAuthentication(MyOrder)} />
                <Route path="/storeIndex" component={StoreIndex} />
                <Route path="/storeHome" component={StoreHome} />
                <Route path="/goodsDetail" component={GoodsDetail} />
                <Route path="/confirmOrder" component={requireAuthentication(ConfirmOrder)} />
                <Route path="/payment" component={requireAuthentication(Payment)} />
                <Route path="/orderDetail" component={requireAuthentication(OrderDetail)} />
            {/* </div> */}
        </Switch>
        // </Router>
    )
}