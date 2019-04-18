import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { Spin } from 'antd';
import $home_api from '../../fetch/api/home.js'
import changeUsdt from '../../utils/convertUsdt';


class Recommend extends Component {
    constructor() {
        super();
        this.state = {
            daily_list: [],
            daily_spinning: true,
            hot_list: [],
            hot_list_spinning: true,
        }
    }
    componentDidMount() {
        // 每日精选
        $home_api.getDailyList().then(async res => {
            if (res) {
                const data = await changeUsdt(res.data.data);
                this.setState({
                    daily_list: data,
                    daily_spinning: false
                })
            }
        })
        
        // 热门推荐
        $home_api.getHotList().then(async res => {
            if (res) {
                const data = await changeUsdt(res.data.data);
                this.setState({
                    hot_list: data,
                    hot_list_spinning: false
                })
            }
        })
    }
    // async changeUsdt(list) {
    //     list.forEach(v => {
    //         v.change_price_usdt = 0;
    //     });
    //     const res = await $home_api.getAllUSDT();
    //     if (res) {
    //         const usdt_change_obj = res.data.data;
    //         const re_list = list.map(v => {
    //             v.change_price_usdt = v.price * usdt_change_obj[v.symbol];
    //             return v;
    //         })
    //         return re_list;
    //     } else {
    //         return list;
    //     }
    // }
    goto(id) {
        this.props.history.push('/goodsDetail?goodsId='+id)
    }
    render() {
        const { daily_list, daily_spinning, hot_list_spinning } = this.state;
        return (
            <div className="recommend-main">
                <div className="recommend-daily">
                    <div className="home-tip-title">
                        <i></i>
                        <h2>每日精选</h2>
                        <span>智能潮货 嗨购不停</span>
                    </div>
                    <div>
                    <Spin tip="Loading..." spinning={daily_spinning}>
                        <ul className="siftList">
                            {
                                daily_list.map((item, index) => {
                                    return (
                                        <li key={item.id} style={(index + 1) % 3 === 0 ? {marginRight: '0px'} : {marginTop: '10px'}} onClick={this.goto.bind(this, item.goodsId)}>
                                            <div>
                                                <img src={window.BACK_URL + item.imageUrl} alt="" />
                                                <h2>{item.goodsName}  {index}</h2>
                                                <p>{item.inventoryIntroduce}</p>
                                                <h3>
                                                    {item.price} {item.symbol}
                                                    {
                                                        Number(item.change_price_usdt) !== 0 ? <span>≈{item.change_price_usdt}USDT</span> : null
                                                    }
                                                </h3>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Spin>

                    </div>
                </div>
                <div className="recommend-hot">
                    <div className="home-tip-title">
                        <i></i>
                        <h2>热门推荐</h2>
                        <span>平台担保 假一赔十</span>
                    </div>
                    <Spin tip="Loading..." spinning={hot_list_spinning}>
                        <ul className="hotList">
                            {
                                this.state.hot_list.map(item => {
                                    return (
                                        <li key={item.id} onClick={this.goto.bind(this, item.goodsId)}>
                                            <div className="hotDiv">
                                                {/* <span v-if="hot.ifShow" class="hotIco">自营</span> */}
                                                <div>
                                                    <img src={window.BACK_URL + item.imageUrl} alt="" />
                                                    <h2>{item.goodsName}</h2>
                                                    <p>{item.inventoryIntroduce}</p>
                                                    <h3>
                                                        {item.price} {item.symbol}
                                                        {
                                                            Number(item.change_price_usdt) !== 0 ? <span>≈{item.change_price_usdt}USDT</span> : null
                                                        }
                                                    </h3>
                                                </div>
                                                <div className="btnDiv">
                                                    <div>立即购买</div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Spin>
                </div>
            </div>
        )
    }
}

export default withRouter(Recommend);