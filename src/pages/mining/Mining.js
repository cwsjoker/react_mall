import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import { message } from 'antd';
import Footer from '../../components/Footer.js';
import '../../assets/style/mining.scss';
import $home_api from '../../fetch/api/home';
import { getQueryString } from '../../utils/operLocation.js'
import Cookie from 'js-cookie';
import CountDownTxt from '../../components/CountDownTxt.js'
import { secondToDateMin } from '../../utils/operation';

const Mining = class Mining extends Component {
    constructor() {
        super();
        this.state = {
            list: [],
            speed_obj: {}
        }
    }
    async componentDidMount() {

        // 先获取搜索参数token
        const query_obj = getQueryString(this.props.location.search);
        if (query_obj.token) {
            Cookie.set('token', query_obj.token, { expires: 1 });
        }

        this.getOrder();
        this.getMiningSpeed();
    }
    // 获取收矿订单
    async getOrder() {
        const obj_req = await $home_api.selectShopMiningOrderList();
        if (obj_req) {
            const { data } = obj_req.data;
            console.log(data);
            data.forEach((v) => {
				v.isDetail = false;
                v.list = [];
                v.miningFlowDTOList.forEach(k => {
                    if (k.mininged === 0) {
                        v.is_mining_id = k.id;
                    }
                    if (k.mininged === -1) {
                        const d1 = new Date(k.systemDate);
                        const d2 = new Date(k.nextMiningDate);
                        const diff_count = parseInt(d2 - d1) / 1000;
                        v.diff_count = diff_count;
                    }
                })

			})
            this.setState({
                list: data
            }, () => {
                console.log(this.state.list);
            })
        }
    }
    async showList(id, index) {
        const query_data = {
            orderId: id,
            pageNo: 1,
            pageSize: 50
        };
        const obj_req = await $home_api.shopOrderMiningFlow(query_data);
        if (obj_req) {
            const { list } = obj_req.data.data;
            
            list.forEach(v => {
                const d1 = new Date(v.systemDate);
                const d2 = new Date(v.nextMiningDate);
                const diff_count = parseInt(d2 - d1) / 1000;
                v.diff_count = diff_count;
            })
            console.log(list);
            const state_list = this.state.list;
            state_list[index]['list'] = list;
            state_list[index]['isDetail'] = true;
            this.setState({
                list: state_list
            })
        }

    }
    hideList(index) {
        const state_list = this.state.list;
        state_list[index]['isDetail'] = false;
        this.setState({
            list: state_list
        })
    }
    // 收矿
    // async collectOre(id, orderId, index) {
    //     console.log(id)
    //     console.log(orderId)
    //     console.log(index)
    //     // return;
    //     const res = await $home_api.collectOre({miningFlowId: id});
    //     if (res) {
    //         message.success('收矿成功');
    //         this.showList(orderId, index);
    //     }
    // }
    async collectOre(id) {
        console.log(id)
        const res = await $home_api.collectOre({miningFlowId: id});
        if (res) {
            message.success('收矿成功');
            this.getOrder();
        }
    }
    // 查询挖矿速率
    async getMiningSpeed() {
        const res = await $home_api.miningSpeed();
        if (res) {
            console.log(res.data.data);
            this.setState({
                speed_obj: res.data.data
            })
        }
    }
    render() {
        const { list, speed_obj } = this.state;
        return (
            <div className="mining-page">
                {/* 头部 */}
                <div className="header-mining">
                    <div className="header-mining-main">
                        <Link to="./"><div></div></Link>
                        <div>矿区</div>
                    </div>
                </div>
                <div className="mining-main">
                    <div>
                        {/* 邀请好友 */}
                        <div className="mining-active-invitation">
                            <div>
                                <div>
                                    <p>初始产出速率:<span>24小时</span></p>
                                    <p>当前产出速率:<span>{secondToDateMin(speed_obj.currentMiningRate)}</span></p>
                                    <p>可以加速产出:<span>{secondToDateMin(speed_obj.allowSpeedDuration)}</span></p>
                                    <p>每一邀请一个好友购买商品可加速产出<span>28.8</span>分钟</p>
                                    <p>(一个账户仅一次加速机会)</p>
                                </div>
                                <div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        {/* 活动时间 */}
                        <div className="mining-active-time">
                            <p>挖矿说明:</p>
                            <p>购物即挖矿是比特天猫(BTTMALL)商城特有的价值通证分配方式</p>
                            <p>1. 所有的商品都可参与购物即挖矿活动</p>
                            <p>2. 总挖矿量为商品总价，每日可产出1%，产出的通证可自由转出转入以及买卖。</p>
                            <p>3. 商品如产生质量问题收货后15日内可更换</p>
                            <p>4. 抢购时间段内每个用户单商品仅限购一件</p>
                            <div className="mining-active-time-desc"></div>
                            <p>例如：</p>
                            <p>用户使用10000JT购买了一个100克的BTTMALL投资黄金</p>
                            <p>每日挖矿量则为10000JT/100天=100JT</p>
                            <p>100天后产出结束即挖矿结束。</p>
                            <p>*该活动的最终解释权为BTTMALL所有*</p>
                        </div>
                        {/* 表格 */}
                        {
                            list.map((item, index) => {
                                return (
                                    <div key={index} className="table-one">
                                        <div className="table-one-con">
                                            {/* 表格标题 */}
                                            <div className="table-title">
                                                <div>
                                                    <span>{item.orderTime}</span>
                                                    <span>订单编号:{item.orderNumber}</span>
                                                </div>
                                                <div><span>总产出</span></div>
                                                <div><span>待产出</span></div>
                                                <div><span>已产出</span></div>
                                                <div><span>今日产出</span></div>
                                            </div>
                                            {/* 订单详情 */}
                                            <div className="table-body cleafix">
                                                <div className="product-list cleafix">
                                                    {
                                                        item.orderItemDTOList.map((v, i) => {
                                                            return (
                                                                <div key={i} className="product-item cleafix">
                                                                    <div>
                                                                        <img src={window.BACK_URL + v.goodImgUrl} alt="" />
                                                                    </div>
                                                                    <div>
                                                                        <p>{v.produceName + '    ' + v.goodsName}</p>
                                                                        <p>x  {v.goodCount}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="product-number">
                                                    <div>
                                                        <p>{item.totalProduced || 0}</p>
                                                        <p>{item.symbol}</p>
                                                    </div>
                                                </div>
                                                <div className="product-number">
                                                    <div>
                                                        <p>{item.totalProduced || 0}</p>
                                                        <p>{item.symbol}</p>
                                                    </div>
                                                </div>
                                                <div className="product-number">
                                                    <div>
                                                        <p>{item.alreadyProduced || 0}</p>
                                                        <p>{item.symbol}</p>
                                                    </div>
                                                </div>
                                                <div className="product-number">
                                                    <div>
                                                        <p>{item.todayProduced || 0}</p>
                                                        <p>{item.symbol}</p>
                                                        {
                                                            item.is_mining_id ? (
                                                                <div className="order-mining-btn" onClick={this.collectOre.bind(this, item.is_mining_id)}>点击收矿</div>
                                                            ) : null
                                                        }
                                                        <div>距离下次产出:<CountDownTxt discount={item.diff_count} /></div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 流水列表 */}
                                            {
                                                item.isDetail ? (
                                                    <div className="table-list">
                                                        <div className="list-title">
                                                            <div>出矿时间</div>
                                                            <div>数量</div>
                                                            <div>状态</div>
                                                            {/* <div>操作</div> */}
                                                        </div>
                                                        <div className="list-body">
                                                            {
                                                                item.list.map((v, i) => {
                                                                    return (
                                                                        <div key={i} className="list-body-item">
                                                                            <div>{v.mininged === -1 ? v.nextMiningDate : v.miningDate}</div>
                                                                            <div>{v.mining + v.symbol}</div>
                                                                            <div>
                                                                                {
                                                                                    v.mininged === 0 ? <span className="red">未收矿</span> :
                                                                                    v.mininged === 1 || v.mininged === 2 ? <span>已收矿</span> :
                                                                                    v.mininged === 3 ? <span className="red">过期</span> : 
                                                                                    v.mininged === -1 ? <div className="count-down-txt">距离下次产出:<CountDownTxt discount={v.diff_count} /></div> : null
                                                                                }
                                                                            </div>
                                                                            {/* <div>
                                                                                {
                                                                                    v.mininged === 0 ? <span onClick={this.collectOre.bind(this, v.id, item.orderId, index)}>点击收矿</span> : null
                                                                                }
                                                                            </div> */}
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                item.list.length === 0 ? <div className="list-body-nodata">暂无流水数据</div> : null
                                                            }
                                                        </div>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                        {/* 显示流水按钮 */}
                                        <div className="table-btn">
                                        {
                                            !item.isDetail ? (
                                                <div className="btn-down" onClick={this.showList.bind(this, item.orderId, index)} ></div>
                                            ) : (
                                                <div className="btn-up" onClick={this.hideList.bind(this, index)}></div>
                                            )
                                        }
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {/* 暂无订单 */}
                        {
                            list.length === 0 ? (
                                <div className="table-two">
                                    <div>
                                        <div></div>
                                        <div>
                                            <div>
                                                <div></div>
                                                <div>
                                                    <p>抱歉！暂无订单</p>
                                                    <p><a href="./">马上前往</a>商城</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                {/* 尾部 */}
                <Footer />
            </div>
        )
    }
}

export default Mining;