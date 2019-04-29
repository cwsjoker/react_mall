import React, { Component } from 'react'
import { Link }  from 'react-router-dom'
import { connect } from 'react-redux'
import { Spin, Icon } from 'antd'
import { getQueryString } from '../../utils/operLocation.js'
import Navigation from '../home/Navigation.js'
import StoreItem from '../../components/StoreItem'
import DaySaleModal from '../../components/DaySaleModal'
import $home_api from '../../fetch/api/home'
import $user_api from '../../fetch/api/user'
import changeUsdt from '../../utils/convertUsdt'
import { secondToDate } from '../../utils/operation'
import MaskBox from '../../components/MaskBox.js'

const StoreIndex = class StoreIndex extends Component {
    constructor() {
        super()
        this.state = {
            storeIndex: 0, // 
            produceList: [], // 产品列表
            storeInfo: {}, // 店铺的基本信息
            storeNimingInfo: {}, // 店铺的挖矿信息
            available: 0, // 用户可用余额
            symbol: '',
            spinning: true,
            spinning_info: true,
            search_key: '', //搜索商品关键字
            flag: '', // 按类型查看
            sort: 'asc', // 升降序
            day_sale_list: [], // 今日发售列表
            currentTime: '', // 服务器当前时间
            nextReleaseTime: '', // 下一个区间段时间
            diff_count: '', // 倒计时秒数
            modal_show: false, // 今日发售列表show
            
        }
    }

    componentDidMount() {
        const id = getQueryString(this.props.location.search).id;
        if (id) {
            this.setState({
                storeIndex: id
            }, () => {
                this.getDayList();
                this.getList();
            })
        }
    }
    componentDidUpdate() {
        const id = getQueryString(this.props.location.search).id;
        if (id !== this.state.storeIndex) {
            // 清除计时器重置state
            clearInterval(this.timerID)
            this.setState({
                storeIndex: id,
                produceList: [],
                storeInfo: {},
                storeNimingInfo: {},
                available: 0,
                spinning: true,
                spinning_info: true,
                flag: '',
                sort: 'asc',
                search_key: '',
                day_sale_list: [],
                currentTime: '',
                nextReleaseTime: '',
                diff_count: '',
            }, () => {
                this.getDayList();
                this.getList();
            })
        }
    }
    componentWillUnmount() {
        clearInterval(this.timerID)
    }
    // 搜索订单关键字
    changeSearchKey = (e) => {
        e.preventDefault();
        this.setState({
            search_key: e.target.value
        })
    }
    // 选择查看type
    changeOrderType = (value) => {
        const { flag, sort } = this.state;
        if (flag === value) {
            if (value !== '') {
                const sort_key = sort === 'asc' ? 'desc' : 'asc';
                this.setState({
                    sort: sort_key
                }, () => {
                    this.getList();
                })
            }
        } else {
            this.setState({
                flag: value,
                sort: 'asc'
            }, () => {
                this.getList();
            })
        }
    }
    async getList() {
        const { storeIndex, search_key, flag, sort } = this.state;
        const query = flag !== '' ? {flag, sort} : {};
        let [res_produce, res_store] = await Promise.all([
            $home_api.getProduceList({producerId: storeIndex, goodsName: search_key, ...query}),
            $home_api.getStoreInfo({'producerId': storeIndex})
        ])

        // 获取商品列表
        if (res_produce) {
            const data = await changeUsdt(res_produce.data.data)
            this.setState({
                produceList: data,
                spinning: false
            })
        }

        // 获取店铺的信息
        if (res_store) {
            const { data } = res_store.data;
            this.setState({
                storeInfo: data,
                symbol: data.symbol,
            })
            // 获取当前剩额
            let res_blance = await $user_api.getUserFinance({coinSymbol: data.symbol})
            if (res_blance &&　res_blance.data.data) {
                this.setState({
                    available: res_blance.data.data.available,
                })
            }
            this.setState({
                spinning_info: false
            })
        }


        // 获取店铺的挖矿详情
        $home_api.getStoreNimingInfo({
            'producerId': parseInt(this.state.storeIndex)
        }).then(res => {
            if (res) {
                this.setState({
                    storeNimingInfo: res.data.data[0]
                })
            }
        })
    }
    // 获取今日发售列表
    getDayList() {
        $home_api.selectMiningProgress({
            'producerId': parseInt(this.state.storeIndex)
        }).then(res => {
            if (res) {
                const {miningPlanProgressDTOList, currentTime, nextReleaseTime} = res.data.data;
                const d1 = new Date(currentTime);
                const d2 = new Date(nextReleaseTime);
                const diff_count = parseInt(d2 - d1) / 1000;
                this.setState({
                    day_sale_list: miningPlanProgressDTOList,
                    nextReleaseTime: nextReleaseTime,
                    currentTime: currentTime,
                    diff_count: diff_count
                }, () => {
                    this.timerID = setInterval(() => {
                        // console.log(this.state.diff_count);
                        if (this.state.diff_count === 0) {
                            clearInterval(this.timerID);
                            return;
                        }
                        this.setState((prevState) => ({
                            diff_count: prevState.diff_count - 1
                        }))
                    }, 1000)
                })
            }
        })
    }
    render() {
        const { spinning, spinning_info, storeNimingInfo, search_key, flag, sort, modal_show, day_sale_list, currentTime, diff_count } = this.state;
        const { turnover, symbol, dailyMined, remaining, yesterdayBurnt } = storeNimingInfo;
        return (
            <div className="store-main">
                <div className="store-main-nav">
                    <Navigation storeIndex={this.state.storeIndex} />
                </div>
                <div className="store-main-con">
                    <Spin tip="" spinning={spinning_info}>
                        <div className="store-countdown">
                            <span>距离下轮交易挖矿时间</span>
                            <span>{secondToDate(diff_count)}</span>
                        </div>
                        <div className="store-title">
                            <MaskBox show={true} />
                            <div className="store-title-top cleafix">
                                <div className="store-title-top-img"><img src={window.BACK_URL + this.state.storeInfo.logoUrl} alt="" /></div>
                                <div className="store-title-top-info">
                                    <Link to={'/storeHome?id=' +　this.state.storeIndex }>{this.state.storeInfo.name}</Link>
                                    <h3><span>官方自营</span></h3>
                                    <p>我的余额:<span>{this.state.available}</span><em>{this.state.symbol}</em><a href={window.BT_URL + "market?symbol=" + symbol + "_BT"}>去交易</a></p>
                                </div>
                            </div>
                            <div className="flagBom cleafix">
                                <div className="flagLine"></div>
                                <div className="flagLine1"></div>
                                <ul>
                                    <li>
                                        <h2>流通总量：</h2>
                                        <p>{turnover || 0}</p>
                                    </li>
                                    <li>
                                        <h2>今日已产出：{symbol}</h2>
                                        <p>{dailyMined || 0}</p>
                                    </li>
                                    <li>
                                        <h2>今日待产出：{symbol}</h2>
                                        <p>{remaining || 0}</p>
                                    </li>
                                    <li>
                                        <h2>昨日已销毁：{symbol}</h2>
                                        <p>{yesterdayBurnt || 0}</p>
                                    </li>
                                </ul>
                            </div>
                            <span className="store-title-more" onClick={() => this.setState({modal_show: true})}>更多+</span>
                        </div>
                    </Spin>

                    <div className="store-top">
                        <div className="store-top-left">
                            <div className={flag === '' ? 'on' : ''} onClick={() => this.changeOrderType('')}><div>综合</div></div>
                            <div className={flag === 'sales' ? 'on' : ''} onClick={() => this.changeOrderType('sales')}>
                                <div>销量</div>
                                <div className="sort-btn">
                                    <Icon className={flag === 'sales' && sort === 'asc' ? 'on' : ''} type="caret-up" />
                                    <Icon className={flag === 'sales' && sort === 'desc' ? 'on' : ''} type="caret-down" />
                                </div>
                            </div>
                            <div className={flag === 'price' ? 'on' : ''} onClick={() => this.changeOrderType('price')}>
                                <div>价格</div>
                                <div className="sort-btn">
                                    <Icon className={flag === 'price' && sort === 'asc' ? 'on' : ''} type="caret-up" />
                                    <Icon className={flag === 'price' && sort === 'desc' ? 'on' : ''} type="caret-down" />
                                </div>
                            </div>
                        </div>
                        <div className="store-top-right">
                            <div className="search-inp">
                                <Icon type="search" />
                                <input type="text" placeholder="输入商品名称" value={search_key} onChange={this.changeSearchKey} />
                            </div>
                            <div className="search-btn" onClick={() => this.getList()}>搜索</div>
                        </div>
                    </div>
                    <div className="store-list">
                        <MaskBox show={true} />
                        <div className="title">
                            <i></i>
                            <h2>{this.state.storeInfo.name}</h2>
                        </div>
                        <Spin tip="Loading..." spinning={spinning}>
                            <ul className="cleafix" style={{minHeight: '600px'}}>
                                {
                                    this.state.produceList.map((item, index) => {
                                        return (
                                            <StoreItem key={index} data={{...item}} />
                                        )       
                                    })
                                }
                            </ul>
                        </Spin>
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

export default connect()(StoreIndex);