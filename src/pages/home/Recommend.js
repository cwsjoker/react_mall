import React, { Component } from 'react';
import { withRouter } from 'react-router'
import $home_api from '../../fetch/api/home.js'


class Recommend extends Component {
    constructor() {
        super();
        this.state = {
            daily_list: [],
            hot_list: []
        }
    }
    componentDidMount() {
        $home_api.getDailyList().then(res => {
            if (res) {
                this.setState({
                    daily_list: res.data.data
                })
            }
        })
        $home_api.getHotList().then(res => {
            if (res) {
                this.setState({
                    hot_list: res.data.data
                })
            }
        })
    }
    goto(id) {
        this.props.history.push('/goodsDetail?goodsId='+id)
    }
    render() {
        return (
            <div className="recommend-main">
                <div className="recommend-daily">
                    <div>
                        <i></i>
                        <h2>每日精选</h2>
                        <span>智能潮货 嗨购不停</span>
                    </div>
                    <ul className="siftList cleafix">
						{
                            this.state.daily_list.map((item, index) => {
                                return (
                                    <li key={item.id} style={(index + 1) % 3 === 0 ? {marginRight: '0px'} : {marginTop: '10px'}} onClick={this.goto.bind(this, item.goodsId)}>
                                        <a href="javascript:;">
                                            <img src={window.BACK_URL + item.imageUrl} />
                                            <h2>{item.goodsName}  {index}</h2>
                                            <p>{item.inventoryIntroduce}</p>
                                            <h3>{item.price} {item.symbol}</h3>
                                        </a>
                                    </li>
                                )
                            })
                        }
					</ul>
                </div>
                <div className="recommend-hot">
                    <div>
                        <i></i>
                        <h2>热门推荐</h2>
                        <span>智能潮货 嗨购不停</span>
                    </div>
                    <ul className="hotList cleafix">
						{
                            this.state.hot_list.map(item => {
                                return (
                                    <li key={item.id} onClick={this.goto.bind(this, item.goodsId)}>
                                        <div className="hotDiv">
                                            {/* <span v-if="hot.ifShow" class="hotIco">自营</span> */}
                                            <a href="javascript:;">
                                                <img src={window.BACK_URL + item.imageUrl} />
                                                <h2>{item.goodsName}</h2>
                                                <p>{item.inventoryIntroduce}</p>
                                                <h3>{item.price} {item.symbol}</h3>
                                            </a>
                                            <div className="btnDiv">
                                                <a href="javascript:;">立即购买</a>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
					</ul>
                </div>
            </div>
        )
    }
}

export default withRouter(Recommend);