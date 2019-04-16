import React, { Component } from 'react';
import { Spin } from 'antd';
import { getQueryString } from '../../utils/operLocation.js'
import '../../assets/style/storeHome.scss';
import StoreItem from '../../components/StoreItem'
import $home_api from '../../fetch/api/home'
import changeUsdt from '../../utils/convertUsdt';
import DaySaleModal from '../../components/DaySaleModal'

const StoreHome = class StoreHome extends Component {
    constructor() {
        super()
        this.state = {
            storeId: '',
            produceList: [],
            storeInfo: {},
            symbol: '',
            storeNimingInfo: {},
            spinning: true,
            modal_show: false,
            day_sale_list: [],
            currentTime: ''
        }
    }
    componentDidMount() {
        const id = getQueryString(this.props.location.search).id
        if (id) {
            this.setState({
                storeId: id
            }, () => {
                this.getList();
            })
        }
    }
    async getList() {
        const { storeId } = this.state;

        const [produce_rep, store_rep, mining_rep] = await Promise.all([
            $home_api.getProduceList({flag: "string", producerId: storeId, sort: "string"}),
            $home_api.queryTokenInfo({'producerId': parseInt(storeId)}),
            $home_api.getStoreNimingInfo({'producerId': parseInt(storeId)})
        ]);

        // 获取商品列表
        if (produce_rep) {
            const data = await changeUsdt(produce_rep.data.data)
            this.setState({
                produceList: data,
                spinning: false
            })
        }
        // 获取店铺的信息
        if (store_rep) {
            const { data } = store_rep.data;
            this.setState({
                storeInfo: data[0],
                symbol: data[0].symbol
            })
        }
        // 获取店铺的信息
        if (mining_rep) {
            this.setState({
                storeNimingInfo: mining_rep.data.data[0]
            })
        }

        // 获取今日发售列表
        $home_api.selectMiningProgress({
            'producerId': parseInt(storeId)
        }).then(res => {
            if (res) {
                const { miningPlanProgressDTOList, currentTime } = res.data.data;
                this.setState({
                    day_sale_list: miningPlanProgressDTOList,
                    currentTime: currentTime,
                })
            }
        })
    }
    render() {
        const { produceList, storeInfo, symbol, storeNimingInfo, spinning, modal_show, currentTime, day_sale_list } = this.state;
        return (
            <div className="storeHome-page">
                <div className="home-top">
                    <div className="code-info">
                        <div>
                            <div>
                                <div>
                                    <img src={storeInfo.logo} alt="" />
                                </div>
                            </div>
                            <div>
                                <h2>{storeInfo.name}</h2>
                                <p><span>{storeInfo.nameCn}</span><em>正品</em></p>
                            </div>
                        </div>
                        <div>
                            <div className="flagLine"></div>
				            <div className="flagLine"></div>
                            {/* <a href={window.BT_URL + "market?symbol=" + symbol + "_BT"}>去交易</a> */}
                            <span onClick={() => this.setState({modal_show: true})}>更多+</span>
                            <ul>
                                <li>
                                    <h2>昨日已销毁{symbol}：</h2>
                                    <p>{storeNimingInfo.yesterdayBurnt}</p>
                                </li>
                                <li>
                                    <h2>今日已产出{symbol}：</h2>
                                    <p>{storeNimingInfo.dailyMined}</p>
                                </li>
                                <li>
                                    <h2>今日待产出{symbol}：</h2>
                                    <p>{storeNimingInfo.remaining}</p>
                                </li>
                                <li>
                                    <h2>流通总量{symbol}：</h2>
                                    <p>{storeNimingInfo.turnover}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="store-info">
                        <ul className="clearfix">
                            <li><label>代币名称：</label><span>{storeInfo.name}</span></li>
                            <li><label>合约地址：</label><span>{storeInfo.contractAddress}</span></li>
                            <li><label>发行总量：</label><span>{storeInfo.totalSupply}</span></li>
                            <li><label>简<i></i>介：</label><span>{storeInfo.coinDesc}</span></li>
                        </ul>
                    </div>
                </div>
                <div className="home-con">
                    <div className="home-con-main">
                        <div className="hot-title">
                            <h2><span><i></i>人气商品<i></i></span></h2>
                            <p>智能潮货 嗨购不停</p>
                        </div>
                        <div className="hot-list">
                            <Spin tip="Loading..." spinning={spinning}>
                                <ul className="cleafix" style={{minHeight: '600px'}}>
                                    {
                                        produceList.map((item, index) => {
                                            return (
                                                <StoreItem key={index} data={{...item}} />
                                            )       
                                        })
                                    }
                                </ul>
                            </Spin>
                        </div>
                    </div>
                </div>

                {/* 今日发售 */}
                <DaySaleModal
                    modal_show={modal_show}
                    day_sale_list={day_sale_list}
                    symbol={symbol}
                    currentTime={currentTime}
                    hiddenModal={() => this.setState({modal_show: false})}
                />
            </div>
        )
    }
}

export default StoreHome;