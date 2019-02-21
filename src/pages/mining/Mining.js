import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import Footer from '../../components/Footer.js';
import '../../assets/style/mining.scss';
import $home_api from '../../fetch/api/home';

const Mining = class Mining extends Component {
    constructor() {
        super();
        this.state = {
            list: []
        }
    }
    async componentDidMount() {
        const obj_req = await $home_api.selectShopMiningOrderList();
        if (obj_req) {
            console.log(obj_req);
            const { data } = obj_req.data;
            data.forEach((v) => {
				v.isDetail = false;
				v.list = [];
			})
            this.setState({
                list: data
            })
        }
    }
    async showList(id, index) {
        const query_data = {
            orderId: id,
            pageNo: 1,
            pageSize: 10
        };
        const obj_req = await $home_api.shopOrderMiningFlow(query_data);
        if (obj_req) {
            // console.log(obj_req);
            const { list } = obj_req.data.data;
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
    render() {
        const { list } = this.state;
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
                        {/* 活动时间 */}
                        <div className="mining-active-time"></div>
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
                                                <div><span>已产出</span></div>
                                                <div><span>昨日产出</span></div>
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
                                                        <p>{item.alreadyProduced || 0}</p>
                                                        <p>{item.symbol}</p>
                                                    </div>
                                                </div>
                                                <div className="product-number">
                                                    <div>
                                                        <p>{item.yesterdayProduced || 0}</p>
                                                        <p>{item.symbol}</p>
                                                    </div>
                                                </div>
                                                <div className="product-number">
                                                    <div>
                                                        <p>{item.todayProduced || 0}</p>
                                                        <p>{item.symbol}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 流水列表 */}
                                            {
                                                item.isDetail ? (
                                                    <div className="table-list">
                                                        <div className="list-title">
                                                            <div>时间</div>
                                                            <div>数量</div>
                                                            <div>操作</div>
                                                        </div>
                                                        <div className="list-body">
                                                            {
                                                                item.list.map((v, i) => {
                                                                    return (
                                                                        <div key={i} className="list-body-item">
                                                                            <div>{v.miningDate}</div>
                                                                            <div>{v.mining + v.symbol}</div>
                                                                            <div></div>
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