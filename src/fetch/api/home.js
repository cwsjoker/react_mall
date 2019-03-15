import { Fetch } from '../fetch.js'

export default class home {
    // 获取每日推荐列表
    static getDailyList() {
        return Fetch.get('/mall/backend/homepage/queryHomePageCarefullyChosen');
    }
    // 获取热门推荐
    static getHotList() {
        return Fetch.get('/mall/backend/homepage/queryHomePageRecommend');
    }
    // 获取店铺菜单
    static getStoreMenu() {
        return Fetch.get('/mall/backend/homepage/queryMenu');
    }
    // 获取店铺的商品
    static getProduceList(data) {
        return Fetch.post('/mall/backend/homepage/producer/queryProducerGoodsInfoById', data);
    }
    // 获取店铺的信息
    static getStoreInfo(data) {
        return Fetch.postFormData('/mall/backend/homepage/producer/queryProducerInfoById', data);
    }
    // 获取店铺的挖矿详情
    static getStoreNimingInfo(data) {
        return Fetch.get('/mall/backend/homepage/producer/queryMiningInfo', data);
    }

    // 获取商品详情
    static getGoodsDetail(data) {
        return Fetch.post('/mall/backend/goods/queryGoodsInfoById', data);
    }

    // 根据商品属性查询价格
    static getByGoodsQueryPrice(data) {
        return Fetch.post('/mall/backend/goods/queryGoodsPriceByIdAndInventory', data);
    }

    // 获取今日可挖矿数量
    static getDayNiming(data) {
        return Fetch.get('/mall/backend/homepage/producer/queryMiningInfo', data);
    }

    // 特定币种换算成usdt
    static getUSDT(data) {
        return Fetch.get('/mall/backend/homepage/producer/coinConvert', data);
    }

    // 全部币种的usdt转换率
    static getAllUSDT() {
        return Fetch.get('/mall/backend/homepage/producer/coinConvert');
    }

    // 提交订单
    static createNewOrder(data) {
        return Fetch.post('/mall/backend/order/createNewOrder', data);
    }

    // 获取订单详情
    static queryOrderInfo(data) {
        return Fetch.post('/mall/backend/order/queryOrderInfoById', data);
    }

    // 支付订单
    static orderPayment(data) {
        return Fetch.post('/mall/backend/order/orderPayment', data);
    }

    // 获取订单列表
    static queryAllOrderByUserId(data) {
        return Fetch.post('/mall/backend/order/queryAllOrderByUserId', data);
    }

    // 查询用户待付款和待发货的数量
    static queryOrderCountStatus() {
        return Fetch.post('/mall/backend/order/queryOrderCountStatus');
    }

    // 取消订单
    static cancelOrderById(data) {
        return Fetch.post('/mall/backend/order/cancelOrderById', data);
    }

    // 删除订单
    static removeOrderById(data) {
        return Fetch.post('/mall/backend/order/removeOrderById', data);
    }

    // 获取挖矿列表
    static selectShopMiningOrderList() {
        return Fetch.get('/mall/backend/shopMiningOrder/selectShopMiningOrderList');
    }

    // 获取订单挖矿流水
    static shopOrderMiningFlow(data) {
        return Fetch.get('/mall/backend/shopMiningOrder/shopOrderMiningFlow', data)
    }

    // 获取省级三级联动的地址
    static queryBaseAddress(data) {
        return Fetch.post('/mall/backend/customer/address/queryBaseAddress', data);
    }

    static queryTokenInfo(data) {
        return Fetch.get('/mall/backend/homepage/producer/queryTokenInfo', data);
    }
}